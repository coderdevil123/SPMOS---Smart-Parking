import { ReactNode } from "react";
import { motion } from "framer-motion";

interface SummaryCardProps {
  title: string;
  value: number | string;
  icon: ReactNode;
  trend?: string;
  trendUp?: boolean;
  color: "blue" | "green" | "red" | "amber";
}

const colorMap = {
  blue: {
    bg: "bg-blue-50 dark:bg-blue-950/40",
    icon: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
    border: "border-blue-200/50 dark:border-blue-800/50",
    value: "text-blue-700 dark:text-blue-300",
  },
  green: {
    bg: "bg-emerald-50 dark:bg-emerald-950/40",
    icon: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    border: "border-emerald-200/50 dark:border-emerald-800/50",
    value: "text-emerald-700 dark:text-emerald-300",
  },
  red: {
    bg: "bg-rose-50 dark:bg-rose-950/40",
    icon: "bg-rose-500/10 text-rose-600 dark:text-rose-400",
    border: "border-rose-200/50 dark:border-rose-800/50",
    value: "text-rose-700 dark:text-rose-300",
  },
  amber: {
    bg: "bg-amber-50 dark:bg-amber-950/40",
    icon: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
    border: "border-amber-200/50 dark:border-amber-800/50",
    value: "text-amber-700 dark:text-amber-300",
  },
};

export default function SummaryCard({
  title,
  value,
  icon,
  trend,
  trendUp,
  color,
}: SummaryCardProps) {
  const c = colorMap[color];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={`relative overflow-hidden rounded-2xl border ${c.border} ${c.bg} p-5 shadow-sm hover:shadow-md transition-all duration-300`}
    >
      <div className="absolute -top-6 -right-6 w-20 h-20 rounded-full bg-gradient-to-br from-white/20 to-transparent blur-xl" />
      <div className="flex items-start justify-between relative z-10">
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            {title}
          </p>
          <p className={`text-3xl font-bold ${c.value}`}>{value}</p>
          {trend && (
            <p
              className={`text-xs font-medium flex items-center gap-1 ${
                trendUp
                  ? "text-emerald-600 dark:text-emerald-400"
                  : "text-rose-600 dark:text-rose-400"
              }`}
            >
              <span>{trendUp ? "↑" : "↓"}</span>
              {trend}
            </p>
          )}
        </div>
        <div className={`rounded-xl p-3 ${c.icon}`}>{icon}</div>
      </div>
    </motion.div>
  );
}
