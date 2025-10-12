const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    parking_lot_id: { type: mongoose.Schema.Types.ObjectId, ref: 'ParkingLot', required: true },
    slot_number: { type: String },
    start_time: { type: Date, required: true },
    end_time: { type: Date, required: true },
    amount: { type: Number, required: true }, // Total amount in INR
    status: { 
        type: String, 
        enum: ['pending', 'confirmed', 'completed', 'cancelled'], 
        default: 'pending' 
    },
    payment_id: { type: String }, // Razorpay Payment ID
    order_id: { type: String },   // Razorpay Order ID
    // Optional: store the location at the time of booking for historical context
    booked_location: { type: mongoose.Schema.Types.Mixed } 
}, { timestamps: true });

const Booking = mongoose.model('Booking', bookingSchema);
module.exports = Booking;