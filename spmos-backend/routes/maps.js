import express from "express";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();
const router = express.Router();

// 📍 Get directions between origin & destination
router.get("/directions", async (req, res) => {
  try {
    const { origin, destination } = req.query;
    const apiKey = process.env.GOOGLE_MAPS_API_KEY;

    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/directions/json?origin=${origin}&destination=${destination}&key=${apiKey}`
    );

    res.status(200).json(response.data);
  } catch (error) {
    res.status(500).json({ message: "Error fetching directions", error });
  }
});

export default router;
