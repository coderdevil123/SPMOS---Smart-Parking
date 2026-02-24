import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";

// Import Routes
import userRoutes from "./routes/user.js";
import parkingRoutes from "./routes/parking.js";
import bookingRoutes from "./routes/booking.js";
import paymentRoutes from "./routes/payment.js";
import mapsRoutes from "./routes/maps.js";
import dashboardRoutes from "./routes/dashboard.js";

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// ================= MIDDLEWARE =================

// ✅ CORS - allow frontend connection
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:5175",
  "http://localhost:5176",
  "http://localhost:5177",
  "http://localhost:5178",
  "https://spmos.vercel.app",
  process.env.FRONTEND_URL
].filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      
      if (allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  })
);

// ✅ JSON Parsing (no need for body-parser separately)
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // optional: handle form data

// ✅ Connect to MongoDB
connectDB();

// ================= ROUTES =================
app.get("/", (req, res) => {
  res.json({ message: "SPMOS Backend API is running 🚀" });
});

app.use("/api/users", userRoutes);
app.use("/api/parking", parkingRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/maps", mapsRoutes);
app.use("/api/dashboard", dashboardRoutes);

// ================= ERROR HANDLERS =================

// 404 - Not Found
app.use((req, res) => {
  res.status(404).json({ success: false, message: "API route not found" });
});

// Global Error Handler (for unexpected server errors)
app.use((err, req, res, next) => {
  console.error("💥 Server Error:", err.stack);
  res.status(500).json({ success: false, message: "Internal Server Error" });
});

// ================= START SERVER =================
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
