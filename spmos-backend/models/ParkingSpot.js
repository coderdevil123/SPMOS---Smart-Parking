import mongoose from "mongoose";

const parkingSpotSchema = new mongoose.Schema({
  spotId: {
    type: String,
    required: true,
    unique: true,
  },
  isAvailable: {
    type: Boolean,
    default: true,
  },
  location: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
  },
  pricePerHour: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const ParkingSpot = mongoose.model("ParkingSpot", parkingSpotSchema);
export default ParkingSpot;
