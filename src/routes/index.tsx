import {
  createFileRoute,
  Link,
} from "@tanstack/react-router";
import {
  ArrowRight,
  CalendarCheck,
  ChevronRight,
  Search,
  Share2,
  Sprout,
  Tractor,
  Users,
  Wrench,
} from "lucide-react";
import { PageLayout } from "@/components/PageLayout";
import heroImg from "@/assets/hero-village.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      {
        title: "Village Connect | Resource Sharing Network",
      },
      {
        name: "description",
        content:
          "Find and share agricultural resources with people in your village.",
      },
    ],
  }),

  component: HomePage,
});

const CATEGORIES = [
  {
    name: "Tractors",
    icon: Tractor,
  },
  {
    name: "Rotavators",
    icon: Wrench,
  },
  {
    name: "Water Tankers",
    icon: Tractor,
  },
  {
    name: "Spray Machines",
    icon: Sprout,
  },
  {
    name: "Harvesters",
    icon: Tractor,
  },
  {
    name: "Skilled Labor",
    icon: Users,
  },
];

const FEATURES = [
  {
    icon: Search,
    title: "Find what you need",
    text: "Discover useful resources available around your village.",
  },
  {
    icon: Share2,
    title: "Share what you have",
    text: "List your equipment or skills and help others nearby.",
  },
  {
    icon: CalendarCheck,
    title: "Request easily",
    text: "Choose a date and send a request directly to the owner.",
  },
];

