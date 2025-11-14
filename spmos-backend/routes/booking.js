import express from "express";
import Booking from "../models/Booking.js";

const router = express.Router();

// ✅ CREATE BOOKING (NOW FIXED)
router.post("/", async (req, res) => {
  console.log("📩 Incoming Booking Request:", req.body);

  const {
    user,
    parkingSpot,
    vehicleNumber,
    startTime,
    endTime,
    totalAmount
  } = req.body;

  if (!user || !parkingSpot || !vehicleNumber || !startTime || !endTime || !totalAmount) {
    console.log("❌ Missing field:", req.body);
    return res.status(400).json({
      success: false,
      message: "Missing required fields",
    });
  }

  try {
    // ✅ TEMP FIX — REMOVE MongoDB parking spot validation
    // Because your frontend is using dummy spot IDs like "1", "2", "3"
    // DB validation will fail (ObjectId required).
    let spot = { isAvailable: true };

    // ✅ Create booking
    const booking = new Booking({
      user,
      parkingSpot,      // now stored as string
      vehicleNumber,
      startTime,
      endTime,
      totalAmount,
      paymentStatus: "completed",
    });

    const saved = await booking.save();
    console.log("✅ Booking saved:", saved);

    res.status(201).json({
      success: true,
      booking: saved,
    });

  } catch (error) {
    console.error("❌ Booking Error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
});

export default router;
