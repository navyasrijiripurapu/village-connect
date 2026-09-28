const express = require("express");
const jwt = require("jsonwebtoken");

const Resource = require("../models/Resource");
const User = require("../models/User");

const router = express.Router();

// =====================================
// USER AUTHENTICATION
// =====================================

const protectUser = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Please login first",
      });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    if (decoded.role !== "user") {
      return res.status(403).json({
        message: "Only users can add resources",
      });
    }

    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    req.user = user;

    next();
  } catch (error) {
    console.error(
      "User authentication error:",
      error.message
    );

    return res.status(401).json({
      message: "Invalid or expired token",
    });
  }
};

// =====================================
// ADD RESOURCE
// =====================================

router.post("/", protectUser, async (req, res) => {
  try {
    const {
      resourceName,
      category,
      description,
      village,
      price,
      priceUnit,
      phone,
      available,
      image,
    } = req.body;

    if (
      !resourceName ||
      !category ||
      !description ||
      !village ||
      price === undefined ||
      !priceUnit ||
      !phone
    ) {
      return res.status(400).json({
        message: "Please fill all required fields",
      });
    }

    // IMPORTANT:
    // The owner comes from the logged-in user's JWT.
    // The frontend cannot choose another owner.

    const resource = await Resource.create({
      owner: req.user._id,
      ownerName: req.user.name,

      resourceName,
      category,
      description,
      village,
      price: Number(price),
      priceUnit,
      phone,
      available: available !== false,
      image: image || "",
    });

    res.status(201).json({
      message: "Resource added successfully",
      resource,
    });
  } catch (error) {
    console.error("Add resource error:", error);

    res.status(500).json({
      message: "Failed to add resource",
    });
  }
});

// =====================================
// GET ALL RESOURCES
// =====================================

router.get("/", async (req, res) => {
  try {
    const resources = await Resource.find()
      .populate(
        "owner",
        "name email phone village"
      )
      .sort({
        createdAt: -1,
      });

    res.status(200).json({
      resources,
    });
  } catch (error) {
    console.error("Get resources error:", error);

    res.status(500).json({
      message: "Failed to load resources",
    });
  }
});

// =====================================
// GET MY RESOURCES
// =====================================

router.get("/my", protectUser, async (req, res) => {
  try {
    const resources = await Resource.find({
      owner: req.user._id,
    }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      resources,
    });
  } catch (error) {
    console.error("Get my resources error:", error);

    res.status(500).json({
      message: "Failed to load your resources",
    });
  }
});

module.exports = router;