function HomePage() {
  return (
    <PageLayout>
      {/* HERO */}

      <section className="bg-[#f7f8f3]">

        <div className="mx-auto grid max-w-7xl items-center gap-8 px-4 py-8 sm:px-6 sm:py-12 lg:grid-cols-[1fr_0.9fr] lg:px-8 lg:py-14">

          {/* LEFT */}

          <div className="max-w-xl">

            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white px-3 py-1.5 text-xs font-bold text-emerald-700 shadow-sm">
              <Sprout className="h-3.5 w-3.5" />
              Built for village communities
            </div>

            <h1 className="text-4xl font-black leading-[1.05] tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
              Share resources.
              <span className="block text-emerald-600">
                Grow together.
              </span>
            </h1>

            <p className="mt-5 max-w-lg text-base leading-7 text-slate-600 sm:text-lg">
              Find tractors, machines, equipment and
              skilled workers around your village —
              all in one simple place.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">

              <Link
                to="/resources"
                className="group inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-extrabold text-white shadow-md shadow-emerald-600/20 transition hover:bg-emerald-700"
              >
                Explore Resources
                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
              </Link>

              <Link
                to="/add-resource"
                className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-bold text-slate-700 transition hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700"
              >
                <Share2 className="h-4 w-4" />
                Share a Resource
              </Link>

            </div>

            {/* SMALL TRUST ROW */}

            <div className="mt-7 flex flex-wrap gap-x-6 gap-y-2 text-xs font-semibold text-slate-500">

              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                Local resources
              </span>

              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                Direct owner connection
              </span>

              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                Simple requests
              </span>

            </div>

          </div>

          {/* IMAGE */}

          <div className="relative">

            <div className="absolute -inset-3 rounded-[2rem] bg-emerald-100/70 blur-2xl" />

            <div className="relative overflow-hidden rounded-[2rem] border-8 border-white bg-white shadow-xl">

              <img
                src={heroImg}
                alt="Agricultural village"
                className="h-[300px] w-full object-cover sm:h-[360px] lg:h-[400px]"
              />

              {/* IMAGE LABEL */}

              <div className="absolute bottom-4 left-4 right-4">

                <div className="flex items-center justify-between rounded-2xl border border-white/30 bg-white/90 px-4 py-3 shadow-lg backdrop-blur">

                  <div>
                    <p className="text-xs font-semibold text-slate-500">
                      Village Connect
                    </p>

                    <p className="text-sm font-extrabold text-slate-900">
                      Resources, closer to you
                    </p>
                  </div>

                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-600 text-white">
                    <Sprout className="h-4 w-4" />
                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>

      </section>

      {/* RESOURCE CATEGORIES */}

      <section className="border-y border-slate-200 bg-white">

        <div className="mx-auto max-w-7xl px-4 py-7 sm:px-6 lg:px-8">

          <div className="flex items-end justify-between">

            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-600">
                Browse resources
              </p>

              <h2 className="mt-1 text-xl font-black text-slate-900 sm:text-2xl">
                What are you looking for?
              </h2>
            </div>

            <Link
              to="/resources"
              className="hidden items-center gap-1 text-sm font-bold text-emerald-600 sm:flex"
            >
              View all
              <ChevronRight className="h-4 w-4" />
            </Link>

          </div>

          <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">

            {CATEGORIES.map((category) => (
              <Link
                key={category.name}
                to="/resources"
                className="group rounded-2xl border border-slate-200 bg-slate-50 p-4 transition hover:-translate-y-0.5 hover:border-emerald-200 hover:bg-emerald-50 hover:shadow-sm"
              >

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-emerald-600 shadow-sm transition group-hover:bg-emerald-600 group-hover:text-white">

                  <category.icon className="h-5 w-5" />

                </div>

                <p className="mt-3 text-sm font-bold text-slate-800 group-hover:text-emerald-700">
                  {category.name}
                </p>

              </Link>
            ))}

          </div>

        </div>

      </section>

      {/* HOW IT HELPS */}

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">

        <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">

          <div>

            <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-600">
              Why Village Connect?
            </p>

            <h2 className="mt-2 text-3xl font-black leading-tight text-slate-900">
              Everything you need,
              <span className="block text-emerald-600">
                without the confusion.
              </span>
            </h2>

            <p className="mt-4 max-w-md text-sm leading-6 text-slate-500">
              Find resources, check their details and
              send requests directly to the people
              who own them.
            </p>

            <Link
              to="/resources"
              className="mt-5 inline-flex items-center gap-2 text-sm font-extrabold text-emerald-600 hover:text-emerald-700"
            >
              Start exploring
              <ArrowRight className="h-4 w-4" />
            </Link>

          </div>

          <div className="grid gap-3 sm:grid-cols-3">

            {FEATURES.map((feature, index) => (
              <div
                key={feature.title}
                className="relative rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
              >

                <span className="absolute right-4 top-4 text-xs font-black text-slate-200">
                  0{index + 1}
                </span>

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                  <feature.icon className="h-5 w-5" />
                </div>

                <h3 className="mt-4 text-sm font-extrabold text-slate-900">
                  {feature.title}
                </h3>

                <p className="mt-2 text-xs leading-5 text-slate-500">
                  {feature.text}
                </p>

              </div>
            ))}

          </div>

        </div>

      </section>

      {/* HOW IT WORKS */}

      <section className="bg-slate-950">

        <div className="mx-auto max-w-7xl px-4 py-9 sm:px-6 lg:px-8">

          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">

            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-400">
                Simple process
              </p>

              <h2 className="mt-1 text-2xl font-black text-white">
                From search to connection
              </h2>
            </div>

            <Link
              to="/resources"
              className="flex items-center gap-1 text-sm font-bold text-emerald-400"
            >
              Find resources
              <ArrowRight className="h-4 w-4" />
            </Link>

          </div>

          <div className="mt-6 grid gap-3 md:grid-cols-3">

            <div className="flex gap-4 rounded-2xl border border-white/10 bg-white/5 p-5">

              <span className="text-2xl font-black text-emerald-400">
                01
              </span>

              <div>
                <h3 className="font-bold text-white">
                  Search
                </h3>

                <p className="mt-1 text-xs leading-5 text-slate-400">
                  Find the equipment or service you need.
                </p>
              </div>

            </div>

            <div className="flex gap-4 rounded-2xl border border-white/10 bg-white/5 p-5">

              <span className="text-2xl font-black text-emerald-400">
                02
              </span>

              <div>
                <h3 className="font-bold text-white">
                  Request
                </h3>

                <p className="mt-1 text-xs leading-5 text-slate-400">
                  Select your date and send a request.
                </p>
              </div>

            </div>

            <div className="flex gap-4 rounded-2xl border border-white/10 bg-white/5 p-5">

              <span className="text-2xl font-black text-emerald-400">
                03
              </span>

              <div>
                <h3 className="font-bold text-white">
                  Connect
                </h3>

                <p className="mt-1 text-xs leading-5 text-slate-400">
                  The resource owner responds to your request.
                </p>
              </div>

            </div>

          </div>

        </div>

      </section>

      {/* FINAL CTA */}

      <section className="mx-auto max-w-7xl px-4 py-9 sm:px-6 lg:px-8">

        <div className="relative overflow-hidden rounded-[1.75rem] bg-emerald-600 px-6 py-7 sm:px-8">

          <div className="absolute -right-16 -top-20 h-48 w-48 rounded-full bg-white/10" />

          <div className="absolute -bottom-24 right-24 h-40 w-40 rounded-full bg-white/5" />

          <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

            <div>

              <div className="flex items-center gap-2 text-emerald-100">
                <Tractor className="h-4 w-4" />

                <span className="text-xs font-bold uppercase tracking-wider">
                  Have something to share?
                </span>
              </div>

              <h2 className="mt-1 text-2xl font-black text-white">
                Put your resource to work.
              </h2>

              <p className="mt-1 text-sm text-emerald-100">
                Add your equipment or service to Village Connect.
              </p>

            </div>

            <Link
              to="/add-resource"
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-extrabold text-emerald-700 shadow-sm transition hover:bg-emerald-50"
            >
              Add Resource
              <ArrowRight className="h-4 w-4" />
            </Link>

          </div>

        </div>

      </section>

    </PageLayout>
  );
}