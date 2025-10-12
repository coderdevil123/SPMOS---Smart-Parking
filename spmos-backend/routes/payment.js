// import express from "express";
// import Razorpay from "razorpay";
// import dotenv from "dotenv";
// import crypto from "crypto";

// dotenv.config();

// const router = express.Router();

// // ✅ Initialize Razorpay instance
// const razorpay = new Razorpay({
//   key_id: process.env.RAZORPAY_KEY_ID,
//   key_secret: process.env.RAZORPAY_KEY_SECRET,
// });

// // ✅ Create a new order
// router.post("/create-order", async (req, res) => {
//   try {
//     const { amount, currency = "INR" } = req.body;

//     const options = {
//       amount: amount * 100, // Razorpay expects amount in paisa
//       currency,
//       receipt: `receipt_order_${Date.now()}`,
//     };

//     const order = await razorpay.orders.create(options);
//     res.json({ success: true, order });
//   } catch (error) {
//     console.error("Razorpay Order Error:", error);
//     res.status(500).json({ success: false, message: "Failed to create order" });
//   }
// });

// // ✅ Verify payment signature
// router.post("/verify", (req, res) => {
//   const { order_id, payment_id, signature } = req.body;

//   const body = order_id + "|" + payment_id;
//   const expectedSignature = crypto
//     .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
//     .update(body.toString())
//     .digest("hex");

//   if (expectedSignature === signature) {
//     res.json({ success: true, message: "Payment verified successfully" });
//   } else {
//     res.status(400).json({ success: false, message: "Invalid signature" });
//   }
// });

// export default router;
import express from "express";
const router = express.Router();

router.get("/", (req, res) => {
  res.json({ message: "Payment route temporarily disabled for DB check" });
});

export default router;
