const express = require('express');
const ParkingLot = require('../models/ParkingLot');
const authenticateToken = require('../middleware/authMiddleware');
const Booking = require('../models/Booking');

const router = express.Router();

// @route GET /api/parking/search
// @desc Find parking lots near a given location (latitude/longitude)
// @access Public
// Query params: ?lat=12.9716&lng=77.5946&radius=5 (radius in km)
router.get('/search', async (req, res) => {
    // Note: GeoJSON uses [longitude, latitude]
    const { lat, lng, radius } = req.query; 
    const queryLng = parseFloat(lng);
    const queryLat = parseFloat(lat);
    const radiusMeters = (parseFloat(radius) || 5) * 1000; // Default 5km radius, converted to meters

    if (isNaN(queryLng) || isNaN(queryLat)) {
        return res.status(400).json({ message: 'Invalid latitude or longitude provided.' });
    }

    try {
        // Use $geoNear aggregation for distance calculation and filtering
        const nearbyLots = await ParkingLot.aggregate([
            {
                $geoNear: {
                    near: {
                        type: 'Point',
                        coordinates: [queryLng, queryLat] 
                    },
                    distanceField: 'distance', // Output field with distance in meters
                    maxDistance: radiusMeters,
                    spherical: true,
                    query: { available_slots: { $gt: 0 } }
                }
            },
            {
                // Project and calculate distance in KM
                $project: {
                    name: 1,
                    address: 1,
                    hourly_rate: 1,
                    total_slots: 1,
                    available_slots: 1,
                    location: 1,
                    distance_km: { $divide: ['$distance', 1000] } 
                }
            },
            { $sort: { distance_km: 1 } } // Sort by closest parking lot
        ]);

        res.json(nearbyLots);

    } catch (error) {
        if (error.code === 16755) {
             console.error("Geospatial Index Error: Please ensure you have a 2dsphere index on 'location.coordinates'.");
             return res.status(500).json({ message: 'Server error: Geospatial index issue.' });
        }
        console.error('Parking search error:', error.message);
        res.status(500).json({ message: 'Server error during parking search.' });
    }
});

// @route POST /api/parking/reserve
// @desc Create a new booking request and reserve a slot (status: pending payment)
// @access Private (Requires token)
router.post('/reserve', authenticateToken, async (req, res) => {
    const { parking_lot_id, start_time, end_time, amount } = req.body;
    const user_id = req.user.id; // From JWT payload

    try {
        const lot = await ParkingLot.findById(parking_lot_id);
        if (!lot || lot.available_slots <= 0) {
            return res.status(404).json({ message: 'Parking lot not found or full.' });
        }

        // Reserve the slot immediately
        lot.available_slots -= 1;
        await lot.save();

        const booking = new Booking({
            user_id,
            parking_lot_id,
            start_time: new Date(start_time),
            end_time: new Date(end_time),
            amount,
            status: 'pending', // Awaiting payment
            slot_number: 'A' + (lot.total_slots - lot.available_slots), // Simple slot assignment
            booked_location: lot.location // Store lot location in booking
        });

        await booking.save();
        res.status(201).json({ 
            message: 'Slot reserved. Proceed to payment.', 
            booking_id: booking._id,
            amount: booking.amount,
        });

    } catch (error) {
        // If save fails, attempt to restore the slot count (simple rollback)
        await ParkingLot.updateOne({ _id: parking_lot_id }, { $inc: { available_slots: 1 } });
        console.error('Booking reservation error:', error.message);
        res.status(500).json({ message: 'Server error during booking reservation.' });
    }
});

module.exports = router;
