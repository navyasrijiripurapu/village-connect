import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  MapPin,
  Search,
  SlidersHorizontal,
} from "lucide-react";
import {
  PageLayout,
  PageHeader,
} from "@/components/PageLayout";
import { ResourceCard } from "@/components/ResourceCard";
import {
  CATEGORIES,
  VILLAGES,
} from "@/lib/data";

export const Route = createFileRoute("/resources/")({
  head: () => ({
    meta: [
      {
        title:
          "Find Resources Near You | Village Resource Network",
      },
      {
        name: "description",
        content:
          "Search tractors, harvesters, water tankers, spray machines, borewell machines, rotavators and skilled workers available in your village.",
      },
      {
        property: "og:title",
        content: "Find Resources Near You",
      },
      {
        property: "og:description",
        content:
          "Browse village equipment and skilled workers with availability and prices.",
      },
    ],
  }),

  component: ResourcesPage,
});

const selectClass =
  "w-full rounded-lg border-2 border-input bg-card px-3 py-3 text-base font-medium text-foreground focus:border-primary focus:outline-none";

type ApiResource = {
  _id: string;
  owner:
    | string
    | {
        _id?: string;
        name?: string;
      };
  ownerName: string;
  resourceName: string;
  category: string;
  description: string;
  village: string;
  price: number;
  priceUnit: string;
  phone: string;
  available: boolean;
  image?: string;
  createdAt?: string;
};

type DisplayResource = {
  id: string;
  name: string;
  category: string;
  image: string;
  owner: string;
  phone: string;
  village: string;
  location: string;
  distanceKm: number;
  price: number;
  priceUnit: string;
  available: boolean;
  availableFrom: string;
  rating: number;
  reviews: string[];
  description: string;
  emergencyTags: string[];
};

