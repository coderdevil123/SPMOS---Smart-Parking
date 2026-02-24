import express from "express";
import bcrypt from "bcryptjs";
import User from "../models/User.js";

const router = express.Router();

// ===================== ADMIN EMAILS =====================
const ADMIN_EMAILS = [
  "jyotiraditiya@spmos.com",
  "misrajyotiraditya@gmail.com",
];

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
        role: newUser.role || "user",
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

    // ✅ Auto-upgrade to admin if email is in ADMIN_EMAILS list
    if (ADMIN_EMAILS.includes(user.email) && user.role !== "admin") {
      user.role = "admin";
      await user.save();
      console.log("✅ Auto-upgraded to admin:", user.email);
    }

    return res.status(200).json({
      success: true,
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
        phone: user.phone,
        role: user.role || "user",
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

// ===================== SEED ADMIN =====================
// POST /api/users/seed-admin — Creates/upgrades admin accounts (run once)
router.post("/seed-admin", async (req, res) => {
  try {
    const adminAccounts = [
      { email: "jyotiraditiya@spmos.com", username: "jyotiraditiya", name: "Jyotiraditiya", password: "admin123", phone: "0000000000" },
      { email: "misrajyotiraditya@gmail.com", username: "misrajyotiraditya", name: "Jyotiraditya Misra", password: "admin123", phone: "0000000000" },
    ];

    const results = [];

    for (const acc of adminAccounts) {
      const existing = await User.findOne({ $or: [{ email: acc.email }, { username: acc.username }] });
      if (existing) {
        // Always reset password and ensure admin role
        const hashedPassword = await bcrypt.hash(acc.password, 10);
        existing.role = "admin";
        existing.password = hashedPassword;
        await existing.save();
        results.push(`${acc.email} updated as admin (password reset)`);
      } else {
        const hashedPassword = await bcrypt.hash(acc.password, 10);
        const admin = new User({
          name: acc.name,
          username: acc.username,
          email: acc.email,
          phone: acc.phone,
          password: hashedPassword,
          role: "admin",
        });
        await admin.save();
        console.log(`✅ Admin seeded: ${acc.email}`);
        results.push(`${acc.email} created as admin`);
      }
    }

    res.status(201).json({ success: true, message: results.join("; ") });
  } catch (error) {
    console.error("❌ Seed admin error:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
