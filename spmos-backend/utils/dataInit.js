const ParkingLot = require('../models/ParkingLot');

/**
 * Initializes mock parking lot data if the collection is empty.
 * Call this function once when the server starts if you need seed data.
 */
const initializeData = async () => {
    try {
        if (await ParkingLot.countDocuments() === 0) {
            console.log('Inserting initial parking lot data...');
            await ParkingLot.insertMany([
                {
                    name: 'City Center Parking A',
                    address: 'Near Central Market, City Bypass',
                    hourly_rate: 30,
                    total_slots: 100,
                    available_slots: 50,
                    // Coordinates: [longitude, latitude] -> Example: Bangalore, India
                    location: { type: 'Point', coordinates: [ 77.5806, 12.9721 ] } 
                },
                {
                    name: 'Tech Park Garage B',
                    address: 'Behind IBM Tower, IT Corridor',
                    hourly_rate: 50,
                    total_slots: 200,
                    available_slots: 120,
                    location: { type: 'Point', coordinates: [ 77.5850, 12.9699 ] }
                },
                {
                    name: 'Old Town Square Lot',
                    address: 'Main Street, Historical District',
                    hourly_rate: 20,
                    total_slots: 50,
                    available_slots: 5,
                    location: { type: 'Point', coordinates: [ 77.5750, 12.9750 ] }
                }
            ]);
            console.log('Initial parking data loaded successfully.');
        } else {
            console.log('ParkingLot collection is already populated.');
        }
    } catch (error) {
        console.error('Error initializing data:', error.message);
    }
}

module.exports = initializeData;