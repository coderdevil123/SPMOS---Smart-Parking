require('dotenv').config();

// Imports
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const initializeData = require('./utils/dataInit');

// Route Imports
const authRoutes = require('./routes/authRoutes');
const parkingRoutes = require('./routes/parkingRoutes');
const paymentRoutes = require('./routes/paymentRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// 1. Database Connection
connectDB();

// NOTE: Uncomment the line below to run the data initialization script once to seed mock data.
// initializeData(); 

// 2. Middleware
app.use(cors()); 
app.use(express.json()); // Body parser

// 3. Health Check Route
app.get('/', (req, res) => {
    res.json({ message: 'SPMOS Backend is running successfully!' });
});

// 4. Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/parking', parkingRoutes);
app.use('/api/payment', paymentRoutes);

// 5. Server Startup
app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
    console.log(`Access the server at http://localhost:${PORT}`);
});
