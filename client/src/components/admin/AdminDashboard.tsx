import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import {
  LayoutGrid,
  CircleCheckBig,
  CircleX,
  CarFront,
  RefreshCcw,
  Wifi,
  WifiOff,
} from "lucide-react";

// Sub-components
import AdminSidebar from "./AdminSidebar";
import SummaryCard from "./SummaryCard";
import ParkingGrid from "./ParkingGrid";
import VehicleChart from "./VehicleChart";
import HistoricalChart from "./HistoricalChart";
import RecentBookings from "./RecentBookings";

// API
import {
  fetchDashboardData,
  fetchAnalyticsData,
  type DashboardData,
  type AnalyticsData,
} from "@/lib/dashboardApi";

const POLL_INTERVAL = 5000; // 5 seconds

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [period, setPeriod] = useState<"day" | "week" | "month">("week");
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [isLive, setIsLive] = useState(true);

  // ─── Fetch dashboard data ─────────────────────────────────────────
  const loadDashboard = useCallback(async () => {
    try {
      const data = await fetchDashboardData();
      setDashboardData(data);
      setLastUpdated(new Date());
    } catch (err) {
      console.error("Dashboard load error:", err);
    }
  }, []);

  const loadAnalytics = useCallback(async () => {
    try {
      const data = await fetchAnalyticsData(period);
      setAnalyticsData(data);
    } catch (err) {
      console.error("Analytics load error:", err);
    }
  }, [period]);

  // ─── Initial load ─────────────────────────────────────────────────
  useEffect(() => {
    const init = async () => {
      setLoading(true);
      await Promise.all([loadDashboard(), loadAnalytics()]);
      setLoading(false);
    };
    init();
  }, [loadDashboard, loadAnalytics]);

  // ─── Polling for real-time updates ────────────────────────────────
  useEffect(() => {
    if (!isLive) return;
    const interval = setInterval(() => {
      loadDashboard();
    }, POLL_INTERVAL);
    return () => clearInterval(interval);
  }, [isLive, loadDashboard]);

  // ─── Reload analytics when period changes ─────────────────────────
  useEffect(() => {
    loadAnalytics();
  }, [period, loadAnalytics]);

  // ─── Manual refresh ───────────────────────────────────────────────
  const handleRefresh = async () => {
    setLoading(true);
    await Promise.all([loadDashboard(), loadAnalytics()]);
    setLoading(false);
  };

  const summary = dashboardData?.summary;

  // ─── Loading skeleton ─────────────────────────────────────────────
  if (loading && !dashboardData) {
    return (
      <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950">
        <AdminSidebar activeTab={activeTab} onTabChange={setActiveTab} />
        <main className="flex-1 ml-[250px] p-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 w-64 bg-slate-200 dark:bg-slate-800 rounded-xl" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-32 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
              ))}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="h-80 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
              <div className="h-80 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
            </div>
          </div>
        </main>
      </div>
    );
  }

  // ─── Render content based on active tab ───────────────────────────
  const renderContent = () => {
    switch (activeTab) {
      case "parking":
        return dashboardData ? <ParkingGrid spots={dashboardData.spots} /> : null;

      case "analytics":
        return analyticsData ? (
          <div className="space-y-6">
            <VehicleChart data={analyticsData.vehicleBreakdown} />
            <HistoricalChart
              data={analyticsData.historicalData}
              activePeriod={period}
              onPeriodChange={setPeriod}
            />
          </div>
        ) : null;

      case "bookings":
        return analyticsData ? (
          <RecentBookings bookings={analyticsData.recentBookings} />
        ) : null;

      case "overview":
      default:
        return (
          <div className="space-y-6">
            {/* ── Summary Cards ── */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <SummaryCard
                title="Total Spots"
                value={summary?.totalSpots ?? 0}
                icon={<LayoutGrid className="w-6 h-6" />}
                color="blue"
                trend="+2 this week"
                trendUp={true}
              />
              <SummaryCard
                title="Available"
                value={summary?.available ?? 0}
                icon={<CircleCheckBig className="w-6 h-6" />}
                color="green"
                trend={`${summary ? Math.round((summary.available / summary.totalSpots) * 100) : 0}% free`}
                trendUp={true}
              />
              <SummaryCard
                title="Occupied"
                value={summary?.occupied ?? 0}
                icon={<CircleX className="w-6 h-6" />}
                color="red"
                trend={`${summary ? Math.round((summary.occupied / summary.totalSpots) * 100) : 0}% full`}
                trendUp={false}
              />
              <SummaryCard
                title="Vehicles Today"
                value={summary?.todayVehicles ?? 0}
                icon={<CarFront className="w-6 h-6" />}
                color="amber"
                trend="+12% vs yesterday"
                trendUp={true}
              />
            </div>

            {/* ── Parking Grid + Vehicle Chart ── */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              {dashboardData && <ParkingGrid spots={dashboardData.spots} />}
              {analyticsData && <VehicleChart data={analyticsData.vehicleBreakdown} />}
            </div>

            {/* ── Historical Chart ── */}
            {analyticsData && (
              <HistoricalChart
                data={analyticsData.historicalData}
                activePeriod={period}
                onPeriodChange={setPeriod}
              />
            )}

            {/* ── Recent Bookings ── */}
            {analyticsData && (
              <RecentBookings bookings={analyticsData.recentBookings} />
            )}
          </div>
        );
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950">
      <AdminSidebar activeTab={activeTab} onTabChange={setActiveTab} />

      {/* ─── Main Content ─── */}
      <main className="flex-1 ml-[72px] sm:ml-[250px] transition-all duration-300">
        {/* ── Top Bar ── */}
        <header className="sticky top-0 z-30 bg-white/80 dark:bg-slate-950/80 backdrop-blur-lg border-b border-slate-200/60 dark:border-slate-800/60 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <motion.h1
                key={activeTab}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-xl font-bold text-slate-800 dark:text-white capitalize"
              >
                {activeTab === "overview" ? "Dashboard Overview" : activeTab}
              </motion.h1>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                Last updated: {lastUpdated.toLocaleTimeString()}
              </p>
            </div>

            <div className="flex items-center gap-3">
              {/* Live indicator */}
              <button
                onClick={() => setIsLive(!isLive)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  isLive
                    ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/50"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700"
                }`}
              >
                {isLive ? <Wifi className="w-3.5 h-3.5" /> : <WifiOff className="w-3.5 h-3.5" />}
                {isLive ? "Live" : "Paused"}
                {isLive && (
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                  </span>
                )}
              </button>

              {/* Refresh */}
              <button
                onClick={handleRefresh}
                disabled={loading}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800/50 hover:bg-blue-100 dark:hover:bg-blue-950/60 transition-colors disabled:opacity-50"
              >
                <RefreshCcw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
                Refresh
              </button>
            </div>
          </div>
        </header>

        {/* ── Content ── */}
        <div className="p-6">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}
