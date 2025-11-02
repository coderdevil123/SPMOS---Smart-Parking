import express from "express";
import bcrypt from "bcryptjs";
import User from "../models/User.js";

const router = express.Router();

// ✅ Health check (optional)
router.get("/", (req, res) => {
  res.json({ message: "User API working ✅" });
});

// ===================== SIGNUP =====================
router.post("/signup", async (req, res) => {
  console.log("📩 Signup Request Body:", req.body);
  const { fullName, username, email, phoneNumber, password } = req.body;

  if (!fullName || !username || !email || !phoneNumber || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    // Check for existing user
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "Email or username already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const newUser = new User({
      name: fullName,
      username,
      email,
      phone: phoneNumber,
      password: hashedPassword,
    });

    await newUser.save();

    console.log("✅ User created:", newUser.email);

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: {
        id: newUser._id,
        name: newUser.name,
        username: newUser.username,
        email: newUser.email,
        phone: newUser.phone,
      },
    });
  } catch (error) {
    console.error("❌ Signup error:", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// ===================== LOGIN =====================
router.post("/login", async (req, res) => {
  console.log("📩 Login Request Body:", req.body);
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ success: false, message: "Email and password are required" });
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      console.log("⚠️ User not found:", email);
      return res
        .status(400)
        .json({ success: false, message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log("⚠️ Password mismatch for:", email);
      return res
        .status(400)
        .json({ success: false, message: "Invalid email or password" });
    }

    console.log("✅ Login successful for:", user.email);

    return res.status(200).json({
      success: true,
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
        phone: user.phone,
      },
    });
  } catch (error) {
    console.error("❌ Login error:", error);
    // Ensure no text/HTML leaks out
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
});

export default router;
