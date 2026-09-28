import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import {
  User,
  Mail,
  Phone,
  Lock,
  MapPin,
  UserPlus,
} from "lucide-react";
import { PageLayout, PageHeader } from "@/components/PageLayout";

export const Route = createFileRoute("/register")({
  component: RegisterPage,
});

function RegisterPage() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [village, setVillage] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);

  const handleRegister = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    if (
      !name.trim() ||
      !email.trim() ||
      !phone.trim() ||
      !village.trim() ||
      !password ||
      !confirmPassword
    ) {
      alert("Please fill all the fields.");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    if (phone.trim().length < 10) {
      alert("Please enter a valid phone number.");
      return;
    }

    if (password.length < 6) {
      alert("Password must contain at least 6 characters.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        "http://localhost:5000/api/users/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: name.trim(),
            email: email.trim().toLowerCase(),
            phone: phone.trim(),
            village: village.trim(),
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(
          data.message ||
            "Registration failed. Please try again."
        );
        return;
      }

      /*
       * Save the token returned by the backend.
       */
      localStorage.setItem(
        "token",
        data.token
      );

      localStorage.setItem(
        "loggedIn",
        "true"
      );

      localStorage.setItem(
        "userRole",
        "user"
      );

      /*
       * Save profile information for the frontend.
       */
      localStorage.setItem(
        "villageConnectProfile",
        JSON.stringify(data.user)
      );

      /*
       * Keep this for compatibility with
       * any old frontend code.
       */
      localStorage.setItem(
        "villageConnectUser",
        JSON.stringify({
          name: data.user.name,
          email: data.user.email,
          phone: data.user.phone,
          village: data.user.village,
        })
      );

      window.dispatchEvent(
        new Event("villageConnectAuthChanged")
      );

      alert("Registration successful!");

      navigate({
        to: "/profile",
      });
    } catch (error) {
      console.error(
        "Registration error:",
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
      <div className="mx-auto max-w-2xl px-4 py-10">
        <PageHeader
          title="Create Account"
          subtitle="Register to find and share resources in your village."
        />

        <form
          onSubmit={handleRegister}
          className="mt-6 rounded-2xl bg-card p-6 shadow-md sm:p-8"
        >
          {/* Name */}
          <div className="mb-5">
            <label className="mb-2 block font-medium">
              <User className="mr-2 inline h-4 w-4" />
              Full Name
            </label>

            <input
              type="text"
              value={name}
              onChange={(e) =>
                setName(e.target.value)
              }
              placeholder="Enter your full name"
              className="w-full rounded-lg border border-input bg-background px-4 py-3 outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Email */}
          <div className="mb-5">
            <label className="mb-2 block font-medium">
              <Mail className="mr-2 inline h-4 w-4" />
              Email
            </label>

            <input
              type="email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              placeholder="Enter your email"
              className="w-full rounded-lg border border-input bg-background px-4 py-3 outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Phone */}
          <div className="mb-5">
            <label className="mb-2 block font-medium">
              <Phone className="mr-2 inline h-4 w-4" />
              Phone Number
            </label>

            <input
              type="tel"
              value={phone}
              onChange={(e) =>
                setPhone(e.target.value)
              }
              placeholder="Enter your phone number"
              className="w-full rounded-lg border border-input bg-background px-4 py-3 outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Village */}
          <div className="mb-5">
            <label className="mb-2 block font-medium">
              <MapPin className="mr-2 inline h-4 w-4" />
              Village
            </label>

            <input
              type="text"
              value={village}
              onChange={(e) =>
                setVillage(e.target.value)
              }
              placeholder="Enter your village"
              className="w-full rounded-lg border border-input bg-background px-4 py-3 outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Password */}
          <div className="mb-5">
            <label className="mb-2 block font-medium">
              <Lock className="mr-2 inline h-4 w-4" />
              Password
            </label>

            <input
              type="password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              placeholder="Create a password"
              className="w-full rounded-lg border border-input bg-background px-4 py-3 outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Confirm Password */}
          <div className="mb-6">
            <label className="mb-2 block font-medium">
              <Lock className="mr-2 inline h-4 w-4" />
              Confirm Password
            </label>

            <input
              type="password"
              value={confirmPassword}
              onChange={(e) =>
                setConfirmPassword(
                  e.target.value
                )
              }
              placeholder="Confirm your password"
              className="w-full rounded-lg border border-input bg-background px-4 py-3 outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Register */}
          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3 font-bold text-primary-foreground hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <UserPlus className="h-5 w-5" />

            {loading
              ? "Creating Account..."
              : "Create Account"}
          </button>

          {/* Login */}
          <p className="mt-5 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <button
              type="button"
              onClick={() =>
                navigate({
                  to: "/login",
                })
              }
              className="font-semibold text-primary hover:underline"
            >
              Login
            </button>
          </p>
        </form>
      </div>
    </PageLayout>
  );
}