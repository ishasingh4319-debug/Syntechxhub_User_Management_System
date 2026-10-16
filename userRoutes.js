const express = require("express");
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const User = require("../models/User");
const basicAuth = require("../middleware/auth");

const router = express.Router();

// All user endpoints require HTTP Basic Authentication.
router.use(basicAuth);

function publicUser(user) {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt
  };
}

// CREATE: POST /api/users
router.post("/", async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: "name, email, and password are required" });
    }
    if (String(password).length < 8) {
      return res.status(400).json({ message: "Password must be at least 8 characters" });
    }

    const normalizedEmail = String(email).trim().toLowerCase();
    const existing = await User.findOne({ email: normalizedEmail });
    if (existing) {
      return res.status(409).json({ message: "A user with this email already exists" });
    }

    const passwordHash = await bcrypt.hash(String(password), 12);
    const user = await User.create({ name, email: normalizedEmail, passwordHash });
    return res.status(201).json({ message: "User created successfully", user: publicUser(user) });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: "A user with this email already exists" });
    }
    if (error.name === "ValidationError") {
      return res.status(400).json({ message: error.message });
    }
    next(error);
  }
});

// READ ALL: GET /api/users
router.get("/", async (req, res, next) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    return res.json({ count: users.length, users: users.map(publicUser) });
  } catch (error) {
    next(error);
  }
});

// READ ONE: GET /api/users/:id
router.get("/:id", async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    return res.json({ user: publicUser(user) });
  } catch (error) {
    next(error);
  }
});

// UPDATE: PATCH /api/users/:id
router.patch("/:id", async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const allowed = {};
    if (req.body.name !== undefined) allowed.name = req.body.name;
    if (req.body.email !== undefined) allowed.email = String(req.body.email).trim().toLowerCase();

    if (Object.keys(allowed).length === 0) {
      return res.status(400).json({ message: "Provide name or email to update" });
    }

    const user = await User.findByIdAndUpdate(req.params.id, allowed, {
      new: true,
      runValidators: true
    });
    if (!user) return res.status(404).json({ message: "User not found" });
    return res.json({ message: "User updated successfully", user: publicUser(user) });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: "A user with this email already exists" });
    }
    if (error.name === "ValidationError") {
      return res.status(400).json({ message: error.message });
    }
    next(error);
  }
});

// DELETE: DELETE /api/users/:id
router.delete("/:id", async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    return res.json({ message: "User deleted successfully", id: user._id });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
