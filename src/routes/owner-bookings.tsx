import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  Check,
  X,
  Clock,
  User,
  Phone,
  MapPin,
  Calendar,
  IndianRupee,
  ClipboardList,
} from "lucide-react";
import {
  PageLayout,
  PageHeader,
} from "@/components/PageLayout";

export const Route = createFileRoute("/owner-bookings")({
  component: OwnerBookingsPage,
});

type Booking = {
  _id: string;
  resourceName: string;
  farmerName: string;
  ownerName: string;
  phone: string;
  village: string;
  bookingDate: string;
  bookingTime: string;
  price: number;
  status:
    | "Pending"
    | "Accepted"
    | "Rejected"
    | "Completed"
    | "Cancelled";
};

function OwnerBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] =
    useState<string | null>(null);

  const loadBookings = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      if (!token) {
        setBookings([]);
        return;
      }

      const response = await fetch(
        "http://localhost:5000/api/bookings/owner",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to load resource requests"
        );
      }

      setBookings(data.bookings || []);
    } catch (error) {
      console.error(
        "Load resource requests error:",
        error
      );

      alert(
        "Failed to load resource requests."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookings();
  }, []);

  const handleRequest = async (
    bookingId: string,
    action: "accept" | "reject"
  ) => {
    try {
      setProcessingId(bookingId);

      const token = localStorage.getItem("token");

      if (!token) {
        alert("Please login first.");
        return;
      }

      const response = await fetch(
        `http://localhost:5000/api/bookings/owner/${bookingId}/${action}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            `Failed to ${action} request`
        );
      }

      alert(
        action === "accept"
          ? "Resource request accepted!"
          : "Resource request rejected!"
      );

      await loadBookings();
    } catch (error) {
      console.error(
        "Request action error:",
        error
      );

      alert(
        error instanceof Error
          ? error.message
          : "Something went wrong."
      );
    } finally {
      setProcessingId(null);
    }
  };

  const pendingCount = bookings.filter(
    (booking) => booking.status === "Pending"
  ).length;

  return (
    <PageLayout>
      <div className="mx-auto max-w-5xl px-4 py-10">

        <PageHeader
          title="Resource Requests"
          description="See who has requested your resources and manage their requests."
        />

        {/* SUMMARY */}
        <div className="mt-6 grid gap-4 sm:grid-cols-3">

          <div className="rounded-xl border bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-yellow-100 p-3">
                <Clock className="h-6 w-6 text-yellow-700" />
              </div>

              <div>
                <p className="text-sm text-gray-500">
                  Pending Requests
                </p>

                <p className="text-2xl font-bold">
                  {pendingCount}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-xl border bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-green-100 p-3">
                <Check className="h-6 w-6 text-green-700" />
              </div>

              <div>
                <p className="text-sm text-gray-500">
                  Accepted
                </p>

                <p className="text-2xl font-bold">
                  {
                    bookings.filter(
                      (booking) =>
                        booking.status ===
                        "Accepted"
                    ).length
                  }
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-xl border bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-red-100 p-3">
                <X className="h-6 w-6 text-red-700" />
              </div>

              <div>
                <p className="text-sm text-gray-500">
                  Rejected
                </p>

                <p className="text-2xl font-bold">
                  {
                    bookings.filter(
                      (booking) =>
                        booking.status ===
                        "Rejected"
                    ).length
                  }
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* LOADING */}
        {loading && (
          <div className="mt-8 rounded-2xl border bg-white p-10 text-center">
            <p className="text-gray-500">
              Loading resource requests...
            </p>
          </div>
        )}

        {/* EMPTY */}
        {!loading && bookings.length === 0 && (
          <div className="mt-8 rounded-2xl border bg-white p-10 text-center">

            <ClipboardList className="mx-auto mb-4 h-12 w-12 text-gray-400" />

            <h2 className="text-xl font-bold">
              No resource requests yet
            </h2>

            <p className="mt-2 text-gray-500">
              When someone requests one of
              your resources, the request will
              appear here.
            </p>

          </div>
        )}

        {/* REQUESTS */}
        {!loading && bookings.length > 0 && (
          <div className="mt-8 space-y-5">

            {bookings.map((booking) => (
              <div
                key={booking._id}
                className="rounded-2xl border bg-white p-6 shadow-sm"
              >

                {/* HEADER */}
                <div className="flex flex-col justify-between gap-3 border-b pb-5 sm:flex-row sm:items-center">

                  <div>
                    <p className="text-sm text-gray-500">
                      Resource requested
                    </p>

                    <h2 className="text-xl font-bold">
                      {booking.resourceName}
                    </h2>
                  </div>

                  <span
                    className={`w-fit rounded-full px-4 py-1.5 text-sm font-semibold ${
                      booking.status ===
                      "Pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : booking.status ===
                          "Accepted"
                        ? "bg-green-100 text-green-800"
                        : booking.status ===
                          "Rejected"
                        ? "bg-red-100 text-red-800"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {booking.status}
                  </span>

                </div>

                {/* DETAILS */}
                <div className="mt-5 grid gap-5 sm:grid-cols-2">

                  <div className="flex gap-3">
                    <User className="mt-1 h-5 w-5 text-green-700" />

                    <div>
                      <p className="text-xs text-gray-500">
                        Requested by
                      </p>

                      <p className="font-semibold">
                        {booking.farmerName}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Phone className="mt-1 h-5 w-5 text-green-700" />

                    <div>
                      <p className="text-xs text-gray-500">
                        Contact
                      </p>

                      <p className="font-semibold">
                        {booking.phone}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <MapPin className="mt-1 h-5 w-5 text-green-700" />

                    <div>
                      <p className="text-xs text-gray-500">
                        Village
                      </p>

                      <p className="font-semibold">
                        {booking.village}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Calendar className="mt-1 h-5 w-5 text-green-700" />

                    <div>
                      <p className="text-xs text-gray-500">
                        Booking date
                      </p>

                      <p className="font-semibold">
                        {booking.bookingDate}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Clock className="mt-1 h-5 w-5 text-green-700" />

                    <div>
                      <p className="text-xs text-gray-500">
                        Booking time
                      </p>

                      <p className="font-semibold">
                        {booking.bookingTime}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <IndianRupee className="mt-1 h-5 w-5 text-green-700" />

                    <div>
                      <p className="text-xs text-gray-500">
                        Price
                      </p>

                      <p className="font-semibold">
                        ₹{booking.price}
                      </p>
                    </div>
                  </div>

                </div>

                {/* ACTIONS */}
                {booking.status === "Pending" && (
                  <div className="mt-6 flex flex-col gap-3 border-t pt-5 sm:flex-row">

                    <button
                      type="button"
                      disabled={
                        processingId ===
                        booking._id
                      }
                      onClick={() =>
                        handleRequest(
                          booking._id,
                          "accept"
                        )
                      }
                      className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-green-700 px-4 py-3 font-semibold text-white hover:bg-green-800 disabled:opacity-50"
                    >
                      <Check className="h-5 w-5" />

                      {processingId ===
                      booking._id
                        ? "Processing..."
                        : "Accept Request"}
                    </button>

                    <button
                      type="button"
                      disabled={
                        processingId ===
                        booking._id
                      }
                      onClick={() =>
                        handleRequest(
                          booking._id,
                          "reject"
                        )
                      }
                      className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-red-300 px-4 py-3 font-semibold text-red-700 hover:bg-red-50 disabled:opacity-50"
                    >
                      <X className="h-5 w-5" />

                      Reject Request
                    </button>

                  </div>
                )}

              </div>
            ))}

          </div>
        )}

      </div>
    </PageLayout>
  );
}