function ResourcesPage() {
  const [resources, setResources] =
    useState<DisplayResource[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [query, setQuery] =
    useState("");

  const [village, setVillage] =
    useState("All");

  const [category, setCategory] =
    useState("All");

  const [availability, setAvailability] =
    useState("All");

  const [maxPrice, setMaxPrice] =
    useState(2000);

  const [minRating, setMinRating] =
    useState(0);

  useEffect(() => {
    const fetchResources = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          "http://localhost:5000/api/resources"
        );

        const data =
          await response.json();

        if (!response.ok) {
          throw new Error(
            data.message ||
              "Failed to load resources"
          );
        }

        const apiResources: ApiResource[] =
          data.resources || [];

        const formattedResources =
          apiResources.map(
            (resource) => ({
              id: resource._id,

              name:
                resource.resourceName,

              category:
                resource.category,

              image:
                resource.image || "",

              owner:
                resource.ownerName,

              phone:
                resource.phone,

              village:
                resource.village,

              location:
                resource.village,

              distanceKm: 0,

              price:
                resource.price,

              priceUnit:
                `per ${resource.priceUnit.toLowerCase()}`,

              available:
                resource.available,

              availableFrom:
                resource.available
                  ? "Available now"
                  : "Currently unavailable",

              rating: 0,

              reviews: [],

              description:
                resource.description,

              emergencyTags: [
                resource.category,
              ],
            })
          );

        setResources(
          formattedResources
        );
      } catch (error) {
        console.error(
          "Failed to fetch resources:",
          error
        );

        setError(
          "Unable to load resources. Please make sure the backend is running."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchResources();
  }, []);

  const filtered = useMemo(
    () => {
      return resources.filter(
        (resource) => {
          const q =
            query
              .trim()
              .toLowerCase();

          const matchQuery =
            !q ||
            resource.name
              .toLowerCase()
              .includes(q) ||
            resource.category
              .toLowerCase()
              .includes(q) ||
            resource.village
              .toLowerCase()
              .includes(q) ||
            resource.owner
              .toLowerCase()
              .includes(q) ||
            resource.description
              .toLowerCase()
              .includes(q);

          const matchVillage =
            village === "All" ||
            resource.village ===
              village;

          const matchCategory =
            category === "All" ||
            resource.category ===
              category;

          const matchAvailability =
            availability === "All" ||
            (availability ===
              "Available"
              ? resource.available
              : !resource.available);

          const matchPrice =
            resource.price <=
            maxPrice;

          const matchRating =
            minRating === 0 ||
            resource.rating >=
              minRating;

          return (
            matchQuery &&
            matchVillage &&
            matchCategory &&
            matchAvailability &&
            matchPrice &&
            matchRating
          );
        }
      );
    },
    [
      resources,
      query,
      village,
      category,
      availability,
      maxPrice,
      minRating,
    ]
  );

  return (
    <PageLayout>
      <PageHeader
        title="Find Resources Near You"
        subtitle="Search equipment, vehicles and skilled workers shared by villagers around you."
      />

      <div className="mx-auto max-w-7xl px-4 py-8">
        {/* FILTER BOX */}
        <div className="rounded-xl border-4 border-primary bg-card p-4 sm:p-6">
          {/* SEARCH */}
          <label className="relative block">
            <Search className="absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-muted-foreground" />

            <input
              value={query}
              onChange={(e) =>
                setQuery(
                  e.target.value
                )
              }
              placeholder="Search tractors, harvesters, workers, tankers..."
              className="w-full rounded-lg border-2 border-input bg-background py-4 pr-4 pl-12 text-base font-medium focus:border-primary focus:outline-none"
            />
          </label>

          {/* FILTER TITLE */}
          <div className="mt-4 flex items-center gap-2 text-sm font-bold text-primary">
            <SlidersHorizontal className="h-4 w-4" />
            Filters
          </div>

          <div className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {/* VILLAGE */}
            <div>
              <span className="mb-1 block text-sm font-semibold">
                Village / Location
              </span>

              <select
                value={village}
                onChange={(e) =>
                  setVillage(
                    e.target.value
                  )
                }
                className={
                  selectClass
                }
              >
                <option value="All">
                  All Villages
                </option>

                {VILLAGES.map(
                  (v) => (
                    <option
                      key={v}
                      value={v}
                    >
                      {v}
                    </option>
                  )
                )}
              </select>
            </div>

            {/* CATEGORY */}
            <div>
              <span className="mb-1 block text-sm font-semibold">
                Category
              </span>

              <select
                value={category}
                onChange={(e) =>
                  setCategory(
                    e.target.value
                  )
                }
                className={
                  selectClass
                }
              >
                <option value="All">
                  All Categories
                </option>

                {CATEGORIES.map(
                  (c) => (
                    <option
                      key={c}
                      value={c}
                    >
                      {c}
                    </option>
                  )
                )}
              </select>
            </div>

            {/* AVAILABILITY */}
            <div>
              <span className="mb-1 block text-sm font-semibold">
                Availability
              </span>

              <select
                value={availability}
                onChange={(e) =>
                  setAvailability(
                    e.target.value
                  )
                }
                className={
                  selectClass
                }
              >
                <option value="All">
                  All
                </option>

                <option value="Available">
                  Available Now
                </option>

                <option value="Booked">
                  Currently Unavailable
                </option>
              </select>
            </div>

            {/* PRICE */}
            <div>
              <span className="mb-1 block text-sm font-semibold">
                Max Price: ₹
                {maxPrice}
              </span>

              <input
                type="range"
                min={100}
                max={2000}
                step={50}
                value={maxPrice}
                onChange={(e) =>
                  setMaxPrice(
                    Number(
                      e.target.value
                    )
                  )
                }
                className="mt-4 w-full accent-[var(--primary)]"
              />
            </div>

            {/* RATING */}
            <div>
              <span className="mb-1 block text-sm font-semibold">
                Minimum Rating
              </span>

              <select
                value={minRating}
                onChange={(e) =>
                  setMinRating(
                    Number(
                      e.target.value
                    )
                  )
                }
                className={
                  selectClass
                }
              >
                <option value={0}>
                  Any Rating
                </option>

                <option value={4}>
                  4★ and above
                </option>

                <option value={4.5}>
                  4.5★ and above
                </option>
              </select>
            </div>
          </div>
        </div>

        {/* RESULT COUNT */}
        <div className="mt-8 flex flex-wrap items-center justify-between gap-2 border-b-4 border-primary pb-3">
          <p className="text-lg font-bold text-primary">
            {loading
              ? "Loading resources..."
              : `${filtered.length} resources available`}
          </p>

          <p className="flex items-center gap-1 text-sm font-semibold text-muted-foreground">
            <MapPin className="h-4 w-4 text-secondary" />

            Showing results for{" "}
            {village === "All"
              ? "all villages"
              : village}
          </p>
        </div>

        {/* ERROR */}
        {error && (
          <div className="mt-6 rounded-xl border-2 border-red-400 bg-red-50 p-4 text-center text-red-700">
            <p className="font-semibold">
              {error}
            </p>
          </div>
        )}

        {/* LOADING */}
        {loading && !error && (
          <div className="py-16 text-center">
            <p className="text-lg font-semibold text-muted-foreground">
              Loading resources from
              Village Connect...
            </p>
          </div>
        )}

        {/* NO RESULTS */}
        {!loading &&
          !error &&
          filtered.length === 0 && (
            <p className="py-16 text-center text-lg font-semibold text-muted-foreground">
              No resources match your
              search. Try changing the
              filters.
            </p>
          )}

        {/* RESOURCE CARDS */}
        {!loading &&
          !error &&
          filtered.length > 0 && (
            <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filtered.map(
                (resource) => (
                  <ResourceCard
                    key={
                      resource.id
                    }
                    resource={
                      resource
                    }
                  />
                )
              )}
            </div>
          )}
      </div>
    </PageLayout>
  );
}