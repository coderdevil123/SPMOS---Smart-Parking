import express from "express";

const router = express.Router();

router.get("/distance", async (req, res) => {
  const { originLat, originLng, destLat, destLng } = req.query;

  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${originLat},${originLng}&destinations=${destLat},${destLng}&key=${process.env.GOOGLE_MAPS_API_KEY}`
    );

    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch distance" });
  }
});

export default router;