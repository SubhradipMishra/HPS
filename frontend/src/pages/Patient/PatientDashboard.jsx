import React, { useState } from "react";
import {
  Badge, Avatar, Progress, Tag, Calendar
} from "antd";
import {
  HeartOutlined,
  DashboardOutlined,
  CalendarOutlined,
  FileTextOutlined,
  MedicineBoxOutlined,
  DollarOutlined,
  BellOutlined,
  SettingOutlined,
  LogoutOutlined,
  UserOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  ArrowUpOutlined,
  ArrowRightOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  HeartFilled,
  ThunderboltOutlined,
  FireOutlined,
} from "@ant-design/icons";

const sidebarItems = [
  { key: "dashboard", icon: <DashboardOutlined />, label: "Dashboard" },
  { key: "appointments", icon: <CalendarOutlined />, label: "Appointments" },
  { key: "records", icon: <FileTextOutlined />, label: "Medical Records" },
  { key: "prescriptions", icon: <MedicineBoxOutlined />, label: "Prescriptions" },
  { key: "billing", icon: <DollarOutlined />, label: "Billing" },
  { key: "notifications", icon: <BellOutlined />, label: "Notifications", badge: 3 },
  { key: "settings", icon: <SettingOutlined />, label: "Settings" },
];

const upcomingAppointments = [
  { id: 1, doctor: "Dr. Priya Sharma", specialty: "Cardiologist", date: "Apr 2, 2026", time: "10:30 AM", status: "confirmed", avatar: "PS" },
  { id: 2, doctor: "Dr. Arjun Mehta", specialty: "Dermatologist", date: "Apr 5, 2026", time: "2:00 PM", status: "pending", avatar: "AM" },
  { id: 3, doctor: "Dr. Neha Kapoor", specialty: "General Physician", date: "Apr 10, 2026", time: "11:00 AM", status: "confirmed", avatar: "NK" },
];

const recentPrescriptions = [
  { name: "Metformin 500mg", freq: "Twice daily", refill: "12 days left", color: "from-red-400 to-pink-500" },
  { name: "Atorvastatin 10mg", freq: "Once at night", refill: "24 days left", color: "from-pink-400 to-rose-500" },
  { name: "Vitamin D3", freq: "Once daily", refill: "30 days left", color: "from-rose-300 to-pink-400" },
];

const vitals = [
  { label: "Heart Rate", value: "72", unit: "bpm", icon: <HeartFilled />, color: "text-red-500", bg: "bg-red-50", progress: 72, max: 100 },
  { label: "Blood Pressure", value: "118/76", unit: "mmHg", icon: <ThunderboltOutlined />, color: "text-pink-500", bg: "bg-pink-50", progress: 78, max: 100 },
  { label: "Blood Sugar", value: "98", unit: "mg/dL", icon: <FireOutlined />, color: "text-rose-500", bg: "bg-rose-50", progress: 65, max: 100 },
  { label: "BMI", value: "22.4", unit: "kg/m²", icon: <UserOutlined />, color: "text-red-400", bg: "bg-red-50", progress: 55, max: 100 },
];

const statCards = [
  { label: "Total Appointments", value: "24", change: "+3 this month", icon: <CalendarOutlined />, gradient: "from-red-500 to-pink-500" },
  { label: "Prescriptions Active", value: "3", change: "2 refills due", icon: <MedicineBoxOutlined />, gradient: "from-pink-500 to-rose-400" },
  { label: "Pending Bills", value: "₹1,240", change: "Due in 5 days", icon: <DollarOutlined />, gradient: "from-rose-500 to-pink-600" },
  { label: "Health Score", value: "87%", change: "+5% vs last month", icon: <HeartOutlined />, gradient: "from-red-400 to-rose-500" },
];

