import React from "react";
import { Avatar, Badge } from "antd";
import { HeartPulse, LogOut } from "lucide-react";
import { NavLink } from "react-router-dom";

function getInitials(name = "") {
  const parts = name.trim().split(" ").filter(Boolean);
  return parts.slice(0, 2).map((part) => part[0]?.toUpperCase()).join("") || "CS";
}

export default function DashboardSidebar({
  collapsed,
  items,
  brandLabel,
  brandMeta,
  profileName,
  profileEmail,
  onLogout,
  homePath,
}) {
  return (
    <aside
      className={`flex min-h-screen flex-col border-r border-slate-200 bg-white/95 backdrop-blur transition-all duration-300 ${
        collapsed ? "w-20" : "w-72"
      }`}
    >
      <div className={`border-b border-slate-200 px-5 py-5 ${collapsed ? "px-3" : ""}`}>
        <NavLink to={homePath} className={`flex items-center gap-3 ${collapsed ? "justify-center" : ""}`}>
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-900 text-white shadow-sm">
            <HeartPulse size={20} strokeWidth={2.2} />
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <h1 className="truncate text-lg font-semibold tracking-tight text-slate-900">{brandLabel}</h1>
              <p className="truncate text-[11px] uppercase tracking-[0.24em] text-slate-400">{brandMeta}</p>
            </div>
          )}
        </NavLink>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-5">
        {items.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `group relative flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-medium transition-all ${
                  isActive
                    ? "bg-slate-900 text-white shadow-sm"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                } ${collapsed ? "justify-center" : ""}`
              }
            >
              {({ isActive }) => (
                <>
                  <span className="flex-shrink-0">
                    <Icon size={18} strokeWidth={isActive ? 2.4 : 2} />
                  </span>
                  {!collapsed && <span className="truncate">{item.label}</span>}
                  {typeof item.badge === "number" && !collapsed && (
                    <Badge
                      count={item.badge}
                      size="small"
                      style={{ backgroundColor: isActive ? "#e2e8f0" : "#0f172a", color: isActive ? "#0f172a" : "#fff" }}
                    />
                  )}
                  {typeof item.badge === "number" && collapsed && (
                    <span className="absolute right-2 top-2 flex h-4 w-4 items-center justify-center rounded-full bg-slate-900 text-[9px] text-white">
                      {item.badge}
                    </span>
                  )}
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      <div className={`border-t border-slate-200 p-4 ${collapsed ? "px-3" : ""}`}>
        <div className={`flex items-center gap-3 rounded-2xl bg-slate-50 p-3 ${collapsed ? "justify-center bg-transparent p-0" : ""}`}>
          <Avatar
            size={collapsed ? 40 : 42}
            style={{ background: "linear-gradient(135deg, #0f172a, #334155)", color: "#ffffff", fontWeight: 700 }}
          >
            {getInitials(profileName)}
          </Avatar>
          {!collapsed && (
            <>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-slate-900">{profileName || "CureSync User"}</p>
                <p className="truncate text-xs text-slate-500">{profileEmail || "hello@curesync.app"}</p>
              </div>
              <button
                type="button"
                onClick={onLogout}
                className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-400 transition hover:bg-white hover:text-slate-900"
              >
                <LogOut size={17} />
              </button>
            </>
          )}
        </div>
      </div>
    </aside>
  );
}
