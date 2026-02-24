import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import {
  LayoutDashboard,
  Car,
  BarChart3,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  ParkingCircle,
  Bell,
  Users,
} from "lucide-react";

interface AdminSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const navItems = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "parking", label: "Parking Layout", icon: ParkingCircle },
  { id: "analytics", label: "Analytics", icon: BarChart3 },
  { id: "bookings", label: "Bookings", icon: Car },
  { id: "users", label: "Users", icon: Users },
  { id: "notifications", label: "Alerts", icon: Bell },
  { id: "settings", label: "Settings", icon: Settings },
];

export default function AdminSidebar({ activeTab, onTabChange }: AdminSidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const { user, logout } = useAuth();

  return (
    <motion.aside
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className={`
        fixed left-0 top-0 h-screen z-40 flex flex-col
        bg-white dark:bg-slate-950 border-r border-slate-200/60 dark:border-slate-800/60
        shadow-sm transition-all duration-300
        ${collapsed ? "w-[72px]" : "w-[250px]"}
      `}
    >
      {/* ─── Logo / Brand ─── */}
      <div className="flex items-center gap-3 px-4 h-16 border-b border-slate-100 dark:border-slate-800/60">
        <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white font-bold text-sm shadow-lg shadow-blue-600/25">
          SP
        </div>
        <AnimatePresence>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: "auto" }}
              exit={{ opacity: 0, width: 0 }}
              className="overflow-hidden whitespace-nowrap"
            >
              <h1 className="text-sm font-bold text-slate-800 dark:text-white">
                SPMOS
              </h1>
              <p className="text-[10px] text-slate-400 dark:text-slate-500 -mt-0.5">
                Admin Panel
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ─── Navigation ─── */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`
                w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium
                transition-all duration-200 group relative
                ${
                  isActive
                    ? "bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400"
                    : "text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900 hover:text-slate-700 dark:hover:text-slate-300"
                }
              `}
            >
              {isActive && (
                <motion.div
                  layoutId="sidebar-active"
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-blue-600 dark:bg-blue-400 rounded-r-full"
                />
              )}
              <Icon className={`w-[18px] h-[18px] flex-shrink-0 transition-transform group-hover:scale-110 ${isActive ? "text-blue-600 dark:text-blue-400" : ""}`} />
              <AnimatePresence>
                {!collapsed && (
                  <motion.span
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: "auto" }}
                    exit={{ opacity: 0, width: 0 }}
                    className="overflow-hidden whitespace-nowrap"
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          );
        })}
      </nav>

      {/* ─── User / Collapse ─── */}
      <div className="border-t border-slate-100 dark:border-slate-800/60 p-3 space-y-2">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-slate-400 dark:text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-900 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          {!collapsed && <span>Collapse</span>}
        </button>

        <div className={`flex items-center gap-3 px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 ${collapsed ? "justify-center" : ""}`}>
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0 shadow-sm">
            {user?.name?.charAt(0)?.toUpperCase() || "A"}
          </div>
          <AnimatePresence>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                className="overflow-hidden flex-1 min-w-0"
              >
                <p className="text-xs font-semibold text-slate-700 dark:text-slate-200 truncate">
                  {user?.name || "Admin"}
                </p>
                <p className="text-[10px] text-slate-400 dark:text-slate-500 truncate">
                  {user?.email || "admin@spmos.com"}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <button
          onClick={logout}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors ${collapsed ? "justify-center" : ""}`}
        >
          <LogOut className="w-[18px] h-[18px] flex-shrink-0" />
          <AnimatePresence>
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                className="overflow-hidden whitespace-nowrap"
              >
                Logout
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>
    </motion.aside>
  );
}
