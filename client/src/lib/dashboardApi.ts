const API_BASE = "http://localhost:5000/api";

// ─── Types ───────────────────────────────────────────────────────────
export interface ParkingSpotData {
  spotId: string;
  isAvailable: boolean;
}

export interface DashboardSummary {
  totalSpots: number;
  available: number;
  occupied: number;
  todayVehicles: number;
}

export interface DashboardData {
  spots: ParkingSpotData[];
  summary: DashboardSummary;
}

export interface VehicleBreakdown {
  name: string;
  value: number;
}

export interface HistoricalEntry {
  label: string;
  incoming: number;
  outgoing: number;
}

export interface RecentBooking {
  _id: string;
  vehicleNumber: string;
  parkingSpot: string;
  totalAmount: number;
  paymentStatus: string;
  startTime: string;
  user: { name: string; email?: string };
}

export interface AnalyticsData {
  vehicleBreakdown: VehicleBreakdown[];
  historicalData: HistoricalEntry[];
  recentBookings: RecentBooking[];
}

// ─── MOCK FALLBACK DATA ─────────────────────────────────────────────
const MOCK_DASHBOARD: DashboardData = {
  spots: [
    { spotId: "A1", isAvailable: true },
    { spotId: "A2", isAvailable: false },
    { spotId: "A3", isAvailable: true },
    { spotId: "A4", isAvailable: false },
    { spotId: "A5", isAvailable: true },
    { spotId: "B1", isAvailable: false },
    { spotId: "B2", isAvailable: true },
    { spotId: "B3", isAvailable: true },
    { spotId: "B4", isAvailable: false },
    { spotId: "B5", isAvailable: true },
    { spotId: "C1", isAvailable: false },
    { spotId: "C2", isAvailable: true },
    { spotId: "C3", isAvailable: false },
    { spotId: "C4", isAvailable: true },
    { spotId: "C5", isAvailable: false },
    { spotId: "D1", isAvailable: true },
    { spotId: "D2", isAvailable: true },
    { spotId: "D3", isAvailable: false },
    { spotId: "D4", isAvailable: true },
    { spotId: "D5", isAvailable: false },
  ],
  summary: {
    totalSpots: 20,
    available: 11,
    occupied: 9,
    todayVehicles: 7,
  },
};

const MOCK_ANALYTICS: AnalyticsData = {
  vehicleBreakdown: [
    { name: "Car", value: 42 },
    { name: "Bike", value: 28 },
    { name: "EV", value: 15 },
    { name: "Truck", value: 8 },
  ],
  historicalData: [
    { label: "Mon", incoming: 24, outgoing: 18 },
    { label: "Tue", incoming: 31, outgoing: 22 },
    { label: "Wed", incoming: 28, outgoing: 25 },
    { label: "Thu", incoming: 35, outgoing: 28 },
    { label: "Fri", incoming: 40, outgoing: 32 },
    { label: "Sat", incoming: 22, outgoing: 15 },
    { label: "Sun", incoming: 18, outgoing: 12 },
  ],
  recentBookings: [
    { _id: "1", vehicleNumber: "SK-01-AB-1234", parkingSpot: "A2", totalAmount: 120, paymentStatus: "completed", startTime: new Date(Date.now() - 3600000).toISOString(), user: { name: "Rahul Sharma" } },
    { _id: "2", vehicleNumber: "SK-02-CD-5678", parkingSpot: "B1", totalAmount: 80, paymentStatus: "completed", startTime: new Date(Date.now() - 7200000).toISOString(), user: { name: "Priya Gupta" } },
    { _id: "3", vehicleNumber: "SK-01-EF-9012", parkingSpot: "C3", totalAmount: 200, paymentStatus: "pending", startTime: new Date(Date.now() - 10800000).toISOString(), user: { name: "Amit Singh" } },
    { _id: "4", vehicleNumber: "SK-03-GH-3456", parkingSpot: "A4", totalAmount: 160, paymentStatus: "completed", startTime: new Date(Date.now() - 14400000).toISOString(), user: { name: "Sneha Rai" } },
    { _id: "5", vehicleNumber: "SK-01-IJ-7890", parkingSpot: "D5", totalAmount: 90, paymentStatus: "completed", startTime: new Date(Date.now() - 18000000).toISOString(), user: { name: "Vikram Thapa" } },
  ],
};

// ─── API Functions ───────────────────────────────────────────────────
export async function fetchDashboardData(): Promise<DashboardData> {
  try {
    const res = await fetch(`${API_BASE}/dashboard`, { credentials: "include" });
    if (!res.ok) throw new Error("Failed to fetch dashboard");
    const json = await res.json();
    return json.data;
  } catch (err) {
    console.warn("Using mock dashboard data:", err);
    return MOCK_DASHBOARD;
  }
}

export async function fetchAnalyticsData(
  period: "day" | "week" | "month" = "week"
): Promise<AnalyticsData> {
  try {
    const res = await fetch(`${API_BASE}/dashboard/analytics?period=${period}`, {
      credentials: "include",
    });
    if (!res.ok) throw new Error("Failed to fetch analytics");
    const json = await res.json();
    return json.data;
  } catch (err) {
    console.warn("Using mock analytics data:", err);
    return MOCK_ANALYTICS;
  }
}
