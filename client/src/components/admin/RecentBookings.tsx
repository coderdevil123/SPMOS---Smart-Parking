import { motion } from "framer-motion";
import type { RecentBooking } from "@/lib/dashboardApi";
import { Clock, CheckCircle, AlertCircle } from "lucide-react";

interface RecentBookingsProps {
  bookings: RecentBooking[];
}

export default function RecentBookings({ bookings }: RecentBookingsProps) {
  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
      className="rounded-2xl border border-slate-200/60 dark:border-slate-700/60 bg-white dark:bg-slate-900 p-6 shadow-sm"
    >
      <div className="mb-5">
        <h3 className="text-lg font-bold text-slate-800 dark:text-white">
          Recent Bookings
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
          Latest parking transactions
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100 dark:border-slate-800">
              <th className="text-left py-3 px-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
                Vehicle
              </th>
              <th className="text-left py-3 px-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
                User
              </th>
              <th className="text-left py-3 px-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
                Spot
              </th>
              <th className="text-left py-3 px-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
                Amount
              </th>
              <th className="text-left py-3 px-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
                Time
              </th>
              <th className="text-left py-3 px-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
            {bookings.map((booking, i) => (
              <motion.tr
                key={booking._id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.06 }}
                className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors"
              >
                <td className="py-3 px-2">
                  <span className="font-mono font-semibold text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md text-xs">
                    {booking.vehicleNumber}
                  </span>
                </td>
                <td className="py-3 px-2 text-slate-600 dark:text-slate-300">
                  {booking.user?.name || "Unknown"}
                </td>
                <td className="py-3 px-2">
                  <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 font-bold text-xs">
                    {booking.parkingSpot}
                  </span>
                </td>
                <td className="py-3 px-2 font-semibold text-slate-800 dark:text-white">
                  ₹{booking.totalAmount}
                </td>
                <td className="py-3 px-2 text-slate-500 dark:text-slate-400">
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{formatTime(booking.startTime)}</span>
                    <span className="text-slate-300 dark:text-slate-600 mx-1">·</span>
                    <span>{formatDate(booking.startTime)}</span>
                  </div>
                </td>
                <td className="py-3 px-2">
                  {booking.paymentStatus === "completed" ? (
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded-full">
                      <CheckCircle className="w-3 h-3" />
                      Paid
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-2.5 py-1 rounded-full">
                      <AlertCircle className="w-3 h-3" />
                      Pending
                    </span>
                  )}
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}
