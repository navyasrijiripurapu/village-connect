const express = require("express");
const jwt = require("jsonwebtoken");

const Booking = require("../models/Booking");
const Resource = require("../models/Resource");
const User = require("../models/User");

const protectAdmin = require("../middleware/authMiddleware");

const router = express.Router();

// =====================================================
// USER AUTHENTICATION
// =====================================================

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
        message: "Only users can perform this action",
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
      "Booking authentication error:",
      error.message
    );

    return res.status(401).json({
      message: "Invalid or expired token",
    });
  }
};

// =====================================================
// CREATE BOOKING
// User requests a resource
// =====================================================

router.post("/", protectUser, async (req, res) => {
  try {
    const {
      resourceId,
      bookingDate,
      bookingTime,
    } = req.body;

    if (
      !resourceId ||
      !bookingDate ||
      !bookingTime
    ) {
      return res.status(400).json({
        message:
          "Resource, booking date and booking time are required",
      });
    }

    const resource = await Resource.findById(
      resourceId
    );

    if (!resource) {
      return res.status(404).json({
        message: "Resource not found",
      });
    }

    // Owner cannot book own resource
    if (
      resource.owner.toString() ===
      req.user._id.toString()
    ) {
      return res.status(400).json({
        message:
          "You cannot book your own resource",
      });
    }

    if (!resource.available) {
      return res.status(400).json({
        message:
          "This resource is currently unavailable",
      });
    }

    const owner = await User.findById(
      resource.owner
    );

    if (!owner) {
      return res.status(404).json({
        message: "Resource owner not found",
      });
    }

    // Create booking
    const booking = await Booking.create({
      resource: resource._id,

      // Person requesting the resource
      farmer: req.user._id,

      // Person owning the resource
      owner: owner._id,

      resourceName: resource.resourceName,

      farmerName: req.user.name,

      ownerName: owner.name,

      phone: resource.phone,

      village: resource.village,

      bookingDate,

      bookingTime,

      price: resource.price,

      status: "Pending",
    });

    res.status(201).json({
      message:
        "Booking request sent successfully",

      booking,
    });
  } catch (error) {
    console.error(
      "Create booking error:",
      error
    );

    res.status(500).json({
      message:
        "Failed to create booking",
    });
  }
});

// =====================================================
// USER'S BOOKINGS
// Shows requests made BY the logged-in user
// =====================================================

router.get(
  "/my",
  protectUser,
  async (req, res) => {
    try {
      const bookings =
        await Booking.find({
          farmer: req.user._id,
        }).sort({
          createdAt: -1,
        });

      res.status(200).json({
        bookings,
      });
    } catch (error) {
      console.error(
        "Get my bookings error:",
        error
      );

      res.status(500).json({
        message:
          "Failed to load bookings",
      });
    }
  }
);

// =====================================================
// CANCEL USER BOOKING
// =====================================================

router.put(
  "/:id/cancel",
  protectUser,
  async (req, res) => {
    try {
      const booking =
        await Booking.findById(
          req.params.id
        );

      if (!booking) {
        return res.status(404).json({
          message: "Booking not found",
        });
      }

      if (
        booking.farmer.toString() !==
        req.user._id.toString()
      ) {
        return res.status(403).json({
          message:
            "You can only cancel your own bookings",
        });
      }

      if (
        booking.status !== "Pending" &&
        booking.status !== "Accepted"
      ) {
        return res.status(400).json({
          message:
            "This booking cannot be cancelled",
        });
      }

      booking.status = "Cancelled";

      await booking.save();

      res.status(200).json({
        message:
          "Booking cancelled successfully",

        booking,
      });
    } catch (error) {
      console.error(
        "Cancel booking error:",
        error
      );

      res.status(500).json({
        message:
          "Failed to cancel booking",
      });
    }
  }
);

// =====================================================
// RESOURCE OWNER REQUESTS
// Shows requests for resources owned by logged-in user
// =====================================================

router.get(
  "/owner",
  protectUser,
  async (req, res) => {
    try {
      const bookings =
        await Booking.find({
          owner: req.user._id,
        }).sort({
          createdAt: -1,
        });

      res.status(200).json({
        bookings,
      });
    } catch (error) {
      console.error(
        "Get owner bookings error:",
        error
      );

      res.status(500).json({
        message:
          "Failed to load owner bookings",
      });
    }
  }
);

// =====================================================
// OWNER ACCEPTS REQUEST
// =====================================================

router.put(
  "/owner/:id/accept",
  protectUser,
  async (req, res) => {
    try {
      const booking =
        await Booking.findById(
          req.params.id
        );

      if (!booking) {
        return res.status(404).json({
          message: "Booking not found",
        });
      }

      // Only resource owner can accept
      if (
        booking.owner.toString() !==
        req.user._id.toString()
      ) {
        return res.status(403).json({
          message:
            "Only the resource owner can accept this booking",
        });
      }

      if (booking.status !== "Pending") {
        return res.status(400).json({
          message:
            "Only pending bookings can be accepted",
        });
      }

      booking.status = "Accepted";

      await booking.save();

      res.status(200).json({
        message:
          "Booking accepted successfully",

        booking,
      });
    } catch (error) {
      console.error(
        "Owner accept booking error:",
        error
      );

      res.status(500).json({
        message:
          "Failed to accept booking",
      });
    }
  }
);

// =====================================================
// OWNER REJECTS REQUEST
// =====================================================

router.put(
  "/owner/:id/reject",
  protectUser,
  async (req, res) => {
    try {
      const booking =
        await Booking.findById(
          req.params.id
        );

      if (!booking) {
        return res.status(404).json({
          message: "Booking not found",
        });
      }

      // Only resource owner can reject
      if (
        booking.owner.toString() !==
        req.user._id.toString()
      ) {
        return res.status(403).json({
          message:
            "Only the resource owner can reject this booking",
        });
      }

      if (booking.status !== "Pending") {
        return res.status(400).json({
          message:
            "Only pending bookings can be rejected",
        });
      }

      booking.status = "Rejected";

      await booking.save();

      res.status(200).json({
        message:
          "Booking rejected successfully",

        booking,
      });
    } catch (error) {
      console.error(
        "Owner reject booking error:",
        error
      );

      res.status(500).json({
        message:
          "Failed to reject booking",
      });
    }
  }
);

// =====================================================
// ADMIN - VIEW ONLY
// =====================================================

router.get(
  "/admin/all",
  protectAdmin,
  async (req, res) => {
    try {
      const bookings =
        await Booking.find().sort({
          createdAt: -1,
        });

      res.status(200).json({
        bookings,
      });
    } catch (error) {
      console.error(
        "Get all bookings error:",
        error
      );

      res.status(500).json({
        message:
          "Failed to load all bookings",
      });
    }
  }
);

module.exports = router;