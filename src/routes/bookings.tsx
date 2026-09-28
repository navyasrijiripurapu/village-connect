import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  CheckCircle,
  XCircle,
  Clock,
  Calendar,
  User,
  IndianRupee,
  MapPin,
  ClipboardList,
} from "lucide-react";
import {
  PageLayout,
  PageHeader,
} from "@/components/PageLayout";

export const Route = createFileRoute("/bookings")({
  component: BookingsPage,
});

type Booking = {
  _id: string;
  resource?: string;
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

function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  const loadBookings = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      if (!token) {
        setBookings([]);
        return;
      }

      const response = await fetch(
        "http://localhost:5000/api/bookings/my",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(
          data.message ||
            "Failed to load your bookings"
        );
        return;
      }

      setBookings(data.bookings || []);
    } catch (error) {
      console.error(
        "Load bookings error:",
        error
      );

      alert(
        "Cannot connect to the backend."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookings();

    const interval = setInterval(() => {
      loadBookings();
    }, 5000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  const pendingBookings = bookings.filter(
    (booking) => booking.status === "Pending"
  );

  const acceptedBookings = bookings.filter(
    (booking) => booking.status === "Accepted"
  );

  const rejectedBookings = bookings.filter(
    (booking) => booking.status === "Rejected"
  );

  return (
    <PageLayout>
      <div className="mx-auto max-w-5xl px-4 py-10">

        <PageHeader
          title="My Bookings"
          subtitle="Track your resource requests and booking status."
        />

        {/* SUMMARY */}
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">

          {/* PENDING */}
          <div className="rounded-xl border bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-yellow-100 p-3">
                <Clock className="h-6 w-6 text-yellow-700" />
              </div>

              <div>
                <p className="text-sm text-gray-500">
                  Pending
                </p>

                <p className="text-2xl font-bold">
                  {pendingBookings.length}
                </p>
              </div>
            </div>
          </div>

          {/* ACCEPTED */}
          <div className="rounded-xl border bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-green-100 p-3">
                <CheckCircle className="h-6 w-6 text-green-700" />
              </div>

              <div>
                <p className="text-sm text-gray-500">
                  Accepted
                </p>

                <p className="text-2xl font-bold">
                  {acceptedBookings.length}
                </p>
              </div>
            </div>
          </div>

          {/* REJECTED */}
          <div className="rounded-xl border bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-red-100 p-3">
                <XCircle className="h-6 w-6 text-red-700" />
              </div>

              <div>
                <p className="text-sm text-gray-500">
                  Rejected
                </p>

                <p className="text-2xl font-bold">
                  {rejectedBookings.length}
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* LOADING */}
        {loading && (
          <div className="mt-8 rounded-2xl border bg-white p-10 text-center">
            <p className="text-gray-500">
              Loading your bookings...
            </p>
          </div>
        )}

        {/* NO BOOKINGS */}
        {!loading && bookings.length === 0 && (
          <div className="mt-8 rounded-2xl border bg-white p-10 text-center">

            <ClipboardList className="mx-auto mb-4 h-12 w-12 text-gray-400" />

            <h2 className="text-xl font-bold text-gray-800">
              No bookings yet
            </h2>

            <p className="mt-2 text-gray-500">
              When you request a resource,
              your booking will appear here.
            </p>

          </div>
        )}

        {/* BOOKINGS */}
        {!loading && bookings.length > 0 && (
          <div className="mt-8 space-y-5">

            {bookings.map((booking) => (
              <div
                key={booking._id}
                className="overflow-hidden rounded-2xl border bg-white shadow-sm"
              >

                {/* ACCEPTED */}
                {booking.status === "Accepted" && (
                  <div className="flex items-start gap-3 border-b border-green-200 bg-green-50 p-5">

                    <CheckCircle className="mt-0.5 h-6 w-6 shrink-0 text-green-700" />

                    <div>
                      <h3 className="font-bold text-green-800">
                        Request Accepted
                      </h3>

                      <p className="mt-1 text-sm text-green-700">
                        The owner has accepted your
                        request for{" "}
                        <strong>
                          {booking.resourceName}
                        </strong>
                        .
                      </p>
                    </div>

                  </div>
                )}

                {/* REJECTED */}
                {booking.status === "Rejected" && (
                  <div className="flex items-start gap-3 border-b border-red-200 bg-red-50 p-5">

                    <XCircle className="mt-0.5 h-6 w-6 shrink-0 text-red-700" />

                    <div>
                      <h3 className="font-bold text-red-800">
                        Request Rejected
                      </h3>

                      <p className="mt-1 text-sm text-red-700">
                        The owner has rejected your
                        request for{" "}
                        <strong>
                          {booking.resourceName}
                        </strong>
                        .
                      </p>
                    </div>

                  </div>
                )}

                {/* PENDING */}
                {booking.status === "Pending" && (
                  <div className="flex items-start gap-3 border-b border-yellow-200 bg-yellow-50 p-5">

                    <Clock className="mt-0.5 h-6 w-6 shrink-0 text-yellow-700" />

                    <div>
                      <h3 className="font-bold text-yellow-800">
                        Request Pending
                      </h3>

                      <p className="mt-1 text-sm text-yellow-700">
                        Your request has been sent
                        to the resource owner.
                        Waiting for their response.
                      </p>
                    </div>

                  </div>
                )}

                {/* CANCELLED */}
                {booking.status === "Cancelled" && (
                  <div className="flex items-start gap-3 border-b border-gray-200 bg-gray-50 p-5">

                    <XCircle className="mt-0.5 h-6 w-6 shrink-0 text-gray-600" />

                    <div>
                      <h3 className="font-bold text-gray-800">
                        Request Cancelled
                      </h3>

                      <p className="mt-1 text-sm text-gray-600">
                        This booking has been
                        cancelled.
                      </p>
                    </div>

                  </div>
                )}

                {/* COMPLETED */}
                {booking.status === "Completed" && (
                  <div className="flex items-start gap-3 border-b border-blue-200 bg-blue-50 p-5">

                    <CheckCircle className="mt-0.5 h-6 w-6 shrink-0 text-blue-700" />

                    <div>
                      <h3 className="font-bold text-blue-800">
                        Booking Completed
                      </h3>

                      <p className="mt-1 text-sm text-blue-700">
                        This resource booking has
                        been completed.
                      </p>
                    </div>

                  </div>
                )}

                {/* BOOKING DETAILS */}
                <div className="p-6">

                  {/* TOP */}
                  <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">

                    <div>
                      <p className="text-sm text-gray-500">
                        Resource
                      </p>

                      <h2 className="text-xl font-bold text-gray-900">
                        {booking.resourceName}
                      </h2>
                    </div>

                    <span
                      className={`w-fit rounded-full px-4 py-1.5 text-sm font-semibold ${
                        booking.status === "Pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : booking.status === "Accepted"
                          ? "bg-green-100 text-green-800"
                          : booking.status === "Rejected"
                          ? "bg-red-100 text-red-800"
                          : booking.status === "Completed"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {booking.status}
                    </span>

                  </div>

                  {/* DETAILS */}
                  <div className="mt-6 grid gap-5 sm:grid-cols-2">

                    {/* OWNER */}
                    <div className="flex gap-3">
                      <User className="mt-1 h-5 w-5 text-green-700" />

                      <div>
                        <p className="text-xs text-gray-500">
                          Resource Owner
                        </p>

                        <p className="font-semibold">
                          {booking.ownerName}
                        </p>
                      </div>
                    </div>

                    {/* VILLAGE */}
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

                    {/* DATE */}
                    <div className="flex gap-3">
                      <Calendar className="mt-1 h-5 w-5 text-green-700" />

                      <div>
                        <p className="text-xs text-gray-500">
                          Booking Date
                        </p>

                        <p className="font-semibold">
                          {booking.bookingDate}
                        </p>
                      </div>
                    </div>

                    {/* TIME */}
                    <div className="flex gap-3">
                      <Clock className="mt-1 h-5 w-5 text-green-700" />

                      <div>
                        <p className="text-xs text-gray-500">
                          Booking Time
                        </p>

                        <p className="font-semibold">
                          {booking.bookingTime}
                        </p>
                      </div>
                    </div>

                    {/* PRICE */}
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

                </div>

              </div>
            ))}

          </div>
        )}

      </div>
    </PageLayout>
  );
}