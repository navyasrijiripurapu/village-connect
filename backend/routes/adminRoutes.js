const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/User");
const Resource = require("../models/Resource");
const Booking = require("../models/Booking");

const protectAdmin = require("../middleware/authMiddleware");

const router = express.Router();

/*
|--------------------------------------------------------------------------
| ADMIN LOGIN
|--------------------------------------------------------------------------
*/

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    /*
     * Admin is stored separately from normal users.
     * We use the Admin model if it exists.
     */

    const Admin = require("../models/Admin");

    const admin = await Admin.findOne({
      email: email.toLowerCase(),
    });

    if (!admin) {
      return res.status(401).json({
        message: "Invalid admin email or password",
      });
    }

    const passwordMatch = await bcrypt.compare(
      password,
      admin.password
    );

    if (!passwordMatch) {
      return res.status(401).json({
        message: "Invalid admin email or password",
      });
    }

    const token = jwt.sign(
      {
        id: admin._id,
        role: "admin",
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    return res.status(200).json({
      message: "Admin login successful",
      token,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: "admin",
      },
    });
  } catch (error) {
    console.error(
      "Admin login error:",
      error
    );

    return res.status(500).json({
      message: "Server error",
    });
  }
});

/*
|--------------------------------------------------------------------------
| ADMIN DASHBOARD
|--------------------------------------------------------------------------
*/

router.get(
  "/dashboard",
  protectAdmin,
  async (req, res) => {
    try {
      const usersCount = await User.countDocuments({
        role: "user",
      });

      const resourcesCount =
        await Resource.countDocuments();

      const bookingsCount =
        await Booking.countDocuments();

      return res.status(200).json({
        users: usersCount,
        resources: resourcesCount,
        bookings: bookingsCount,
      });
    } catch (error) {
      console.error(
        "Admin dashboard error:",
        error
      );

      return res.status(500).json({
        message:
          "Failed to load dashboard statistics",
      });
    }
  }
);

/*
|--------------------------------------------------------------------------
| ADMIN - ALL USERS
|--------------------------------------------------------------------------
*/

router.get(
  "/users",
  protectAdmin,
  async (req, res) => {
    try {
      const users = await User.find({
        role: "user",
      })
        .select("-password")
        .sort({
          createdAt: -1,
        });

      return res.status(200).json({
        users,
      });
    } catch (error) {
      console.error(
        "Get admin users error:",
        error
      );

      return res.status(500).json({
        message: "Failed to load users",
      });
    }
  }
);

/*
|--------------------------------------------------------------------------
| ADMIN - ALL RESOURCES
|--------------------------------------------------------------------------
*/

router.get(
  "/resources",
  protectAdmin,
  async (req, res) => {
    try {
      const resources =
        await Resource.find()
          .populate(
            "owner",
            "name email phone village"
          )
          .sort({
            createdAt: -1,
          });

      return res.status(200).json({
        resources,
      });
    } catch (error) {
      console.error(
        "Get admin resources error:",
        error
      );

      return res.status(500).json({
        message:
          "Failed to load resources",
      });
    }
  }
);

/*
|--------------------------------------------------------------------------
| ADMIN - ALL BOOKINGS
|--------------------------------------------------------------------------
*/

router.get(
  "/bookings",
  protectAdmin,
  async (req, res) => {
    try {
      const bookings =
        await Booking.find()
          .populate(
            "farmer",
            "name email phone village"
          )
          .populate(
            "owner",
            "name email phone village"
          )
          .populate(
            "resource",
            "resourceName category village"
          )
          .sort({
            createdAt: -1,
          });

      return res.status(200).json({
        bookings,
      });
    } catch (error) {
      console.error(
        "Get admin bookings error:",
        error
      );

      return res.status(500).json({
        message:
          "Failed to load bookings",
      });
    }
  }
);

module.exports = router;