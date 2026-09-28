import { Link } from "@tanstack/react-router";
import {
  MapPin,
  Phone,
  IndianRupee,
} from "lucide-react";

type Resource = {
  _id?: string;
  id?: string;

  resourceName: string;
  category: string;
  description?: string;

  ownerName?: string;
  owner?: string;

  village: string;
  price: number;
  priceUnit: string;

  phone: string;
  available: boolean;

  image?: string;
};

export function ResourceCard({
  resource,
}: {
  resource: Resource;
}) {
  const resourceId =
    resource._id || resource.id || "";

  const ownerName =
    resource.ownerName ||
    resource.owner ||
    "Resource Owner";

  const image =
    resource.image ||
    "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80";

  return (
    <article className="flex flex-col overflow-hidden rounded-xl border-2 border-border bg-card shadow-sm transition-shadow hover:shadow-lg">

      {/* IMAGE */}
      <div className="relative">

        <img
          src={image}
          alt={resource.resourceName}
          loading="lazy"
          width={800}
          height={500}
          className="h-48 w-full object-cover"
        />

        {/* CATEGORY */}
        <span className="absolute left-3 top-3 rounded-md bg-primary px-3 py-1 text-xs font-bold text-primary-foreground">
          {resource.category}
        </span>

        {/* AVAILABILITY */}
        <span
          className={`absolute right-3 top-3 rounded-md px-3 py-1 text-xs font-bold ${
            resource.available
              ? "bg-green-600 text-white"
              : "bg-gray-600 text-white"
          }`}
        >
          {resource.available
            ? "Available"
            : "Unavailable"}
        </span>

      </div>

      {/* CONTENT */}
      <div className="flex flex-1 flex-col gap-3 border-t-4 border-primary p-5">

        {/* RESOURCE NAME */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Resource
          </p>

          <h3 className="mt-1 text-xl font-bold text-foreground">
            {resource.resourceName}
          </h3>
        </div>

        {/* OWNER */}
        <div>
          <p className="text-sm text-muted-foreground">
            Owner
          </p>

          <p className="font-semibold text-foreground">
            {ownerName}
          </p>
        </div>

        {/* VILLAGE */}
        <p className="flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4 shrink-0 text-secondary" />

          <span>
            {resource.village}
          </span>
        </p>

        {/* DESCRIPTION */}
        {resource.description && (
          <p className="line-clamp-2 text-sm text-muted-foreground">
            {resource.description}
          </p>
        )}

        {/* PRICE */}
        <div className="flex items-center gap-1">
          <IndianRupee className="h-5 w-5 text-secondary" />

          <span className="text-xl font-extrabold text-secondary">
            {resource.price.toLocaleString(
              "en-IN"
            )}
          </span>

          <span className="text-xs font-semibold text-muted-foreground">
            / {resource.priceUnit}
          </span>
        </div>

        {/* BUTTONS */}
        <div className="mt-auto grid grid-cols-2 gap-2 pt-3">

          {/* VIEW DETAILS */}
          <Link
            to="/resources/$resourceId"
            params={{
              resourceId,
            }}
            className="rounded-lg border-2 border-primary px-3 py-2.5 text-center text-sm font-bold text-primary hover:bg-accent"
          >
            View Details
          </Link>

          {/* BOOK */}
          {resource.available ? (
            <Link
              to="/resources/$resourceId"
              params={{
                resourceId,
              }}
              search={{
                book: true,
              }}
              className="rounded-lg bg-secondary px-3 py-2.5 text-center text-sm font-bold text-secondary-foreground hover:opacity-90"
            >
              Book Now
            </Link>
          ) : (
            <span className="rounded-lg bg-muted px-3 py-2.5 text-center text-sm font-bold text-muted-foreground">
              Unavailable
            </span>
          )}

        </div>

        {/* CONTACT OWNER */}
        {resource.phone && (
          <a
            href={`tel:${resource.phone.replace(
              /\s/g,
              ""
            )}`}
            className="flex items-center justify-center gap-2 rounded-lg border-2 border-secondary px-3 py-2.5 text-sm font-bold text-secondary hover:bg-secondary/10"
          >
            <Phone className="h-4 w-4" />
            Contact Owner
          </a>
        )}

      </div>
    </article>
  );
}