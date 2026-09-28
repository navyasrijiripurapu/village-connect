import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import {
  Sprout,
  ArrowUpRight,
} from "lucide-react";
import { Navbar } from "./Navbar";

export function PageLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">

      <Navbar />

      <main className="min-h-[calc(100vh-76px)]">
        {children}
      </main>

      {/* FOOTER */}

      <footer className="mt-20 bg-slate-950 text-white">

        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-3 lg:px-8">

          {/* BRAND */}

          <div>

            <div className="flex items-center gap-3">

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-600">
                <Sprout className="h-6 w-6" />
              </div>

              <div>
                <h3 className="font-extrabold">
                  Village Connect
                </h3>

                <p className="text-xs text-emerald-400">
                  Resource Sharing Network
                </p>
              </div>

            </div>

            <p className="mt-5 max-w-sm text-sm leading-6 text-slate-400">
              A simple way for villagers to
              discover, share and request
              agricultural equipment and
              skilled resources.
            </p>

          </div>

          {/* QUICK LINKS */}

          <div>

            <h4 className="font-bold">
              Quick Links
            </h4>

            <div className="mt-4 space-y-3 text-sm">

              <Link
                to="/"
                className="block text-slate-400 transition hover:text-white"
              >
                Home
              </Link>

              <Link
                to="/resources"
                className="block text-slate-400 transition hover:text-white"
              >
                Find Resources
              </Link>

              <Link
                to="/add-resource"
                className="block text-slate-400 transition hover:text-white"
              >
                Share a Resource
              </Link>

              <Link
                to="/bookings"
                className="block text-slate-400 transition hover:text-white"
              >
                My Bookings
              </Link>

            </div>

          </div>

          {/* ABOUT */}

          <div>

            <h4 className="font-bold">
              Village Connect
            </h4>

            <p className="mt-4 text-sm leading-6 text-slate-400">
              Connect directly with resource
              owners in your village. Find
              tractors, machines, tankers,
              harvesters and skilled workers
              in one place.
            </p>

            <Link
              to="/resources"
              className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-emerald-400 hover:text-emerald-300"
            >
              Explore resources
              <ArrowUpRight className="h-4 w-4" />
            </Link>

          </div>

        </div>

        <div className="border-t border-white/10">

          <div className="mx-auto max-w-7xl px-4 py-5 text-center text-xs text-slate-500 sm:px-6 lg:px-8">
            © 2026 Village Connect. Resource
            sharing for stronger villages.
          </div>

        </div>

      </footer>
    </div>
  );
}

export function PageHeader({
  title,
  subtitle,
  tone = "primary",
}: {
  title: string;
  subtitle?: string;
  tone?: "primary" | "danger";
}) {
  return (
    <section className="relative overflow-hidden bg-slate-950">

      <div className="absolute inset-0 bg-gradient-to-br from-emerald-950 via-slate-950 to-slate-900" />

      <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">

        <div className="max-w-3xl">

          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-emerald-300">
            <Sprout className="h-3.5 w-3.5" />
            Village Connect
          </div>

          <h1
            className={`text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl ${
              tone === "danger"
                ? "text-red-400"
                : "text-white"
            }`}
          >
            {title}
          </h1>

          {subtitle && (
            <p className="mt-4 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
              {subtitle}
            </p>
          )}

        </div>

      </div>
    </section>
  );
}