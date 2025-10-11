// api/models/Booking.ts
import mongoose, { Schema, Document, Model } from "mongoose";

export interface IBooking extends Document {
  userId?: mongoose.Types.ObjectId | string;
  auth0Id?: string;
  parkingSpotId: string;
  parkingLotName?: string;
  location?: {
    lat?: number;
    lng?: number;
    address?: string;
  };
  vehicleNumber: string;
  vehicleType: string;
  duration: number;
  totalCost: number;
  startTime: Date;
  endTime: Date;
  status: "booked" | "cancelled" | "completed";
  createdAt: Date;
}

const BookingSchema = new Schema<IBooking>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    auth0Id: { type: String, index: true },
    parkingSpotId: { type: String, required: true },
    parkingLotName: { type: String },
    location: {
      lat: { type: Number },
      lng: { type: Number },
      address: { type: String },
    },
    vehicleNumber: { type: String, required: true },
    vehicleType: { type: String, required: true },
    duration: { type: Number, required: true },
    totalCost: { type: Number, required: true },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    status: {
      type: String,
      enum: ["booked", "cancelled", "completed"],
      default: "booked",
    },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// Prevent duplicate bookings for same spot/time
BookingSchema.index({ parkingSpotId: 1, startTime: 1, endTime: 1 });

// ✅ Safe export for Next.js hot reload
const Booking: Model<IBooking> =
  mongoose.models.Booking || mongoose.model<IBooking>("Booking", BookingSchema);

export default Booking;
