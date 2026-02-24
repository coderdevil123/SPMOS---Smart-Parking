import { motion } from "framer-motion";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import type { VehicleBreakdown } from "@/lib/dashboardApi";

interface VehicleChartProps {
  data: VehicleBreakdown[];
}

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444"];
const LABELS_ICONS: Record<string, string> = {
  Car: "🚗",
  Bike: "🏍️",
  EV: "⚡",
  Truck: "🚛",
};

const CustomTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null;
  const { name, value } = payload[0];
  return (
    <div className="bg-white dark:bg-slate-800 px-4 py-2 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 text-sm">
      <span className="font-semibold text-slate-800 dark:text-white">
        {LABELS_ICONS[name] || ""} {name}
      </span>
      <p className="text-slate-500 dark:text-slate-400">{value} vehicles</p>
    </div>
  );
};

export default function VehicleChart({ data }: VehicleChartProps) {
  const total = data.reduce((sum, d) => sum + d.value, 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="rounded-2xl border border-slate-200/60 dark:border-slate-700/60 bg-white dark:bg-slate-900 p-6 shadow-sm"
    >
      <div className="mb-4">
        <h3 className="text-lg font-bold text-slate-800 dark:text-white">
          Vehicle Distribution
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
          Breakdown by vehicle type
        </p>
      </div>

      <div className="flex flex-col lg:flex-row items-center gap-6">
        <div className="w-full lg:w-1/2 h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={95}
                paddingAngle={4}
                dataKey="value"
                strokeWidth={0}
              >
                {data.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                    className="hover:opacity-80 transition-opacity"
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend
                verticalAlign="bottom"
                height={36}
                formatter={(value: string) =>
                  `${LABELS_ICONS[value] || ""} ${value}`
                }
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="w-full lg:w-1/2 space-y-3">
          {data.map((item, i) => {
            const pct = total > 0 ? ((item.value / total) * 100).toFixed(1) : "0";
            return (
              <div key={item.name} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="font-medium text-slate-700 dark:text-slate-300">
                    {LABELS_ICONS[item.name]} {item.name}
                  </span>
                  <span className="text-slate-500 dark:text-slate-400">
                    {item.value} ({pct}%)
                  </span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 0.8, delay: i * 0.15 }}
                    className="h-full rounded-full"
                    style={{ backgroundColor: COLORS[i % COLORS.length] }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}
