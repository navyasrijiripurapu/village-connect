import { Link } from "@tanstack/react-router";
import {
  Menu,
  X,
  Sprout,
  User,
  BookOpen,
  ClipboardList,
  Plus,
} from "lucide-react";
import { useEffect, useState } from "react";

const LINKS = [
  {
    to: "/",
    label: "Home",
  },
  {
    to: "/resources",
    label: "Resources",
  },
] as const;

type Profile = {
  id?: string;
  _id?: string;
  name?: string;
  email?: string;
  phone?: string;
  village?: string;
  role?: string;
};

export function Navbar() {
  const [open, setOpen] = useState(false);

  const [isLoggedIn, setIsLoggedIn] =
    useState(false);

  const [isAdmin, setIsAdmin] =
    useState(false);

  const [profile, setProfile] =
    useState<Profile | null>(null);

  /*
   * IMPORTANT:
   * localStorage is ONLY accessed inside useEffect.
   * This makes the Navbar safe for SSR.
   */
  useEffect(() => {
    const loadAuth = () => {
      const token =
        window.localStorage.getItem("token");

      const adminToken =
        window.localStorage.getItem(
          "adminToken"
        );

      const userRole =
        window.localStorage.getItem(
          "userRole"
        );

      const storedProfile =
        window.localStorage.getItem(
          "villageConnectProfile"
        );

      const adminLoggedIn =
        Boolean(adminToken) ||
        userRole === "admin";

      const userLoggedIn =
        Boolean(token) &&
        userRole !== "admin";

      setIsAdmin(adminLoggedIn);

      setIsLoggedIn(
        adminLoggedIn || userLoggedIn
      );

      if (storedProfile) {
        try {
          setProfile(
            JSON.parse(storedProfile)
          );
        } catch {
          setProfile(null);
        }
      } else {
        setProfile(null);
      }
    };

    loadAuth();

    const handleAuthChange = () => {
      loadAuth();
    };

    window.addEventListener(
      "villageConnectAuthChanged",
      handleAuthChange
    );

    window.addEventListener(
      "storage",
      handleAuthChange
    );

    return () => {
      window.removeEventListener(
        "villageConnectAuthChanged",
        handleAuthChange
      );

      window.removeEventListener(
        "storage",
        handleAuthChange
      );
    };
  }, []);

  const userName =
    profile?.name ||
    (isAdmin ? "Admin" : "Account");

  const closeMenu = () => {
    setOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 shadow-sm backdrop-blur">
      <div className="mx-auto flex h-[76px] max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

        {/* LOGO */}

        <Link
          to="/"
          className="flex items-center gap-3"
          onClick={closeMenu}
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-600 shadow-sm">
            <Sprout className="h-6 w-6 text-white" />
          </div>

          <div className="hidden sm:block">
            <p className="text-lg font-extrabold tracking-tight text-slate-900">
              Village Connect
            </p>

            <p className="text-xs font-semibold text-emerald-600">
              Resource Sharing Network
            </p>
          </div>
        </Link>

        {/* DESKTOP NAVIGATION */}

        <nav className="hidden items-center gap-1 lg:flex">

          {/* PUBLIC LINKS */}

          {LINKS.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              activeOptions={{
                exact: link.to === "/",
              }}
              className="rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-emerald-50 hover:text-emerald-700"
              activeProps={{
                className:
                  "bg-emerald-50 text-emerald-700",
              }}
            >
              {link.label}
            </Link>
          ))}

          {/* USER ONLY LINKS */}

          {isLoggedIn && !isAdmin && (
            <>
              <Link
                to="/add-resource"
                className="ml-1 flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-emerald-50 hover:text-emerald-700"
              >
                <Plus className="h-4 w-4" />
                Add Resource
              </Link>

              <Link
                to="/bookings"
                className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-emerald-50 hover:text-emerald-700"
              >
                <BookOpen className="h-4 w-4" />
                My Bookings
              </Link>

              <Link
                to="/owner-bookings"
                className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-emerald-50 hover:text-emerald-700"
              >
                <ClipboardList className="h-4 w-4" />
                Requests
              </Link>
            </>
          )}

          {/* ADMIN ONLY */}

          {isAdmin && (
            <Link
              to="/admin"
              className="rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-blue-50 hover:text-blue-700"
            >
              Admin Dashboard
            </Link>
          )}

          {/* ACCOUNT */}

          <Link
            to={
              isLoggedIn
                ? isAdmin
                  ? "/admin"
                  : "/profile"
                : "/login"
            }
            className="ml-3 flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-emerald-700"
          >
            <User className="h-4 w-4" />

            {isLoggedIn
              ? userName
              : "Login / Register"}
          </Link>
        </nav>

        {/* MOBILE BUTTON */}

        <button
          type="button"
          onClick={() =>
            setOpen((value) => !value)
          }
          aria-label="Toggle navigation"
          className="rounded-xl border border-slate-200 p-2.5 text-slate-700 lg:hidden"
        >
          {open ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </button>
      </div>

      {/* MOBILE MENU */}

      {open && (
        <div className="border-t border-slate-200 bg-white lg:hidden">
          <nav className="mx-auto max-w-7xl space-y-1 px-4 py-4">

            {/* PUBLIC LINKS */}

            {LINKS.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                activeOptions={{
                  exact: link.to === "/",
                }}
                onClick={closeMenu}
                className="block rounded-xl px-4 py-3 font-semibold text-slate-700 hover:bg-emerald-50 hover:text-emerald-700"
              >
                {link.label}
              </Link>
            ))}

            {/* USER ONLY LINKS */}

            {isLoggedIn && !isAdmin && (
              <>
                <Link
                  to="/add-resource"
                  onClick={closeMenu}
                  className="flex items-center gap-3 rounded-xl px-4 py-3 font-semibold text-slate-700 hover:bg-emerald-50"
                >
                  <Plus className="h-5 w-5" />
                  Add Resource
                </Link>

                <Link
                  to="/bookings"
                  onClick={closeMenu}
                  className="flex items-center gap-3 rounded-xl px-4 py-3 font-semibold text-slate-700 hover:bg-emerald-50"
                >
                  <BookOpen className="h-5 w-5" />
                  My Bookings
                </Link>

                <Link
                  to="/owner-bookings"
                  onClick={closeMenu}
                  className="flex items-center gap-3 rounded-xl px-4 py-3 font-semibold text-slate-700 hover:bg-emerald-50"
                >
                  <ClipboardList className="h-5 w-5" />
                  Resource Requests
                </Link>
              </>
            )}

            {/* ADMIN ONLY */}

            {isAdmin && (
              <Link
                to="/admin"
                onClick={closeMenu}
                className="block rounded-xl px-4 py-3 font-semibold text-blue-700 hover:bg-blue-50"
              >
                Admin Dashboard
              </Link>
            )}

            {/* ACCOUNT */}

            <Link
              to={
                isLoggedIn
                  ? isAdmin
                    ? "/admin"
                    : "/profile"
                  : "/login"
              }
              onClick={closeMenu}
              className="mt-2 flex items-center gap-3 rounded-xl bg-emerald-600 px-4 py-3 font-bold text-white"
            >
              <User className="h-5 w-5" />

              {isLoggedIn
                ? userName
                : "Login / Register"}
            </Link>

          </nav>
        </div>
      )}
    </header>
  );
}