import express from "express";
import ParkingSpot from "../models/ParkingSpot.js";

const router = express.Router();

// 📍 Get all parking spots
router.get("/", async (req, res) => {
  try {
    const spots = await ParkingSpot.find();
    res.status(200).json(spots);
  } catch (error) {
    res.status(500).json({ message: "Error fetching parking spots", error });
  }
});

// ➕ Add a new parking spot
router.post("/", async (req, res) => {
  try {
    const newSpot = new ParkingSpot(req.body);
    const savedSpot = await newSpot.save();
    res.status(201).json(savedSpot);
  } catch (error) {
    res.status(500).json({ message: "Error adding parking spot", error });
  }
});

// ❌ Delete a parking spot
router.delete("/:id", async (req, res) => {
  try {
    await ParkingSpot.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Parking spot deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting parking spot", error });
  }
});

export default router;
