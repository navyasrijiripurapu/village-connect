import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import {
  Tractor,
  MapPin,
  IndianRupee,
  Phone,
  FileText,
  CheckCircle,
} from "lucide-react";
import {
  PageLayout,
  PageHeader,
} from "@/components/PageLayout";
import { VILLAGES } from "@/lib/data";

export const Route = createFileRoute("/add-resource")({
  component: AddResourcePage,
});

function AddResourcePage() {
  const navigate = useNavigate();

  const [resourceName, setResourceName] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");

  const [village, setVillage] = useState("");
  const [manualVillage, setManualVillage] = useState("");

  const [price, setPrice] = useState("");
  const [priceUnit, setPriceUnit] = useState("Day");
  const [phone, setPhone] = useState("");
  const [available, setAvailable] = useState(true);

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login first before adding a resource.");

      navigate({
        to: "/login",
      });

      return;
    }

    const finalVillage =
      village === "__OTHER__"
        ? manualVillage.trim()
        : village.trim();

    if (
      !resourceName.trim() ||
      !category ||
      !description.trim() ||
      !finalVillage ||
      !price ||
      !phone.trim()
    ) {
      alert("Please fill all the required fields.");
      return;
    }

    if (Number(price) < 0) {
      alert("Price cannot be negative.");
      return;
    }

    if (phone.trim().length < 10) {
      alert("Please enter a valid phone number.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        "http://localhost:5000/api/resources",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            resourceName: resourceName.trim(),
            category,
            description: description.trim(),
            village: finalVillage,
            price: Number(price),
            priceUnit,
            phone: phone.trim(),
            available,
            image: "",
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Failed to add resource.");
        return;
      }

      alert("Resource added successfully!");

      setResourceName("");
      setCategory("");
      setDescription("");
      setVillage("");
      setManualVillage("");
      setPrice("");
      setPriceUnit("Day");
      setPhone("");
      setAvailable(true);

      navigate({
        to: "/resources",
      });
    } catch (error) {
      console.error("Add resource error:", error);

      alert(
        "Cannot connect to the backend. Please make sure the backend is running."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageLayout>
      <div className="mx-auto max-w-3xl px-4 py-10">
        <PageHeader
          title="Add Resource"
          subtitle="Share your agricultural resource with people in your village or nearby villages."
        />

        <form
          onSubmit={handleSubmit}
          className="mt-6 rounded-2xl bg-white p-6 shadow-md sm:p-8"
        >
          {/* RESOURCE NAME */}
          <div className="mb-5">
            <label className="mb-2 block font-medium">
              <Tractor className="mr-2 inline h-4 w-4" />
              Resource Name
            </label>

            <input
              type="text"
              value={resourceName}
              onChange={(e) =>
                setResourceName(e.target.value)
              }
              placeholder="Example: Mahindra Tractor"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          {/* CATEGORY */}
          <div className="mb-5">
            <label className="mb-2 block font-medium">
              Resource Category
            </label>

            <select
              value={category}
              onChange={(e) =>
                setCategory(e.target.value)
              }
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="">
                Select resource category
              </option>

              <option value="Tractor">
                Tractor
              </option>

              <option value="Rotavator">
                Rotavator
              </option>

              <option value="Water Tanker">
                Water Tanker
              </option>

              <option value="Spray Machine">
                Spray Machine
              </option>

              <option value="Borewell Drilling Machine">
                Borewell Drilling Machine
              </option>

              <option value="Skilled Labor">
                Skilled Labor
              </option>

              <option value="Harvester">
                Harvester
              </option>
            </select>
          </div>

          {/* DESCRIPTION */}
          <div className="mb-5">
            <label className="mb-2 block font-medium">
              <FileText className="mr-2 inline h-4 w-4" />
              Description
            </label>

            <textarea
              value={description}
              onChange={(e) =>
                setDescription(e.target.value)
              }
              placeholder="Describe your resource..."
              rows={4}
              className="w-full resize-none rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          {/* VILLAGE */}
          <div className="mb-5">
            <label className="mb-2 block font-medium">
              <MapPin className="mr-2 inline h-4 w-4" />
              Village
            </label>

            <select
              value={village}
              onChange={(e) => {
                setVillage(e.target.value);

                if (e.target.value !== "__OTHER__") {
                  setManualVillage("");
                }
              }}
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="">
                Select your village
              </option>

              {VILLAGES.map((v) => (
                <option key={v} value={v}>
                  {v}
                </option>
              ))}

              <option value="__OTHER__">
                Other - Enter village manually
              </option>
            </select>

            {/* MANUAL VILLAGE */}
            {village === "__OTHER__" && (
              <div className="mt-3">
                <input
                  type="text"
                  value={manualVillage}
                  onChange={(e) =>
                    setManualVillage(e.target.value)
                  }
                  placeholder="Enter your village name"
                  className="w-full rounded-lg border border-green-600 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500"
                />

                <p className="mt-1 text-xs text-gray-500">
                  Enter your village name if it is not
                  available in the list.
                </p>
              </div>
            )}
          </div>

          {/* PRICE + UNIT */}
          <div className="mb-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-2 block font-medium">
                <IndianRupee className="mr-2 inline h-4 w-4" />
                Price
              </label>

              <input
                type="number"
                min="0"
                value={price}
                onChange={(e) =>
                  setPrice(e.target.value)
                }
                placeholder="Enter price"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div>
              <label className="mb-2 block font-medium">
                Price Unit
              </label>

              <select
                value={priceUnit}
                onChange={(e) =>
                  setPriceUnit(e.target.value)
                }
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="Hour">
                  Per Hour
                </option>

                <option value="Day">
                  Per Day
                </option>

                <option value="Work">
                  Per Work
                </option>
              </select>
            </div>
          </div>

          {/* PHONE */}
          <div className="mb-5">
            <label className="mb-2 block font-medium">
              <Phone className="mr-2 inline h-4 w-4" />
              Contact Number
            </label>

            <input
              type="tel"
              value={phone}
              onChange={(e) =>
                setPhone(e.target.value)
              }
              placeholder="Enter contact number"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          {/* AVAILABILITY */}
          <div className="mb-7 rounded-lg border bg-gray-50 p-4">
            <label className="flex cursor-pointer items-center gap-3">
              <input
                type="checkbox"
                checked={available}
                onChange={(e) =>
                  setAvailable(e.target.checked)
                }
                className="h-5 w-5 accent-green-700"
              />

              <div>
                <p className="font-semibold">
                  Resource is available
                </p>

                <p className="text-sm text-gray-500">
                  People can request this resource when
                  it is available.
                </p>
              </div>
            </label>
          </div>

          {/* SUBMIT */}
          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-green-700 px-5 py-3 font-semibold text-white transition hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? (
              "Adding Resource..."
            ) : (
              <>
                <CheckCircle className="h-5 w-5" />
                Add Resource
              </>
            )}
          </button>
        </form>
      </div>
    </PageLayout>
  );
}