import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import type { HistoricalEntry } from "@/lib/dashboardApi";

interface HistoricalChartProps {
  data: HistoricalEntry[];
  onPeriodChange: (period: "day" | "week" | "month") => void;
  activePeriod: "day" | "week" | "month";
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white dark:bg-slate-800 px-4 py-3 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 text-sm">
      <p className="font-semibold text-slate-800 dark:text-white mb-1">
        {label}
      </p>
      {payload.map((entry: any) => (
        <p key={entry.name} style={{ color: entry.color }}>
          {entry.name === "incoming" ? "↓ Incoming" : "↑ Outgoing"}:{" "}
          <span className="font-semibold">{entry.value}</span>
        </p>
      ))}
    </div>
  );
};

const periods: { label: string; value: "day" | "week" | "month" }[] = [
  { label: "Day", value: "day" },
  { label: "Week", value: "week" },
  { label: "Month", value: "month" },
];

export default function HistoricalChart({
  data,
  onPeriodChange,
  activePeriod,
}: HistoricalChartProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="rounded-2xl border border-slate-200/60 dark:border-slate-700/60 bg-white dark:bg-slate-900 p-6 shadow-sm"
    >
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-lg font-bold text-slate-800 dark:text-white">
            Traffic Analytics
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Incoming vs outgoing vehicles
          </p>
        </div>
        <div className="flex bg-slate-100 dark:bg-slate-800 rounded-lg p-1">
          {periods.map((p) => (
            <button
              key={p.value}
              onClick={() => onPeriodChange(p.value)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all duration-200 ${
                activePeriod === p.value
                  ? "bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm"
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300"
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} barGap={4} barCategoryGap="20%">
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#e2e8f0"
              className="dark:opacity-20"
            />
            <XAxis
              dataKey="label"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: "#94a3b8" }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: "#94a3b8" }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              verticalAlign="top"
              align="right"
              height={36}
              formatter={(value: string) =>
                value === "incoming" ? "↓ Incoming" : "↑ Outgoing"
              }
            />
            <Bar
              dataKey="incoming"
              fill="#3b82f6"
              radius={[6, 6, 0, 0]}
              maxBarSize={40}
            />
            <Bar
              dataKey="outgoing"
              fill="#10b981"
              radius={[6, 6, 0, 0]}
              maxBarSize={40}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
