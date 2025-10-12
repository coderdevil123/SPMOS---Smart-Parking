const Razorpay = require('razorpay');

/**
 * Initializes and exports the Razorpay instance using environment variables.
 */
const razorpayInstance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

module.exports = razorpayInstance;