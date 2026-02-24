import { motion } from "framer-motion";
import type { ParkingSpotData } from "@/lib/dashboardApi";
import { Car } from "lucide-react";

interface ParkingGridProps {
  spots: ParkingSpotData[];
}

export default function ParkingGrid({ spots }: ParkingGridProps) {
  // Group spots by row letter (A, B, C, D...)
  const rows: Record<string, ParkingSpotData[]> = {};
  spots.forEach((spot) => {
    const rowKey = spot.spotId.charAt(0);
    if (!rows[rowKey]) rows[rowKey] = [];
    rows[rowKey].push(spot);
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="rounded-2xl border border-slate-200/60 dark:border-slate-700/60 bg-white dark:bg-slate-900 p-6 shadow-sm"
    >
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-lg font-bold text-slate-800 dark:text-white">
            Parking Layout
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Real-time spot availability
          </p>
        </div>
        <div className="flex items-center gap-4 text-xs font-medium">
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/40" />
            Available
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-rose-500 shadow-sm shadow-rose-500/40" />
            Occupied
          </span>
        </div>
      </div>

      <div className="space-y-3">
        {Object.entries(rows).map(([rowKey, rowSpots]) => (
          <div key={rowKey} className="flex items-center gap-2">
            <span className="w-6 text-xs font-bold text-slate-400 dark:text-slate-500 text-center">
              {rowKey}
            </span>
            <div className="flex gap-2 flex-wrap">
              {rowSpots.map((spot, idx) => (
                <motion.div
                  key={spot.spotId}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: idx * 0.05 + 0.1, duration: 0.3 }}
                  className={`
                    relative flex flex-col items-center justify-center
                    w-16 h-16 sm:w-20 sm:h-20 rounded-xl cursor-default
                    border-2 transition-all duration-300 group
                    ${
                      spot.isAvailable
                        ? "bg-emerald-50 border-emerald-300 dark:bg-emerald-950/30 dark:border-emerald-700/50 hover:shadow-emerald-200/50 hover:shadow-md"
                        : "bg-rose-50 border-rose-300 dark:bg-rose-950/30 dark:border-rose-700/50 hover:shadow-rose-200/50 hover:shadow-md"
                    }
                  `}
                >
                  <Car
                    className={`w-5 h-5 mb-1 transition-transform group-hover:scale-110 ${
                      spot.isAvailable
                        ? "text-emerald-500 dark:text-emerald-400"
                        : "text-rose-500 dark:text-rose-400"
                    }`}
                  />
                  <span
                    className={`text-xs font-bold ${
                      spot.isAvailable
                        ? "text-emerald-700 dark:text-emerald-300"
                        : "text-rose-700 dark:text-rose-300"
                    }`}
                  >
                    {spot.spotId}
                  </span>

                  {/* Pulse indicator for occupied */}
                  {!spot.isAvailable && (
                    <span className="absolute -top-1 -right-1 flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500" />
                    </span>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
