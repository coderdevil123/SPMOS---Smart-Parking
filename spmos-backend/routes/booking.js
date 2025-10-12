import express from "express";
import Booking from "../models/Booking.js";
import ParkingSpot from "../models/ParkingSpot.js";

const router = express.Router();

// 🧾 Get all bookings
router.get("/", async (req, res) => {
  try {
    const bookings = await Booking.find().populate("parkingSpot");
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: "Error fetching bookings", error });
  }
});

// ➕ Create a new booking
router.post("/", async (req, res) => {
  try {
    const { user, parkingSpot, vehicleNumber, amountPaid } = req.body;

    const spot = await ParkingSpot.findById(parkingSpot);
    if (!spot) return res.status(404).json({ message: "Parking spot not found" });

    // Create booking
    const booking = new Booking({
      user,
      parkingSpot,
      vehicleNumber,
      amountPaid,
      bookingTime: new Date(),
    });

    const savedBooking = await booking.save();

    // Update spot availability
    spot.isAvailable = false;
    await spot.save();

    res.status(201).json(savedBooking);
  } catch (error) {
    res.status(500).json({ message: "Error creating booking", error });
  }
});

// ✅ Mark booking as completed
router.put("/:id/complete", async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    booking.completed = true;
    await booking.save();

    // Free the spot
    const spot = await ParkingSpot.findById(booking.parkingSpot);
    if (spot) {
      spot.isAvailable = true;
      await spot.save();
    }

    res.status(200).json({ message: "Booking completed successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error completing booking", error });
  }
});

export default router;
