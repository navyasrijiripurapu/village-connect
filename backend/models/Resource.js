const mongoose = require("mongoose");

const resourceSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    ownerName: {
      type: String,
      required: true,
      trim: true,
    },

    resourceName: {
      type: String,
      required: true,
      trim: true,
    },

    category: {
      type: String,
      required: true,
      enum: [
        "Tractor",
        "Rotavator",
        "Water Tanker",
        "Spray Machine",
        "Borewell Drilling Machine",
        "Skilled Labor",
        "Harvester",
      ],
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    village: {
      type: String,
      required: true,
      trim: true,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    priceUnit: {
      type: String,
      required: true,
      enum: ["Hour", "Day", "Work"],
    },

    phone: {
      type: String,
      required: true,
      trim: true,
    },

    available: {
      type: Boolean,
      default: true,
    },

    image: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Resource", resourceSchema);