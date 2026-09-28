import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  Users,
  Package,
  CalendarCheck,
  LogOut,
  RefreshCw,
  ShieldCheck,
} from "lucide-react";
import { PageLayout, PageHeader } from "@/components/PageLayout";

export const Route = createFileRoute("/admin")({
  component: AdminPage,
});

type DashboardData = {
  users: number;
  resources: number;
  bookings: number;
};

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
  status: string;
};

function AdminPage() {
  const navigate = useNavigate();

  const [dashboard, setDashboard] =
    useState<DashboardData>({
      users: 0,
      resources: 0,
      bookings: 0,
    });

  const [bookings, setBookings] = useState<Booking[]>([]);

  const [loading, setLoading] = useState(true);
  const [bookingsLoading, setBookingsLoading] =
    useState(true);

  const [error, setError] = useState("");
  const [bookingError, setBookingError] = useState("");

  const loadDashboard = async () => {
    setLoading(true);
    setError("");

    try {
      const adminToken =
        localStorage.getItem("adminToken");

      if (!adminToken) {
        navigate({ to: "/login" });
        return;
      }

      const response = await fetch(
        "http://localhost:5000/api/admin/dashboard",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${adminToken}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        if (
          response.status === 401 ||
          response.status === 403
        ) {
          localStorage.removeItem("adminToken");
          localStorage.removeItem("loggedIn");
          localStorage.removeItem("userRole");

          window.dispatchEvent(
            new Event("villageConnectAuthChanged")
          );

          navigate({ to: "/login" });
          return;
        }

        throw new Error(
          data.message ||
            "Failed to load dashboard"
        );
      }

      setDashboard({
        users: Number(data.users || 0),
        resources: Number(data.resources || 0),
        bookings: Number(data.bookings || 0),
      });
    } catch (err) {
      console.error(
        "Dashboard error:",
        err
      );

      setError(
        "Unable to load dashboard data. Please make sure the backend is running."
      );
    } finally {
      setLoading(false);
    }
  };

  const loadBookings = async () => {
    setBookingsLoading(true);
    setBookingError("");

    try {
      const adminToken =
        localStorage.getItem("adminToken");

      if (!adminToken) {
        navigate({ to: "/login" });
        return;
      }

      const response = await fetch(
        "http://localhost:5000/api/bookings/admin/all",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${adminToken}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        if (
          response.status === 401 ||
          response.status === 403
        ) {
          localStorage.removeItem("adminToken");
          localStorage.removeItem("loggedIn");
          localStorage.removeItem("userRole");

          window.dispatchEvent(
            new Event("villageConnectAuthChanged")
          );

          navigate({ to: "/login" });
          return;
        }

        throw new Error(
          data.message ||
            "Failed to load bookings"
        );
      }

      /*
       * Supports either:
       * { bookings: [...] }
       * or directly [...]
       */
      if (Array.isArray(data)) {
        setBookings(data);
      } else {
        setBookings(
          Array.isArray(data.bookings)
            ? data.bookings
            : []
        );
      }
    } catch (err) {
      console.error(
        "Bookings error:",
        err
      );

      setBookingError(
        "Unable to load booking details."
      );
    } finally {
      setBookingsLoading(false);
    }
  };

  const loadAllData = async () => {
    await Promise.all([
      loadDashboard(),
      loadBookings(),
    ]);
  };

  useEffect(() => {
    loadAllData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem(
      "adminToken"
    );

    localStorage.removeItem(
      "token"
    );

    localStorage.removeItem(
      "loggedIn"
    );

    localStorage.removeItem(
      "userRole"
    );

    localStorage.removeItem(
      "villageConnectProfile"
    );

    window.dispatchEvent(
      new Event(
        "villageConnectAuthChanged"
      )
    );

    navigate({ to: "/login" });
  };

  const getStatusClass = (
    status: string
  ) => {
    switch (status) {
      case "Accepted":
        return "bg-green-100 text-green-700";

      case "Rejected":
        return "bg-red-100 text-red-700";

      case "Completed":
        return "bg-blue-100 text-blue-700";

      case "Cancelled":
        return "bg-gray-100 text-gray-700";

      default:
        return "bg-yellow-100 text-yellow-700";
    }
  };

  return (
    <PageLayout>
      <div className="max-w-7xl mx-auto px-4 py-8">

        <PageHeader
          title="Admin Dashboard"
          description="Manage and monitor Village Connect"
        />

        {/* Header Actions */}
        <div className="flex justify-end gap-3 mt-6">

          <button
            type="button"
            onClick={loadAllData}
            disabled={
              loading ||
              bookingsLoading
            }
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            <RefreshCw
              className={`w-4 h-4 ${
                loading ||
                bookingsLoading
                  ? "animate-spin"
                  : ""
              }`}
            />

            Refresh
          </button>

          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-red-500 text-red-600 hover:bg-red-50"
          >
            <LogOut className="w-4 h-4" />

            Logout
          </button>

        </div>

        {/* Dashboard Error */}
        {error && (
          <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
            {error}
          </div>
        )}

        {/* Dashboard Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">

          {/* USERS */}
          <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">

            <div className="flex items-center justify-between">

              <div>
                <p className="text-gray-500 text-sm font-medium">
                  Registered Users
                </p>

                <h2 className="text-4xl font-bold text-gray-900 mt-2">
                  {loading
                    ? "..."
                    : dashboard.users}
                </h2>
              </div>

              <div className="w-14 h-14 rounded-xl bg-green-100 flex items-center justify-center">
                <Users className="w-7 h-7 text-green-700" />
              </div>

            </div>

            <p className="text-sm text-gray-500 mt-4">
              Total users registered in Village Connect
            </p>

          </div>

          {/* RESOURCES */}
          <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">

            <div className="flex items-center justify-between">

              <div>
                <p className="text-gray-500 text-sm font-medium">
                  Resources
                </p>

                <h2 className="text-4xl font-bold text-gray-900 mt-2">
                  {loading
                    ? "..."
                    : dashboard.resources}
                </h2>
              </div>

              <div className="w-14 h-14 rounded-xl bg-blue-100 flex items-center justify-center">
                <Package className="w-7 h-7 text-blue-700" />
              </div>

            </div>

            <p className="text-sm text-gray-500 mt-4">
              Agricultural resources listed by users
            </p>

          </div>

          {/* BOOKINGS */}
          <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">

            <div className="flex items-center justify-between">

              <div>
                <p className="text-gray-500 text-sm font-medium">
                  Bookings
                </p>

                <h2 className="text-4xl font-bold text-gray-900 mt-2">
                  {loading
                    ? "..."
                    : dashboard.bookings}
                </h2>
              </div>

              <div className="w-14 h-14 rounded-xl bg-purple-100 flex items-center justify-center">
                <CalendarCheck className="w-7 h-7 text-purple-700" />
              </div>

            </div>

            <p className="text-sm text-gray-500 mt-4">
              Total resource booking requests
            </p>

          </div>

        </div>

        {/* BOOKING DETAILS */}
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 mt-8">

          <div className="p-6 border-b border-gray-200">

            <div className="flex items-center justify-between">

              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Booking Details
                </h2>

                <p className="text-gray-500 text-sm mt-1">
                  View all resource bookings made by farmers
                </p>
              </div>

              <CalendarCheck className="w-7 h-7 text-purple-700" />

            </div>

          </div>

          {bookingError && (
            <div className="m-6 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
              {bookingError}
            </div>
          )}

          {bookingsLoading ? (
            <div className="p-8 text-center text-gray-500">
              Loading booking details...
            </div>
          ) : bookings.length === 0 ? (
            <div className="p-8 text-center">

              <CalendarCheck className="w-12 h-12 mx-auto text-gray-300" />

              <p className="mt-3 text-gray-500">
                No bookings found.
              </p>

            </div>
          ) : (
            <div className="overflow-x-auto">

              <table className="w-full text-sm">

                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">

                    <th className="text-left px-5 py-4 font-semibold text-gray-700">
                      Farmer
                    </th>

                    <th className="text-left px-5 py-4 font-semibold text-gray-700">
                      Resource
                    </th>

                    <th className="text-left px-5 py-4 font-semibold text-gray-700">
                      Owner
                    </th>

                    <th className="text-left px-5 py-4 font-semibold text-gray-700">
                      Phone
                    </th>

                    <th className="text-left px-5 py-4 font-semibold text-gray-700">
                      Village
                    </th>

                    <th className="text-left px-5 py-4 font-semibold text-gray-700">
                      Date
                    </th>

                    <th className="text-left px-5 py-4 font-semibold text-gray-700">
                      Time
                    </th>

                    <th className="text-left px-5 py-4 font-semibold text-gray-700">
                      Price
                    </th>

                    <th className="text-left px-5 py-4 font-semibold text-gray-700">
                      Status
                    </th>

                  </tr>
                </thead>

                <tbody>

                  {bookings.map(
                    (booking) => (
                      <tr
                        key={booking._id}
                        className="border-b border-gray-100 hover:bg-gray-50"
                      >

                        <td className="px-5 py-4 font-medium text-gray-900">
                          {booking.farmerName ||
                            "—"}
                        </td>

                        <td className="px-5 py-4 text-gray-700">
                          {booking.resourceName ||
                            "—"}
                        </td>

                        <td className="px-5 py-4 text-gray-700">
                          {booking.ownerName ||
                            "—"}
                        </td>

                        <td className="px-5 py-4 text-gray-700">
                          {booking.phone ||
                            "—"}
                        </td>

                        <td className="px-5 py-4 text-gray-700">
                          {booking.village ||
                            "—"}
                        </td>

                        <td className="px-5 py-4 text-gray-700">
                          {booking.bookingDate ||
                            "—"}
                        </td>

                        <td className="px-5 py-4 text-gray-700">
                          {booking.bookingTime ||
                            "—"}
                        </td>

                        <td className="px-5 py-4 font-medium text-gray-900">
                          ₹
                          {Number(
                            booking.price || 0
                          ).toLocaleString(
                            "en-IN"
                          )}
                        </td>

                        <td className="px-5 py-4">

                          <span
                            className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getStatusClass(
                              booking.status
                            )}`}
                          >
                            {booking.status ||
                              "Pending"}
                          </span>

                        </td>

                      </tr>
                    )
                  )}

                </tbody>

              </table>

            </div>
          )}

        </div>

        {/* Admin Information */}
        <div className="bg-white rounded-2xl shadow-md p-6 mt-8 border border-gray-100">

          <div className="flex items-center gap-3">

            <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6 text-green-700" />
            </div>

            <div>
              <h2 className="text-xl font-bold text-gray-900">
                Admin Access
              </h2>

              <p className="text-gray-500 text-sm">
                You are logged in as a Village Connect administrator.
              </p>
            </div>

          </div>

        </div>

      </div>
    </PageLayout>
  );
}