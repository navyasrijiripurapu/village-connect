import {
  createFileRoute,
  useNavigate,
} from "@tanstack/react-router";
import { useState } from "react";
import {
  User,
  ShieldCheck,
  Lock,
  Mail,
} from "lucide-react";
import {
  PageLayout,
  PageHeader,
} from "@/components/PageLayout";

export const Route = createFileRoute("/login")({
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();

  const [loginType, setLoginType] =
    useState<"user" | "admin">("user");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      alert("Please enter email and password");
      return;
    }

    try {
      setLoading(true);

      // =====================================================
      // ADMIN LOGIN
      // =====================================================

      if (loginType === "admin") {
        const response = await fetch(
          "http://localhost:5000/api/admin/login",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: email.trim(),
              password,
            }),
          }
        );

        const data = await response.json();

        if (!response.ok) {
          alert(
            data.message ||
              "Invalid admin email or password"
          );
          return;
        }

        // Remove normal user login data
        localStorage.removeItem("token");
        localStorage.removeItem(
          "villageConnectProfile"
        );

        // Save admin token
        localStorage.setItem(
          "adminToken",
          data.token
        );

        localStorage.setItem(
          "loggedIn",
          "true"
        );

        localStorage.setItem(
          "userRole",
          "admin"
        );

        // Save admin profile
        if (data.admin) {
          localStorage.setItem(
            "villageConnectProfile",
            JSON.stringify(data.admin)
          );
        }

        // Tell Navbar authentication changed
        window.dispatchEvent(
          new Event("villageConnectAuthChanged")
        );

        alert("Admin login successful!");

        navigate({
          to: "/admin",
        });

        return;
      }

      // =====================================================
      // USER LOGIN
      // =====================================================

      const response = await fetch(
        "http://localhost:5000/api/users/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email.trim(),
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(
          data.message ||
            "Invalid email or password"
        );
        return;
      }

      // Remove previous admin login
      localStorage.removeItem("adminToken");

      // Save USER JWT
      localStorage.setItem(
        "token",
        data.token
      );

      // Save login status
      localStorage.setItem(
        "loggedIn",
        "true"
      );

      // Save role
      localStorage.setItem(
        "userRole",
        "user"
      );

      // Save user profile
      localStorage.setItem(
        "villageConnectProfile",
        JSON.stringify(data.user)
      );

      // Tell Navbar authentication changed
      window.dispatchEvent(
        new Event("villageConnectAuthChanged")
      );

      alert("Login successful!");

      navigate({
        to: "/profile",
      });
    } catch (error) {
      console.error(
        "Login error:",
        error
      );

      alert(
        "Cannot connect to the backend. Please make sure the backend is running."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageLayout>
      <div className="mx-auto max-w-md px-4 py-10">

        {/* PAGE HEADER */}
        <PageHeader
          title="Village Connect Login"
          subtitle="Login to access your account"
        />

        <div className="mt-6 rounded-2xl bg-white p-6 shadow-md">

          {/* USER / ADMIN SELECTION */}
          <div className="mb-6 grid grid-cols-2 gap-3">

            {/* USER */}
            <button
              type="button"
              onClick={() => {
                setLoginType("user");
                setEmail("");
                setPassword("");
              }}
              className={
                loginType === "user"
                  ? "rounded-lg border bg-green-700 p-4 text-white"
                  : "rounded-lg border bg-white p-4 text-gray-700"
              }
            >
              <User className="mx-auto mb-1 h-5 w-5" />

              <span className="block">
                User
              </span>
            </button>

            {/* ADMIN */}
            <button
              type="button"
              onClick={() => {
                setLoginType("admin");
                setEmail("");
                setPassword("");
              }}
              className={
                loginType === "admin"
                  ? "rounded-lg border bg-green-700 p-4 text-white"
                  : "rounded-lg border bg-white p-4 text-gray-700"
              }
            >
              <ShieldCheck className="mx-auto mb-1 h-5 w-5" />

              <span className="block">
                Admin
              </span>
            </button>

          </div>

          {/* EMAIL */}
          <div className="mb-5">

            <label
              htmlFor="login-email"
              className="mb-2 block font-medium"
            >
              <Mail className="mr-2 inline h-4 w-4" />

              {loginType === "admin"
                ? "Admin Email"
                : "Email"}
            </label>

            <input
              id="login-email"
              type="email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              placeholder={
                loginType === "admin"
                  ? "Enter admin email"
                  : "Enter your email"
              }
              autoComplete="email"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500"
            />

          </div>

          {/* PASSWORD */}
          <div className="mb-6">

            <label
              htmlFor="login-password"
              className="mb-2 block font-medium"
            >
              <Lock className="mr-2 inline h-4 w-4" />

              Password
            </label>

            <input
              id="login-password"
              type="password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              placeholder="Enter password"
              autoComplete="current-password"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleLogin();
                }
              }}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500"
            />

          </div>

          {/* LOGIN BUTTON */}
          <button
            type="button"
            onClick={handleLogin}
            disabled={loading}
            className="w-full rounded-lg bg-green-700 py-3 font-semibold text-white hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading
              ? "Logging in..."
              : `Login as ${
                  loginType === "admin"
                    ? "Admin"
                    : "User"
                }`}
          </button>

          {/* REGISTER LINK */}
          {loginType === "user" && (
            <p className="mt-5 text-center text-gray-500">
              New user?{" "}

              <button
                type="button"
                className="font-semibold text-green-700 hover:underline"
                onClick={() =>
                  navigate({
                    to: "/register",
                  })
                }
              >
                Create an account
              </button>
            </p>
          )}

          {/* ADMIN INFORMATION */}
          {loginType === "admin" && (
            <p className="mt-5 text-center text-sm text-gray-500">
              Admin access is restricted to authorized
              administrators.
            </p>
          )}

        </div>
      </div>
    </PageLayout>
  );
}