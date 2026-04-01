import React, { useEffect, useState } from "react";
import { Avatar, Progress, Table } from "antd";
import {
  TeamOutlined,
  CalendarOutlined,
  FileTextOutlined,
  MedicineBoxOutlined,
  DollarOutlined,
  SafetyOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  ArrowRightOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import AdminLayout from "../../components/AdminLayout";

/* ─── Stat cards ─── */
const statCards = [
  { label: "Total Patients",      value: "3,842", change: "+128 this month", up: true,  icon: <TeamOutlined />,         gradient: "from-red-500 to-pink-500" },
  { label: "Active Doctors",      value: "64",    change: "+4 this month",   up: true,  icon: <SafetyOutlined />,       gradient: "from-pink-500 to-rose-400" },
  { label: "Today's Appointments",value: "187",   change: "+12 vs yesterday",up: true,  icon: <CalendarOutlined />,     gradient: "from-rose-500 to-pink-600" },
  { label: "Revenue (Mar)",       value: "₹9.4L", change: "+18% vs Feb",     up: true,  icon: <DollarOutlined />,       gradient: "from-red-400 to-rose-500" },
  { label: "Pending Bills",       value: "42",    change: "−6 vs last week",  up: false, icon: <FileTextOutlined />,     gradient: "from-pink-400 to-red-400" },
  { label: "Bed Occupancy",       value: "78%",   change: "−3% this week",    up: false, icon: <MedicineBoxOutlined />,  gradient: "from-rose-400 to-pink-500" },
];

/* ─── Department occupancy ─── */
const departments = [
  { name: "Cardiology",   patients: 48, capacity: 60, color: "#ef4444" },
  { name: "Orthopedics",  patients: 35, capacity: 50, color: "#ec4899" },
  { name: "Neurology",    patients: 29, capacity: 40, color: "#f43f5e" },
  { name: "Pediatrics",   patients: 52, capacity: 70, color: "#fb7185" },
  { name: "Dermatology",  patients: 18, capacity: 30, color: "#fda4af" },
];

/* ─── Recent appointments ─── */
const recentAppointments = [
  { key: "1", patient: "Rahul Verma",   doctor: "Dr. Priya Sharma",  dept: "Cardiology",  time: "09:00 AM", status: "completed" },
  { key: "2", patient: "Sneha Gupta",   doctor: "Dr. Arjun Mehta",   dept: "Dermatology", time: "10:15 AM", status: "ongoing"   },
  { key: "3", patient: "Amit Khanna",   doctor: "Dr. Neha Kapoor",   dept: "Orthopedics", time: "11:00 AM", status: "waiting"   },
  { key: "4", patient: "Pooja Singh",   doctor: "Dr. Raj Patel",     dept: "Neurology",   time: "12:30 PM", status: "cancelled" },
  { key: "5", patient: "Deepak Nair",   doctor: "Dr. Sunita Rao",    dept: "Pediatrics",  time: "02:00 PM", status: "completed" },
  { key: "6", patient: "Kavita Joshi",  doctor: "Dr. Priya Sharma",  dept: "Cardiology",  time: "03:30 PM", status: "waiting"   },
];

const statusConfig = {
  completed: { color: "bg-green-50 text-green-600", icon: <CheckCircleOutlined /> },
  ongoing:   { color: "bg-blue-50 text-blue-500",   icon: <ClockCircleOutlined /> },
  waiting:   { color: "bg-yellow-50 text-yellow-600", icon: <ExclamationCircleOutlined /> },
  cancelled: { color: "bg-red-50 text-red-500",     icon: <CloseCircleOutlined /> },
};

/* ─── Top doctors ─── */
const topDoctors = [
  { name: "Dr. Priya Sharma",  dept: "Cardiology",   patients: 124, rating: 4.9, avatar: "PS" },
  { name: "Dr. Arjun Mehta",   dept: "Dermatology",  patients: 98,  rating: 4.8, avatar: "AM" },
  { name: "Dr. Neha Kapoor",   dept: "Orthopedics",  patients: 87,  rating: 4.7, avatar: "NK" },
  { name: "Dr. Raj Patel",     dept: "Neurology",    patients: 76,  rating: 4.6, avatar: "RP" },
];

/* ─── Revenue bars (simple inline chart) ─── */
const revenueData = [
  { month: "Oct", val: 55 }, { month: "Nov", val: 70 },
  { month: "Dec", val: 60 }, { month: "Jan", val: 80 },
  { month: "Feb", val: 75 }, { month: "Mar", val: 94 },
];

/* ─── Table columns ─── */
const apptColumns = [
  {
    title: "Patient",
    dataIndex: "patient",
    render: (v) => (
      <div className="flex items-center gap-2">
        <Avatar size={28} style={{ background: "linear-gradient(135deg,#ef4444,#ec4899)", fontSize: 11 }}>
          {v.split(" ").map(w => w[0]).join("")}
        </Avatar>
        <span className="text-sm font-medium text-gray-800">{v}</span>
      </div>
    ),
  },
  { title: "Doctor",     dataIndex: "doctor",  render: v => <span className="text-sm text-gray-600">{v}</span> },
  { title: "Department", dataIndex: "dept",    render: v => <span className="text-xs bg-pink-50 text-pink-600 px-2 py-0.5 rounded-full font-medium">{v}</span> },
  { title: "Time",       dataIndex: "time",    render: v => <span className="text-xs text-gray-500 flex items-center gap-1"><ClockCircleOutlined />{v}</span> },
  {
    title: "Status", dataIndex: "status",
    render: v => (
      <span className={`text-xs px-2.5 py-1 rounded-full font-medium flex items-center gap-1 w-fit ${statusConfig[v].color}`}>
        {statusConfig[v].icon} {v}
      </span>
    ),
  },
];

export default function AdminDashboard() {
  return (
    <AdminLayout title="Admin Dashboard" subtitle="Tuesday, March 31, 2026">
      <div className="space-y-6">
        {/* ── Stat cards ── */}
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {statCards.map((c, i) => (
            <div key={i} className="relative bg-white rounded-2xl p-4 shadow-sm border border-pink-50 overflow-hidden group hover:shadow-md transition-all">
              <div className={`absolute -right-3 -top-3 w-16 h-16 rounded-full bg-gradient-to-br ${c.gradient} opacity-10 group-hover:opacity-20 transition`} />
              <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${c.gradient} flex items-center justify-center text-white mb-2 text-sm`}>
                {c.icon}
              </div>
              <p className="text-xl font-bold text-gray-800">{c.value}</p>
              <p className="text-xs text-gray-500 mt-0.5 leading-tight">{c.label}</p>
              <p className={`text-[11px] mt-1 flex items-center gap-0.5 font-medium ${c.up ? "text-green-500" : "text-red-400"}`}>
                {c.up ? <ArrowUpOutlined className="text-[9px]" /> : <ArrowDownOutlined className="text-[9px]" />}
                {c.change}
              </p>
            </div>
          ))}
        </div>

        {/* ── Revenue chart + Department occupancy ── */}
        <div className="grid grid-cols-1 xl:grid-cols-5 gap-5">
          {/* Revenue bar chart */}
          <div className="xl:col-span-3 bg-white rounded-2xl p-5 shadow-sm border border-pink-50">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="font-bold text-gray-800 text-base">Monthly Revenue</h3>
                <p className="text-xs text-gray-400 mt-0.5">Oct 2025 – Mar 2026</p>
              </div>
              <span className="text-sm font-bold text-green-500 bg-green-50 px-3 py-1 rounded-full flex items-center gap-1">
                <ArrowUpOutlined className="text-xs" /> 18% vs last month
              </span>
            </div>
            {/* Custom bar chart */}
            <div className="flex items-end gap-3 h-44">
              {revenueData.map((d, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <span className="text-xs font-bold text-gray-700">₹{d.val}K</span>
                  <div className="w-full rounded-t-xl relative overflow-hidden" style={{ height: `${d.val * 1.6}px` }}>
                    <div
                      className={`absolute inset-0 rounded-t-xl ${i === revenueData.length - 1
                        ? "bg-gradient-to-t from-red-500 to-pink-400"
                        : "bg-gradient-to-t from-pink-200 to-red-100"}`}
                    />
                  </div>
                  <span className="text-[11px] text-gray-400">{d.month}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Department occupancy */}
          <div className="xl:col-span-2 bg-white rounded-2xl p-5 shadow-sm border border-pink-50">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-800 text-base">Department Load</h3>
              <button className="text-xs text-red-500 font-medium flex items-center gap-1">View all <ArrowRightOutlined className="text-[10px]" /></button>
            </div>
            <div className="space-y-4">
              {departments.map((d, i) => (
                <div key={i}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-700 font-medium">{d.name}</span>
                    <span className="text-gray-400">{d.patients}/{d.capacity}</span>
                  </div>
                  <Progress
                    percent={Math.round((d.patients / d.capacity) * 100)}
                    showInfo={false}
                    size="small"
                    strokeColor={d.color}
                    trailColor="#fce7f3"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Appointments table + Top Doctors ── */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
          {/* Table */}
          <div className="xl:col-span-2 bg-white rounded-2xl p-5 shadow-sm border border-pink-50">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-800 text-base">Today's Appointments</h3>
              <button className="text-xs text-red-500 font-medium flex items-center gap-1">View all <ArrowRightOutlined className="text-[10px]" /></button>
            </div>
            <Table
              dataSource={recentAppointments}
              columns={apptColumns}
              pagination={false}
              size="small"
              rowClassName="hover:bg-pink-50/40 transition"
              className="caresync-table"
            />
          </div>

          {/* Top Doctors */}
          <div className="xl:col-span-1 bg-white rounded-2xl p-5 shadow-sm border border-pink-50">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-800 text-base">Top Doctors</h3>
              <button className="text-xs text-red-500 font-medium flex items-center gap-1">View all <ArrowRightOutlined className="text-[10px]" /></button>
            </div>
            <div className="space-y-4">
              {topDoctors.map((doc, i) => (
                <div key={i} className="flex items-center gap-3 p-2 rounded-xl hover:bg-pink-50 transition">
                  <div className="relative flex-shrink-0">
                    <Avatar size={44} style={{ background: "linear-gradient(135deg,#ef4444,#ec4899)", fontWeight: 700, fontSize: 13 }}>
                      {doc.avatar}
                    </Avatar>
                    <span className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-green-400 rounded-full border-2 border-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-800 truncate">{doc.name}</p>
                    <p className="text-xs text-gray-400">{doc.dept}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-xs font-bold text-gray-700">{doc.patients} <span className="text-gray-400 font-normal">pts</span></p>
                    <p className="text-xs text-yellow-500 font-semibold">★ {doc.rating}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Quick Stats row ── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {/* New vs returning patients */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-pink-50">
            <h3 className="font-bold text-gray-800 text-base mb-4">Patient Mix</h3>
            <div className="flex items-center justify-center gap-6 mb-4">
              <div className="text-center">
                <div className="text-2xl font-bold bg-gradient-to-r from-red-500 to-pink-500 bg-clip-text text-transparent">68%</div>
                <div className="text-xs text-gray-400 mt-0.5">Returning</div>
              </div>
              <div className="w-px h-10 bg-pink-100" />
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-700">32%</div>
                <div className="text-xs text-gray-400 mt-0.5">New</div>
              </div>
            </div>
            <Progress percent={68} showInfo={false} strokeColor={{ from: "#ef4444", to: "#ec4899" }} trailColor="#fce7f3" />
          </div>

          {/* Appointment status summary */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-pink-50">
            <h3 className="font-bold text-gray-800 text-base mb-4">Appointment Status</h3>
            <div className="space-y-2.5">
              {[
                { label: "Completed", val: 94, color: "bg-green-400" },
                { label: "Ongoing",   val: 12, color: "bg-blue-400" },
                { label: "Waiting",   val: 43, color: "bg-yellow-400" },
                { label: "Cancelled", val: 8,  color: "bg-red-400" },
              ].map((s, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${s.color}`} />
                  <span className="text-sm text-gray-600 flex-1">{s.label}</span>
                  <span className="text-sm font-bold text-gray-800">{s.val}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent system alerts */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-pink-50">
            <h3 className="font-bold text-gray-800 text-base mb-4">System Alerts</h3>
            <div className="space-y-3">
              {[
                { text: "ICU bed capacity at 90%", level: "critical", time: "5m ago" },
                { text: "Blood bank: O− stock low", level: "warning", time: "22m ago" },
                { text: "Server backup completed", level: "success", time: "1h ago" },
                { text: "New doctor account pending approval", level: "info", time: "2h ago" },
              ].map((a, i) => (
                <div key={i} className="flex items-start gap-2">
                  <span className={`mt-0.5 w-2 h-2 rounded-full flex-shrink-0 ${
                    a.level === "critical" ? "bg-red-500" :
                    a.level === "warning"  ? "bg-yellow-400" :
                    a.level === "success"  ? "bg-green-400" : "bg-blue-400"
                  }`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-700 leading-snug">{a.text}</p>
                    <p className="text-[10px] text-gray-400 mt-0.5">{a.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}