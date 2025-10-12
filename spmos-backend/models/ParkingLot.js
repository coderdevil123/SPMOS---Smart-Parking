const mongoose = require('mongoose');

// Schema for GeoJSON Point (required for geospatial queries)
const GeoSchema = new mongoose.Schema({
    type: {
        type: String,
        default: 'Point',
        enum: ['Point'],
        required: true,
    },
    // Note: Coordinates must be stored as [longitude, latitude] in MongoDB
    coordinates: {
        type: [Number],
        required: true,
        index: '2dsphere' // Essential for $near and $geoNear queries
    }
});

// Parking Lot Schema
const parkingLotSchema = new mongoose.Schema({
    name: { type: String, required: true },
    address: { type: String, required: true },
    hourly_rate: { type: Number, required: true },
    total_slots: { type: Number, required: true },
    available_slots: { type: Number, required: true, min: 0 },
    manager_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    location: {
        type: GeoSchema,
        required: true
    }
}, { timestamps: true });

// Explicitly define the geospatial index on the coordinates field
parkingLotSchema.index({ 'location.coordinates': '2dsphere' });

const ParkingLot = mongoose.model('ParkingLot', parkingLotSchema);
module.exports = ParkingLot;