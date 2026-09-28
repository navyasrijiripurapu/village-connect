import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  User,
  MapPin,
  Phone,
  Save,
  LogOut,
} from "lucide-react";
import { PageLayout, PageHeader } from "@/components/PageLayout";

export const Route = createFileRoute("/profile")({
  component: ProfilePage,
});

type Profile = {
  name: string;
  phone: string;
  village: string;
  bio: string;
};

const defaultProfile: Profile = {
  name: "",
  phone: "",
  village: "",
  bio: "",
};

function ProfilePage() {
  const navigate = useNavigate();

  const [profile, setProfile] =
    useState<Profile>(defaultProfile);

  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const savedProfile = localStorage.getItem(
      "villageConnectProfile"
    );

    if (savedProfile) {
      try {
        setProfile(JSON.parse(savedProfile));
      } catch {
        setProfile(defaultProfile);
      }
    }
  }, []);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement
    >
  ) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value,
    });

    setSaved(false);
  };

  const handleSave = () => {
    localStorage.setItem(
      "villageConnectProfile",
      JSON.stringify(profile)
    );

    setSaved(true);

    // Tell Navbar that profile information changed
    window.dispatchEvent(
      new Event("villageConnectAuthChanged")
    );
  };

  const handleLogout = () => {
    // Remove current login session
    localStorage.removeItem("token");
    localStorage.removeItem("adminToken");
    localStorage.removeItem("loggedIn");
    localStorage.removeItem("userRole");

    // Remove the active user's profile
    localStorage.removeItem(
      "villageConnectProfile"
    );

    // IMPORTANT:
    // Do NOT remove villageConnectUser.
    // That contains the registered account and
    // is needed when the user logs in again.

    // Tell Navbar immediately that logout happened
    window.dispatchEvent(
      new Event("villageConnectAuthChanged")
    );

    // Go to login page
    navigate({ to: "/login" });
  };

  return (
    <PageLayout>
      <div className="max-w-3xl mx-auto px-4 py-8">

        <PageHeader
          title="My Profile"
          description="Manage your Village Connect profile"
        />

        <div className="bg-white rounded-2xl shadow-md p-6 mt-6">

          {/* Profile Header */}
          <div className="flex items-center gap-4 mb-8">
            <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">
              <User className="w-10 h-10 text-green-700" />
            </div>

            <div>
              <h2 className="text-2xl font-bold">
                {profile.name || "Village User"}
              </h2>

              <p className="text-gray-500">
                Village Connect User
              </p>
            </div>
          </div>

          {/* Name */}
          <div className="mb-5">
            <label className="block font-medium mb-2">
              Name
            </label>

            <input
              type="text"
              name="name"
              value={profile.name}
              onChange={handleChange}
              placeholder="Enter your name"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          {/* Phone */}
          <div className="mb-5">
            <label className="block font-medium mb-2">
              <Phone className="inline w-4 h-4 mr-2" />
              Phone Number
            </label>

            <input
              type="tel"
              name="phone"
              value={profile.phone}
              onChange={handleChange}
              placeholder="Enter your phone number"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          {/* Village */}
          <div className="mb-5">
            <label className="block font-medium mb-2">
              <MapPin className="inline w-4 h-4 mr-2" />
              Village
            </label>

            <input
              type="text"
              name="village"
              value={profile.village}
              onChange={handleChange}
              placeholder="Enter your village"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          {/* About */}
          <div className="mb-5">
            <label className="block font-medium mb-2">
              About Me
            </label>

            <textarea
              name="bio"
              value={profile.bio}
              onChange={handleChange}
              placeholder="Tell us about yourself"
              rows={4}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-between items-center mt-6">

            {/* Logout */}
            <button
              type="button"
              onClick={handleLogout}
              className="flex items-center gap-2 px-5 py-3 rounded-lg border border-red-500 text-red-600 hover:bg-red-50"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>

            {/* Save */}
            <button
              type="button"
              onClick={handleSave}
              className="flex items-center gap-2 px-6 py-3 rounded-lg bg-green-700 text-white hover:bg-green-800"
            >
              <Save className="w-4 h-4" />
              Save Profile
            </button>

          </div>

          {saved && (
            <p className="text-green-700 text-center mt-4 font-medium">
              Profile saved successfully!
            </p>
          )}

        </div>
      </div>
    </PageLayout>
  );
}

