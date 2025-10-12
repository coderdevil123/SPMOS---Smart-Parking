// app/api/booking/route.ts

// 🚨 Use the correct path for your connection utility 
import dbConnect from "@/server/lib/dbConnect"; // Assuming this is your actual path
import Booking from "@/server/models/Booking"; // Assuming this is your actual path
import { NextRequest, NextResponse } from "next/server";

// --- POST Handler ---
export async function POST(request: NextRequest) {
  try {
    await dbConnect(); // Robust connection

    // Use .json() for NextRequest to parse the body
    const body = await request.json(); 

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
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Create booking
    const booking = await Booking.create({
      // Ensure all fields match your model structure
      // ... fields
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

    return NextResponse.json(booking, { status: 201 });
  } catch (err: any) {
    console.error("Booking POST error", err);
    return NextResponse.json({ error: err.message || "Internal Server Error" }, { status: 500 });
  }
}

// --- GET Handler ---
export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    // Get search params from the request URL
    const { searchParams } = new URL(request.url);
    const auth0Id = searchParams.get('auth0Id');
    const userId = searchParams.get('userId');

    const q: any = {};
    if (auth0Id) q.auth0Id = auth0Id;
    if (userId) q.userId = userId;

    const bookings = await Booking.find(q).sort({ createdAt: -1 }).limit(100);

    return NextResponse.json(bookings, { status: 200 });
  } catch (err: any) {
    console.error("Booking GET error", err);
    return NextResponse.json({ error: err.message || "Internal Server Error" }, { status: 500 });
  }
}

// No need for res.setHeader("Allow", "GET,POST") in App Router