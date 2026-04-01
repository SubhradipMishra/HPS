import React, { useState, useEffect, useContext } from "react";
import { Avatar, Badge, Select } from "antd";
import {
  HeartOutlined,
  DashboardOutlined,
  TeamOutlined,
  CalendarOutlined,
  FileTextOutlined,
  MedicineBoxOutlined,
  DollarOutlined,
  BellOutlined,
  SettingOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  SafetyOutlined,
  BarChartOutlined,
  AuditOutlined,
} from "@ant-design/icons";
import { useNavigate, useLocation, Link } from "react-router-dom";
import Context from "../util/context";
import API from "../api/api";
const sidebarItems = [
  { key: "/admin/dashboard", icon: <DashboardOutlined />, label: "Dashboard" },
  { key: "/admin/patients", icon: <TeamOutlined />, label: "Patients", badge: 5 },
  { key: "/admin/doctors", icon: <SafetyOutlined />, label: "Doctors" },
  { key: "/admin/appointments", icon: <CalendarOutlined />, label: "Appointments" },
  { key: "/admin/departments", icon: <MedicineBoxOutlined />, label: "Departments" },
  { key: "/admin/billing", icon: <DollarOutlined />, label: "Billing" },
  { key: "/admin/reports", icon: <BarChartOutlined />, label: "Reports" },
  { key: "/admin/audit", icon: <AuditOutlined />, label: "Audit Logs" },
  { key: "/admin/notifications", icon: <BellOutlined />, label: "Notifications", badge: 9 },
  { key: "/admin/settings", icon: <SettingOutlined />, label: "Settings" },
];

export default function AdminLayout({ children, title = "Admin Dashboard", subtitle = "Today" }) {
  const [collapsed, setCollapsed] = useState(false);
  const { session, setSession, sessionLoading } = useContext(Context);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!sessionLoading) {
      if (!session) {
        navigate("/login");
      } else if (session?.role !== "admin") {
        navigate("/");
      }
    }
  }, [session, sessionLoading, navigate]);

  const activeKey = location.pathname;

  const handleLogout = async () => {
    try {
      await API.post("/auth/logout");
      setSession(null);
      navigate("/login");
    } catch (error) {
      setSession(null);
      navigate("/login");
    }
  };

  return (
    <div
      className="min-h-screen flex"
      style={{
        background: "linear-gradient(135deg,#fff5f5 0%,#fff0f6 45%,#fce4ec 100%)",
        fontFamily: "'Plus Jakarta Sans','Segoe UI',sans-serif",
      }}
    >
      {/* ── SIDEBAR ── */}
      <aside
        className={`flex flex-col transition-all duration-300 ${collapsed ? "w-20" : "w-64"} min-h-screen bg-white border-r border-pink-100 shadow-sm z-20 flex-shrink-0`}
      >
        {/* Logo */}
        <div className={`flex items-center gap-3 px-5 py-5 border-b border-pink-100 ${collapsed ? "justify-center px-0" : ""}`}>
          <div className="bg-gradient-to-r from-red-500 to-pink-500 p-2 rounded-xl flex-shrink-0 cursor-pointer" onClick={() => navigate("/admin/dashboard")}>
            <HeartOutlined className="text-white text-lg" />
          </div>
          {!collapsed && (
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-red-500 to-pink-500 bg-clip-text text-transparent leading-none">CareSync</h1>
              <p className="text-[10px] text-gray-400 font-medium tracking-widest mt-0.5">ADMIN PANEL</p>
            </div>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 px-3 flex flex-col gap-1 overflow-y-auto">
          {sidebarItems.map((item) => (
            <Link
              to={item.key}
              key={item.key}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 relative
                ${activeKey === item.key || activeKey.startsWith(item.key)
                  ? "bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-md shadow-pink-200"
                  : "text-gray-600 hover:bg-red-50 hover:text-red-500"
                } ${collapsed ? "justify-center" : ""}`}
            >
              <span className="text-base flex-shrink-0">{item.icon}</span>
              {!collapsed && <span className="whitespace-nowrap flex-1 text-left">{item.label}</span>}
              {item.badge && !collapsed && (
                <span className="bg-red-100 text-red-500 text-xs font-bold px-1.5 py-0.5 rounded-full">{item.badge}</span>
              )}
              {item.badge && collapsed && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 rounded-full text-white text-[9px] flex items-center justify-center">{item.badge}</span>
              )}
            </Link>
          ))}
        </nav>

        {/* Admin profile */}
        <div className={`border-t border-pink-100 p-4 ${collapsed ? "flex justify-center" : ""}`}>
          {collapsed ? (
            <Avatar size={36} style={{ background: "linear-gradient(135deg,#ef4444,#ec4899)", cursor: "pointer" }}>A</Avatar>
          ) : (
            <div className="flex items-center gap-3">
              <Avatar size={38} style={{ background: "linear-gradient(135deg,#ef4444,#ec4899)", flexShrink: 0 }}>A</Avatar>
              <div className="overflow-hidden">
                <p className="text-sm font-semibold text-gray-800 truncate">{session?.name || "Admin User"}</p>
                <p className="text-xs text-gray-400 truncate">{session?.email || "admin@caresync.in"}</p>
              </div>
              <LogoutOutlined onClick={handleLogout} className="ml-auto text-gray-400 hover:text-red-500 cursor-pointer flex-shrink-0" />
            </div>
          )}
        </div>
      </aside>

      {/* ── MAIN ── */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">

        {/* Top bar */}
        <header className="bg-white/70 backdrop-blur border-b border-pink-100 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <button onClick={() => setCollapsed(!collapsed)} className="text-gray-500 hover:text-red-500 transition text-xl">
              {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            </button>
            <div>
              <h2 className="text-lg font-bold text-gray-800">{title}</h2>
              <p className="text-xs text-gray-400">{subtitle}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Select defaultValue="today" size="small" className="w-28"
              options={[{ value: "today", label: "Today" }, { value: "week", label: "This Week" }, { value: "month", label: "This Month" }]}
            />
            <Badge count={9} size="small">
              <button className="w-9 h-9 rounded-xl bg-red-50 flex items-center justify-center text-red-400 hover:bg-red-100 transition">
                <BellOutlined />
              </button>
            </Badge>
            <Avatar size={36} style={{ background: "linear-gradient(135deg,#ef4444,#ec4899)", cursor: "pointer" }}>A</Avatar>
          </div>
        </header>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6">
          {children}
        </div>
      </main>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        * { font-family: 'Plus Jakarta Sans', 'Segoe UI', sans-serif; }
        .caresync-table .ant-table { background: transparent; }
        .caresync-table .ant-table-thead > tr > th {
          background: #fff5f5 !important;
          color: #be185d;
          font-weight: 700;
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          border-bottom: 1px solid #fce7f3 !important;
        }
        .caresync-table .ant-table-tbody > tr > td { border-bottom: 1px solid #fff0f6 !important; }
        .caresync-table .ant-table-tbody > tr:last-child > td { border-bottom: none !important; }
      `}</style>
    </div>
  );
}