export default function PatientDashboard() {
  const [collapsed, setCollapsed] = useState(false);
  const [activeKey, setActiveKey] = useState("dashboard");

  return (
    <div
      className="min-h-screen flex font-sans"
      style={{
        background: "linear-gradient(135deg, #fff5f5 0%, #fff0f6 40%, #fce4ec 100%)",
        fontFamily: "'Plus Jakarta Sans', 'Segoe UI', sans-serif",
      }}
    >
      {/* ── SIDEBAR ── */}
      <aside
        className={`flex flex-col transition-all duration-300 ease-in-out ${collapsed ? "w-20" : "w-64"} min-h-screen bg-white border-r border-pink-100 shadow-sm relative z-20`}
      >
        {/* Logo */}
        <div className={`flex items-center gap-3 px-5 py-5 border-b border-pink-100 ${collapsed ? "justify-center px-0" : ""}`}>
          <div className="bg-gradient-to-r from-red-500 to-pink-500 p-2 rounded-xl flex-shrink-0">
            <HeartOutlined className="text-white text-lg" />
          </div>
          {!collapsed && (
            <h1 className="text-xl font-bold bg-gradient-to-r from-red-500 to-pink-500 bg-clip-text text-transparent whitespace-nowrap">
              CareSync
            </h1>
          )}
        </div>

        {/* Nav Items */}
        <nav className="flex-1 py-4 px-3 flex flex-col gap-1">
          {sidebarItems.map((item) => (
            <button
              key={item.key}
              onClick={() => setActiveKey(item.key)}
              className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all duration-200 group relative
                ${activeKey === item.key
                  ? "bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-md shadow-pink-200"
                  : "text-gray-600 hover:bg-red-50 hover:text-red-500"
                } ${collapsed ? "justify-center" : ""}`}
            >
              <span className={`text-base flex-shrink-0 ${activeKey === item.key ? "text-white" : ""}`}>
                {item.icon}
              </span>
              {!collapsed && <span className="whitespace-nowrap">{item.label}</span>}
              {item.badge && !collapsed && (
                <span className="ml-auto bg-red-100 text-red-500 text-xs font-bold px-2 py-0.5 rounded-full">
                  {item.badge}
                </span>
              )}
              {item.badge && collapsed && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 rounded-full text-white text-[9px] flex items-center justify-center">
                  {item.badge}
                </span>
              )}
            </button>
          ))}
        </nav>

        {/* Patient Profile at bottom */}
        <div className={`border-t border-pink-100 p-4 ${collapsed ? "flex justify-center" : ""}`}>
          {collapsed ? (
            <Avatar
              size={36}
              className="bg-gradient-to-r from-red-500 to-pink-500 cursor-pointer"
            >
              R
            </Avatar>
          ) : (
            <div className="flex items-center gap-3">
              <Avatar
                size={38}
                className="flex-shrink-0"
                style={{ background: "linear-gradient(135deg, #ef4444, #ec4899)" }}
              >
                R
              </Avatar>
              <div className="overflow-hidden">
                <p className="text-sm font-semibold text-gray-800 truncate">Rohit Kumar</p>
                <p className="text-xs text-gray-400 truncate">rohit@gmail.com</p>
              </div>
              <LogoutOutlined className="ml-auto text-gray-400 hover:text-red-500 cursor-pointer text-sm flex-shrink-0" />
            </div>
          )}
        </div>
      </aside>

      {/* ── MAIN CONTENT ── */}
      <main className="flex-1 flex flex-col overflow-hidden">

        {/* Top Bar */}
        <header className="bg-white/70 backdrop-blur border-b border-pink-100 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="text-gray-500 hover:text-red-500 transition text-xl"
            >
              {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            </button>
            <div>
              <h2 className="text-lg font-bold text-gray-800">Good morning, Rohit 👋</h2>
              <p className="text-xs text-gray-400">Tuesday, March 31, 2026</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Badge count={3} size="small">
              <button className="w-9 h-9 rounded-xl bg-red-50 flex items-center justify-center text-red-400 hover:bg-red-100 transition">
                <BellOutlined />
              </button>
            </Badge>
            <Avatar
              size={36}
              style={{ background: "linear-gradient(135deg, #ef4444, #ec4899)", cursor: "pointer" }}
            >
              R
            </Avatar>
          </div>
        </header>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">

          {/* Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            {statCards.map((card, i) => (
              <div
                key={i}
                className="relative bg-white rounded-2xl p-5 shadow-sm border border-pink-50 overflow-hidden group hover:shadow-md transition-all duration-300"
              >
                <div className={`absolute -right-4 -top-4 w-20 h-20 rounded-full bg-gradient-to-br ${card.gradient} opacity-10 group-hover:opacity-20 transition`} />
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${card.gradient} flex items-center justify-center text-white mb-3`}>
                  {card.icon}
                </div>
                <p className="text-2xl font-bold text-gray-800">{card.value}</p>
                <p className="text-sm text-gray-500 mt-0.5">{card.label}</p>
                <p className="text-xs text-red-400 mt-1 flex items-center gap-1">
                  <ArrowUpOutlined className="text-[10px]" /> {card.change}
                </p>
              </div>
            ))}
          </div>

          {/* Vitals + Appointments Row */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">

            {/* Vitals */}
            <div className="xl:col-span-1 bg-white rounded-2xl p-5 shadow-sm border border-pink-50">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-gray-800 text-base">Health Vitals</h3>
                <span className="text-xs text-pink-400 bg-pink-50 px-2 py-1 rounded-full">Last updated today</span>
              </div>
              <div className="space-y-4">
                {vitals.map((v, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-xl ${v.bg} flex items-center justify-center ${v.color} flex-shrink-0`}>
                      {v.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-gray-500">{v.label}</span>
                        <span className="font-semibold text-gray-800">{v.value} <span className="text-gray-400 font-normal">{v.unit}</span></span>
                      </div>
                      <Progress
                        percent={v.progress}
                        showInfo={false}
                        size="small"
                        strokeColor={{ from: "#ef4444", to: "#ec4899" }}
                        trailColor="#fce7f3"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Upcoming Appointments */}
            <div className="xl:col-span-2 bg-white rounded-2xl p-5 shadow-sm border border-pink-50">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-gray-800 text-base">Upcoming Appointments</h3>
                <button className="text-xs text-red-500 hover:text-pink-600 font-medium flex items-center gap-1">
                  View all <ArrowRightOutlined className="text-[10px]" />
                </button>
              </div>
              <div className="space-y-3">
                {upcomingAppointments.map((apt) => (
                  <div
                    key={apt.id}
                    className="flex items-center gap-4 p-3 rounded-xl bg-gradient-to-r from-red-50/50 to-pink-50/50 border border-pink-100/60 hover:border-pink-200 transition"
                  >
                    <Avatar
                      size={42}
                      style={{ background: "linear-gradient(135deg, #ef4444, #ec4899)", flexShrink: 0, fontWeight: 700 }}
                    >
                      {apt.avatar}
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-800 text-sm truncate">{apt.doctor}</p>
                      <p className="text-xs text-gray-400">{apt.specialty}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-xs font-semibold text-gray-700">{apt.date}</p>
                      <p className="text-xs text-gray-400 flex items-center gap-1 justify-end mt-0.5">
                        <ClockCircleOutlined className="text-[10px]" /> {apt.time}
                      </p>
                    </div>
                    <Tag
                      className={`ml-2 rounded-full text-xs border-0 flex-shrink-0 ${apt.status === "confirmed"
                        ? "bg-green-50 text-green-600"
                        : "bg-yellow-50 text-yellow-600"
                        }`}
                      icon={apt.status === "confirmed" ? <CheckCircleOutlined /> : <ExclamationCircleOutlined />}
                    >
                      {apt.status}
                    </Tag>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Prescriptions + Calendar Row */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">

            {/* Active Prescriptions */}
            <div className="xl:col-span-2 bg-white rounded-2xl p-5 shadow-sm border border-pink-50">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-gray-800 text-base">Active Prescriptions</h3>
                <button className="text-xs text-red-500 hover:text-pink-600 font-medium flex items-center gap-1">
                  View all <ArrowRightOutlined className="text-[10px]" />
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {recentPrescriptions.map((rx, i) => (
                  <div
                    key={i}
                    className="rounded-xl overflow-hidden border border-pink-100 hover:shadow-md transition"
                  >
                    <div className={`bg-gradient-to-r ${rx.color} px-4 py-3`}>
                      <MedicineBoxOutlined className="text-white text-xl" />
                    </div>
                    <div className="p-3">
                      <p className="font-semibold text-gray-800 text-sm">{rx.name}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{rx.freq}</p>
                      <div className="mt-2 bg-red-50 text-red-500 text-xs px-2 py-1 rounded-full inline-block font-medium">
                        {rx.refill}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Mini Calendar */}
            <div className="xl:col-span-1 bg-white rounded-2xl p-5 shadow-sm border border-pink-50">
              <h3 className="font-bold text-gray-800 text-base mb-3">Calendar</h3>
              <div className="scale-90 origin-top-left" style={{ width: "111%" }}>
                <Calendar
                  fullscreen={false}
                  className="caresync-calendar"
                />
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-pink-50">
            <h3 className="font-bold text-gray-800 text-base mb-4">Recent Activity</h3>
            <div className="space-y-3">
              {[
                { icon: <CalendarOutlined />, text: "Appointment confirmed with Dr. Priya Sharma", time: "2 hours ago", color: "bg-red-50 text-red-500" },
                { icon: <FileTextOutlined />, text: "Blood test report uploaded", time: "Yesterday", color: "bg-pink-50 text-pink-500" },
                { icon: <DollarOutlined />, text: "Invoice #INV-2024 of ₹850 generated", time: "2 days ago", color: "bg-rose-50 text-rose-500" },
                { icon: <MedicineBoxOutlined />, text: "Prescription renewed by Dr. Arjun Mehta", time: "3 days ago", color: "bg-red-50 text-red-400" },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-4 py-2 border-b border-gray-50 last:border-0">
                  <div className={`w-9 h-9 rounded-xl ${item.color} flex items-center justify-center flex-shrink-0`}>
                    {item.icon}
                  </div>
                  <p className="flex-1 text-sm text-gray-700">{item.text}</p>
                  <span className="text-xs text-gray-400 flex-shrink-0">{item.time}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </main>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        .caresync-calendar .ant-picker-calendar-header { padding: 0 0 8px 0; }
        .caresync-calendar .ant-picker-panel { border: none !important; }
        .caresync-calendar .ant-picker-cell-selected .ant-picker-cell-inner {
          background: linear-gradient(135deg, #ef4444, #ec4899) !important;
          border-radius: 8px !important;
        }
        .caresync-calendar .ant-picker-cell-today .ant-picker-cell-inner::before {
          border-color: #ef4444 !important;
          border-radius: 8px !important;
        }
      `}</style>
    </div>
  );
}