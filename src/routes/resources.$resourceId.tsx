import {
  createFileRoute,
  Link,
  useNavigate,
} from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  CalendarDays,
  MapPin,
  Phone,
  IndianRupee,
  CheckCircle,
} from "lucide-react";
import { PageLayout } from "@/components/PageLayout";

type Search = {
  book?: boolean;
};

type Resource = {
  id: string;
  resourceName: string;
  category: string;
  description: string;
  ownerName: string;
  village: string;
  price: number;
  priceUnit: string;
  phone: string;
  available: boolean;
  image: string;
};

export const Route = createFileRoute(
  "/resources/$resourceId"
)({
  validateSearch: (
    search: Record<string, unknown>
  ): Search => ({
    book:
      search["book"] === true ||
      search["book"] === "true",
  }),

  head: () => ({
    meta: [
      {
        title:
          "Resource Details | Village Resource Sharing Network",
      },
      {
        name: "description",
        content:
          "View resource details and send a booking request to the resource owner.",
      },
    ],
  }),

  component: ResourceDetails,
});

function ResourceDetails() {
  const { resourceId } = Route.useParams();
  const { book } = Route.useSearch();
  const navigate = useNavigate();

  const [resource, setResource] =
    useState<Resource | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [date, setDate] =
    useState("");

  const [time, setTime] =
    useState("");

  const [done, setDone] =
    useState(false);

  const [bookingLoading, setBookingLoading] =
    useState(false);

  // =========================================
  // LOAD RESOURCE
  // =========================================

  useEffect(() => {
    const loadResource = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          "http://localhost:5000/api/resources"
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message ||
              "Failed to load resources"
          );
        }

        const found = (
          data.resources || []
        ).find(
          (item: any) =>
            item._id === resourceId
        );

        if (!found) {
          setError("Resource not found");
          setResource(null);
          return;
        }

        const mappedResource: Resource = {
          id: found._id,

          resourceName:
            found.resourceName,

          category:
            found.category,

          description:
            found.description,

          ownerName:
            found.ownerName ||
            "Resource Owner",

          village:
            found.village,

          price:
            Number(found.price) || 0,

          priceUnit:
            found.priceUnit,

          phone:
            found.phone,

          available:
            found.available,

          image:
            found.image ||
            "https://images.unsplash.com/photo-1500595046743-cd271d694d30?auto=format&fit=crop&w=1200&q=80",
        };

        setResource(mappedResource);
      } catch (err) {
        console.error(
          "Resource details error:",
          err
        );

        setError(
          "Cannot connect to the backend. Please make sure the backend is running."
        );
      } finally {
        setLoading(false);
      }
    };

    loadResource();
  }, [resourceId]);

  // =========================================
  // LOADING
  // =========================================

  if (loading) {
    return (
      <PageLayout>
        <div className="mx-auto max-w-3xl px-4 py-20 text-center">
          <h1 className="text-2xl font-extrabold text-primary">
            Loading resource...
          </h1>

          <p className="mt-2 text-muted-foreground">
            Please wait.
          </p>
        </div>
      </PageLayout>
    );
  }

  // =========================================
  // ERROR
  // =========================================

  if (error || !resource) {
    return (
      <PageLayout>
        <div className="mx-auto max-w-3xl px-4 py-20 text-center">

          <h1 className="text-2xl font-extrabold text-primary">
            Resource not found
          </h1>

          <p className="mt-2 text-muted-foreground">
            {error ||
              "This resource does not exist."}
          </p>

          <Link
            to="/resources"
            className="mt-6 inline-block rounded-lg bg-primary px-6 py-3 font-bold text-primary-foreground hover:opacity-90"
          >
            Back to Resources
          </Link>

        </div>
      </PageLayout>
    );
  }

  // =========================================
  // BOOKING
  // =========================================

  const submit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    const token =
      localStorage.getItem("token");

    if (!token) {
      alert(
        "Please login before booking a resource."
      );

      navigate({
        to: "/login",
      });

      return;
    }

    if (!resource.available) {
      alert(
        "This resource is currently unavailable."
      );

      return;
    }

    if (!date) {
      alert(
        "Please select a booking date."
      );

      return;
    }

    if (!time) {
      alert(
        "Please select a booking time."
      );

      return;
    }

    try {
      setBookingLoading(true);

      const response = await fetch(
        "http://localhost:5000/api/bookings",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",

            Authorization:
              `Bearer ${token}`,
          },

          body: JSON.stringify({
            resourceId:
              resource.id,

            bookingDate:
              date,

            bookingTime:
              time,
          }),
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        alert(
          data.message ||
            "Failed to create booking."
        );

        return;
      }

      setDone(true);

    } catch (error) {
      console.error(
        "Booking error:",
        error
      );

      alert(
        "Cannot connect to the backend. Please make sure the backend is running."
      );
    } finally {
      setBookingLoading(false);
    }
  };

  const today =
    new Date()
      .toISOString()
      .split("T")[0];

  return (
    <PageLayout>

      <div className="mx-auto max-w-7xl px-4 py-8">

        {/* BACK */}

        <Link
          to="/resources"
          className="mb-5 inline-flex items-center gap-2 font-bold text-primary hover:underline"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Resources
        </Link>

        <div className="grid gap-8 lg:grid-cols-[1.6fr_1fr]">

          {/* =====================================
              LEFT SIDE
          ===================================== */}

          <div>

            {/* IMAGE */}

            <img
              src={resource.image}
              alt={resource.resourceName}
              width={1200}
              height={700}
              className="h-72 w-full rounded-xl border-4 border-primary object-cover sm:h-96"
            />

            <div className="mt-6 rounded-xl border-2 border-border border-t-8 border-t-primary bg-card p-6">

              {/* RESOURCE HEADER */}

              <div className="flex flex-col justify-between gap-4 sm:flex-row">

                <div>

                  <span className="inline-block rounded-md bg-primary px-3 py-1 text-xs font-bold text-primary-foreground">
                    {resource.category}
                  </span>

                  <h1 className="mt-3 text-2xl font-extrabold text-foreground sm:text-3xl">
                    {resource.resourceName}
                  </h1>

                  <p className="mt-2 text-muted-foreground">
                    Resource Owner
                  </p>

                  <p className="font-semibold text-foreground">
                    {resource.ownerName}
                  </p>

                  <p className="mt-2 flex items-center gap-2 text-muted-foreground">

                    <MapPin className="h-5 w-5 text-secondary" />

                    {resource.village}

                  </p>

                </div>

                {/* AVAILABILITY */}

                <div>

                  <span
                    className={`inline-flex rounded-full px-4 py-2 text-sm font-bold ${
                      resource.available
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {resource.available
                      ? "Available"
                      : "Unavailable"}
                  </span>

                </div>

              </div>

              {/* PRICE */}

              <div className="mt-6 border-t-2 border-border pt-5">

                <p className="text-sm text-muted-foreground">
                  Price
                </p>

                <div className="mt-1 flex items-center gap-1">

                  <IndianRupee className="h-6 w-6 text-secondary" />

                  <span className="text-3xl font-extrabold text-secondary">
                    {resource.price.toLocaleString(
                      "en-IN"
                    )}
                  </span>

                  <span className="text-sm font-semibold text-muted-foreground">
                    / {resource.priceUnit}
                  </span>

                </div>

              </div>

              {/* DESCRIPTION */}

              <div className="mt-7">

                <h2 className="text-lg font-bold text-primary">
                  Description
                </h2>

                <p className="mt-2 leading-7 text-muted-foreground">
                  {resource.description}
                </p>

              </div>

              {/* RESOURCE INFORMATION */}

              <div className="mt-7">

                <h2 className="text-lg font-bold text-primary">
                  Resource Information
                </h2>

                <div className="mt-4 grid gap-4 sm:grid-cols-2">

                  <div className="rounded-lg bg-accent p-4">
                    <p className="text-xs text-muted-foreground">
                      Category
                    </p>

                    <p className="mt-1 font-bold">
                      {resource.category}
                    </p>
                  </div>

                  <div className="rounded-lg bg-accent p-4">
                    <p className="text-xs text-muted-foreground">
                      Village
                    </p>

                    <p className="mt-1 font-bold">
                      {resource.village}
                    </p>
                  </div>

                  <div className="rounded-lg bg-accent p-4">
                    <p className="text-xs text-muted-foreground">
                      Owner
                    </p>

                    <p className="mt-1 font-bold">
                      {resource.ownerName}
                    </p>
                  </div>

                  <div className="rounded-lg bg-accent p-4">
                    <p className="text-xs text-muted-foreground">
                      Availability
                    </p>

                    <p className="mt-1 font-bold">
                      {resource.available
                        ? "Available"
                        : "Unavailable"}
                    </p>
                  </div>

                </div>

              </div>

              {/* LOCATION */}

              <div className="mt-7">

                <h2 className="text-lg font-bold text-primary">
                  Resource Location
                </h2>

                <div className="mt-3 flex items-center gap-3 rounded-xl border-2 border-border bg-accent p-4">

                  <MapPin className="h-6 w-6 shrink-0 text-secondary" />

                  <div>
                    <p className="font-bold">
                      {resource.village}
                    </p>

                    <p className="text-sm text-muted-foreground">
                      Resource is available in this village.
                    </p>
                  </div>

                </div>

              </div>

            </div>
          </div>

          {/* =====================================
              RIGHT SIDE
          ===================================== */}

          <aside className="lg:sticky lg:top-24 lg:self-start">

            <div className="rounded-xl border-4 border-primary bg-card p-6">

              <h2 className="text-xl font-extrabold text-primary">
                Book This Resource
              </h2>

              <p className="mt-2 text-sm text-muted-foreground">
                Select the date and time when you
                need this resource.
              </p>

              {/* SUCCESS */}

              {done ? (

                <div className="mt-5">

                  <div className="rounded-xl border-2 border-green-300 bg-green-50 p-5">

                    <div className="flex items-center gap-3">

                      <CheckCircle className="h-7 w-7 text-green-700" />

                      <h3 className="font-bold text-green-800">
                        Request Sent Successfully
                      </h3>

                    </div>

                    <p className="mt-3 text-sm text-green-700">
                      Your booking request has been
                      sent to the resource owner.
                    </p>

                    <div className="mt-4 rounded-lg bg-white p-4 text-sm">

                      <p>
                        <strong>
                          Resource:
                        </strong>{" "}
                        {resource.resourceName}
                      </p>

                      <p className="mt-2">
                        <strong>
                          Date:
                        </strong>{" "}
                        {date}
                      </p>

                      <p className="mt-2">
                        <strong>
                          Time:
                        </strong>{" "}
                        {time}
                      </p>

                      <p className="mt-2">
                        <strong>
                          Status:
                        </strong>{" "}
                        <span className="font-bold text-yellow-700">
                          Pending
                        </span>
                      </p>

                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        navigate({
                          to: "/bookings",
                        })
                      }
                      className="mt-4 w-full rounded-lg bg-primary px-4 py-3 font-bold text-primary-foreground hover:opacity-90"
                    >
                      Go to My Bookings
                    </button>

                  </div>

                </div>

              ) : !resource.available ? (

                /* UNAVAILABLE */

                <div className="mt-5 rounded-xl border-2 border-gray-300 bg-gray-50 p-5">

                  <p className="font-bold text-gray-800">
                    Resource Currently Unavailable
                  </p>

                  <p className="mt-2 text-sm text-gray-600">
                    This resource cannot be booked
                    right now.
                  </p>

                </div>

              ) : (

                /* BOOKING FORM */

                <form
                  onSubmit={submit}
                  className="mt-5 space-y-5"
                >

                  {/* DATE */}

                  <div>

                    <label
                      htmlFor="booking-date"
                      className="mb-2 block text-sm font-semibold"
                    >
                      Booking Date
                    </label>

                    <input
                      id="booking-date"
                      type="date"
                      value={date}
                      onChange={(e) =>
                        setDate(
                          e.target.value
                        )
                      }
                      min={today}
                      required
                      className="w-full rounded-lg border-2 border-input bg-background px-3 py-3 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />

                  </div>

                  {/* TIME */}

                  <div>

                    <label
                      htmlFor="booking-time"
                      className="mb-2 block text-sm font-semibold"
                    >
                      Booking Time
                    </label>

                    <input
                      id="booking-time"
                      type="time"
                      value={time}
                      onChange={(e) =>
                        setTime(
                          e.target.value
                        )
                      }
                      required
                      className="w-full rounded-lg border-2 border-input bg-background px-3 py-3 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />

                  </div>

                  {/* BUTTON */}

                  <button
                    type="submit"
                    autoFocus={book}
                    disabled={bookingLoading}
                    className="w-full rounded-lg bg-secondary px-4 py-4 text-lg font-bold text-secondary-foreground hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {bookingLoading
                      ? "Sending Request..."
                      : "Book Now"}
                  </button>

                </form>
              )}

              {/* CONTACT */}

              <a
                href={`tel:${resource.phone.replace(
                  /\s/g,
                  ""
                )}`}
                className="mt-5 flex items-center justify-center gap-2 rounded-lg border-2 border-primary px-4 py-3 font-bold text-primary hover:bg-accent"
              >
                <Phone className="h-4 w-4" />

                Contact Owner
              </a>

              <p className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">

                <CalendarDays className="h-4 w-4 text-secondary" />

                {resource.available
                  ? "Available for booking"
                  : "Currently unavailable"}

              </p>

            </div>

          </aside>

        </div>
      </div>
    </PageLayout>
  );
}