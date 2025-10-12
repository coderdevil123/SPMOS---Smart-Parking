const express = require('express');
const crypto = require('crypto');
const authenticateToken = require('../middleware/authMiddleware');
const razorpayInstance = require('../utils/razorpay');
const Booking = require('../models/Booking');

const router = express.Router();

// @route POST /api/payment/order
// @desc Create a Razorpay Order ID for payment
// @access Private (Requires token)
router.post('/order', authenticateToken, async (req, res) => {
    const { booking_id, amount } = req.body;
    
    if (!booking_id || !amount) {
        return res.status(400).json({ message: 'Booking ID and amount are required.' });
    }

    try {
        const booking = await Booking.findById(booking_id);
        if (!booking || booking.user_id.toString() !== req.user.id) {
            return res.status(404).json({ message: 'Booking not found or unauthorized.' });
        }

        // Razorpay requires amount in the smallest currency unit (paise for INR)
        const amountInPaise = Math.round(amount * 100); 

        const options = {
            amount: amountInPaise, 
            currency: 'INR',
            receipt: `receipt_${booking_id}`,
            notes: {
                booking_id: booking_id,
                user_id: req.user.id,
            }
        };

        const order = await razorpayInstance.orders.create(options);

        // Save the Razorpay Order ID to the booking document
        booking.order_id = order.id;
        await booking.save();

        res.json({
            id: order.id, 
            currency: order.currency, 
            amount: order.amount,
            key_id: process.env.RAZORPAY_KEY_ID // Send key ID to frontend for checkout modal
        });

    } catch (error) {
        console.error('Razorpay order creation error:', error.message);
        res.status(500).json({ message: 'Failed to create Razorpay order.' });
    }
});


// @route POST /api/payment/verify
// @desc Verify the payment signature from Razorpay (Crucial backend security check)
// @access Private (Called by the frontend after Razorpay success)
router.post('/verify', authenticateToken, async (req, res) => {
    const {
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
        booking_id
    } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !booking_id) {
        return res.status(400).json({ message: 'Missing payment details.' });
    }

    try {
        // 1. Generate local signature
        const shasum = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET);
        shasum.update(`${razorpay_order_id}|${razorpay_payment_id}`);
        const digest = shasum.digest('hex');

        // 2. Compare local signature with signature provided by Razorpay
        if (digest === razorpay_signature) {
            // Signature is valid: Update booking status
            const booking = await Booking.findById(booking_id);

            if (!booking || booking.user_id.toString() !== req.user.id) {
                // Log unauthorized access attempt
                console.warn(`Unauthorized verification attempt for booking ${booking_id} by user ${req.user.id}`);
                return res.status(404).json({ success: false, message: 'Booking not found or unauthorized.' });
            }

            booking.payment_id = razorpay_payment_id;
            booking.status = 'confirmed';
            await booking.save();

            return res.json({ 
                success: true, 
                message: 'Payment verified successfully. Booking confirmed.',
                booking_details: booking 
            });
        } else {
            // Signature is invalid - possible tampering attempt
            return res.status(400).json({ success: false, message: 'Invalid signature. Payment verification failed.' });
        }
    } catch (error) {
        console.error('Payment verification error:', error.message);
        res.status(500).json({ message: 'Server error during payment verification.' });
    }
});

module.exports = router;
