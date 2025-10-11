import dbConnect from "../lib/mongodb";   // FIXED PATH
import Booking from "../models/Booking";
import User from "../models/User";

export default async function handler(req: any, res: any) {
  await dbConnect();

  if (req.method === "POST") {
    try {
      const body = req.body;

      // Validate required fields
      if (
        !body.parkingSpotId ||
        !body.startTime ||
        !body.endTime ||
        !body.vehicleNumber ||
        !body.vehicleType ||
        !body.duration ||
        !body.totalCost
      ) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      // Create booking
      const booking = await Booking.create({
        auth0Id: body.auth0Id,
        userId: body.userId,
        parkingSpotId: body.parkingSpotId,
        parkingLotName: body.parkingLotName,
        location: body.location,
        vehicleNumber: body.vehicleNumber,
        vehicleType: body.vehicleType,
        duration: body.duration,
        totalCost: body.totalCost,
        startTime: new Date(body.startTime),
        endTime: new Date(body.endTime),
        status: "booked",
      });

      return res.status(201).json(booking);
    } catch (err: any) {
      console.error("Booking POST error", err);
      return res.status(500).json({ error: err.message || err });
    }
  }

  if (req.method === "GET") {
    try {
      const { auth0Id, userId } = req.query;
      const q: any = {};
      if (auth0Id) q.auth0Id = auth0Id;
      if (userId) q.userId = userId;

      const bookings = await Booking.find(q).sort({ createdAt: -1 }).limit(100);
      return res.status(200).json(bookings);
    } catch (err: any) {
      console.error("Booking GET error", err);
      return res.status(500).json({ error: err.message || err });
    }
  }

  res.setHeader("Allow", "GET,POST");
  return res.status(405).end("Method Not Allowed");
}
