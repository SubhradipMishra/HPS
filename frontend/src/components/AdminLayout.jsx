import React, { useContext, useEffect, useState } from "react";
import { Avatar, Badge, Select, Spin } from "antd";
import { Bell, CalendarDays, ClipboardList, LayoutDashboard, Menu, Settings, ShieldPlus, Stethoscope, Wallet } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Context from "../util/context";
import API from "../api/api";
import DashboardSidebar from "./DashboardSidebar";

const sidebarItems = [
  { to: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/admin/doctors", label: "Doctors", icon: Stethoscope },
  { to: "/admin/departments", label: "Departments", icon: ClipboardList },
  { to: "/admin/appointments", label: "Appointments", icon: CalendarDays },
  { to: "/admin/billing", label: "Billing", icon: Wallet },
  { to: "/admin/settings", label: "Settings", icon: Settings },
  { to: "/admin/security", label: "Security", icon: ShieldPlus },
];

export default function AdminLayout({ children, title = "Admin Dashboard", subtitle = "Today" }) {
  const [collapsed, setCollapsed] = useState(false);
  const { session, setSession, sessionLoading } = useContext(Context);
  const navigate = useNavigate();

  useEffect(() => {
    if (!sessionLoading) {
      if (!session) {
        navigate("/login");
      } else if (session.role !== "admin") {
        navigate("/");
      }
    }
  }, [navigate, session, sessionLoading]);

  const handleLogout = async () => {
    try {
      await API.post("/auth/logout");
    } catch {
      void 0;
    } finally {
      setSession(null);
      navigate("/login");
    }
  };

  if (sessionLoading || !session || session.role !== "admin") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f4f7fb]" style={{ fontFamily: "'Plus Jakarta Sans','Segoe UI',sans-serif" }}>
      <div className="absolute inset-x-0 top-0 h-80 bg-[radial-gradient(circle_at_top_left,_rgba(148,163,184,0.18),_transparent_48%),radial-gradient(circle_at_top_right,_rgba(14,165,233,0.10),_transparent_36%)]" />
      <div className="relative flex min-h-screen">
        <DashboardSidebar
          collapsed={collapsed}
          items={sidebarItems}
          brandLabel="CureSync"
          brandMeta="Admin Console"
          profileName={session.name}
          profileEmail={session.email}
          onLogout={handleLogout}
          homePath="/admin/dashboard"
        />

        <main className="flex min-w-0 flex-1 flex-col overflow-hidden">
          <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/80 px-6 py-4 backdrop-blur">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={() => setCollapsed((value) => !value)}
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-600 transition hover:text-slate-900"
                >
                  <Menu size={18} />
                </button>
                <div>
                  <h2 className="text-lg font-bold text-slate-900">{title}</h2>
                  <p className="text-sm text-slate-500">{subtitle}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Select
                  defaultValue="today"
                  size="small"
                  className="w-28"
                  options={[
                    { value: "today", label: "Today" },
                    { value: "week", label: "This Week" },
                    { value: "month", label: "This Month" },
                  ]}
                />
                <Badge count={9} size="small">
                  <button className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 shadow-sm">
                    <Bell size={17} />
                  </button>
                </Badge>
                <Avatar size={36} style={{ background: "linear-gradient(135deg,#0f172a,#334155)", cursor: "pointer" }}>
                  {(session.name || "A").slice(0, 1).toUpperCase()}
                </Avatar>
              </div>
            </div>
          </header>

          <div className="flex-1 overflow-y-auto p-6">{children}</div>
        </main>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        * { font-family: 'Plus Jakarta Sans', 'Segoe UI', sans-serif; }
        .caresync-table .ant-table { background: transparent; }
        .caresync-table .ant-table-thead > tr > th {
          background: #f8fafc !important;
          color: #334155;
          font-weight: 700;
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          border-bottom: 1px solid #e2e8f0 !important;
        }
        .caresync-table .ant-table-tbody > tr > td { border-bottom: 1px solid #eef2f7 !important; }
        .caresync-table .ant-table-tbody > tr:last-child > td { border-bottom: none !important; }
      `}</style>
    </div>
  );
}
