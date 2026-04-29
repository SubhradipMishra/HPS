import React, { useEffect, useState, useContext, useMemo } from "react";
import { Avatar, Progress, Table, Skeleton, Empty, message, Tag } from "antd";
import {
  CalendarOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  ArrowRightOutlined,
  UserOutlined,
  MedicineBoxOutlined,
  RiseOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import DoctorLayout from "../../components/DoctorLayout";
import Context from "../../util/context";
import API from "../../api/api";

function formatDate(dateString) {
  if (!dateString) return "";
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(dateString));
}

export default function DoctorDashboard() {
  const { session } = useContext(Context);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [appointments, setAppointments] = useState([]);

  const fetchAppointments = async () => {
    if (!session?.id) return;
    try {
      setLoading(true);
      const { data } = await API.get(`/appointment/doctor/${session.id}`);
      setAppointments(data.appointments || []);
    } catch (error) {
      message.error("Failed to fetch schedule");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, [session?.id]);

  const stats = useMemo(() => {
    const today = new Date().toISOString().split("T")[0];
    const todayAppts = appointments.filter(a => a.date === today);
    const completed = appointments.filter(a => a.status === "completed").length;
    const pending = appointments.filter(a => a.status === "booked").length;

    return [
      { label: "Today's Appointments", value: todayAppts.length, icon: <CalendarOutlined />, color: "pink" },
      { label: "Pending Reviews", value: pending, icon: <ClockCircleOutlined />, color: "amber" },
      { label: "Completed Today", value: todayAppts.filter(a => a.status === "completed").length, icon: <CheckCircleOutlined />, color: "blue" },
      { label: "Total Patients", value: [...new Set(appointments.map(a => a.patientId?._id))].length, icon: <UserOutlined />, color: "purple" },
    ];
  }, [appointments]);

  const apptColumns = [
    {
      title: "Patient",
      key: "patient",
      render: (_, record) => {
        const name = record.patientId?.name || "Patient";
        return (
          <div className="flex items-center gap-3">
            <Avatar size={32} style={{ background: "linear-gradient(135deg,#ef4444,#ec4899)", fontWeight: 600, fontSize: 11 }}>
              {name.slice(0, 2).toUpperCase()}
            </Avatar>
            <span className="text-sm font-medium text-gray-800">{name}</span>
          </div>
        );
      },
    },
    {
      title: "Time Slot",
      dataIndex: "slotTime",
      key: "slotTime",
      render: (v) => <Tag color="blue" className="rounded-md border-none px-2 font-bold">{v}</Tag>
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      render: (v) => <span className="text-xs text-gray-500">{formatDate(v)}</span>,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (v) => {
        const colors = {
          booked: "bg-blue-50 text-blue-600",
          completed: "bg-pink-50 text-pink-600",
          cancelled: "bg-red-50 text-red-500",
        };
        return (
          <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${colors[v] || "bg-gray-50 text-gray-500"}`}>
            {v}
          </span>
        );
      },
    },
  ];

  const today = new Date().toISOString().split("T")[0];
  const upcomingAppts = appointments.filter(a => a.date >= today && a.status === "booked").sort((a,b) => a.date.localeCompare(b.date));

  return (
    <DoctorLayout title="Doctor Dashboard" subtitle={`Welcome back, Dr. ${session?.name}`}>
      <div className="space-y-6">
        
        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((s, i) => (
            <div key={i} className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">{s.label}</p>
                <h3 className="text-2xl font-black text-slate-800">{loading ? "..." : s.value}</h3>
              </div>
              <div className={`w-12 h-12 rounded-2xl bg-${s.color}-50 text-${s.color}-600 flex items-center justify-center text-xl`}>
                {s.icon}
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          
          {/* Upcoming Appointments */}
          <div className="xl:col-span-2 space-y-6">
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="font-black text-slate-800 text-lg">Upcoming Appointments</h3>
                  <p className="text-xs text-slate-400 mt-0.5">Your schedule for the next few days</p>
                </div>
                <button 
                  onClick={() => navigate("/doctor/appointments")}
                  className="text-xs text-pink-600 font-bold bg-pink-50 px-4 py-2 rounded-xl hover:bg-pink-100 transition flex items-center gap-2"
                >
                  View Schedule <ArrowRightOutlined />
                </button>
              </div>
              
              <Table
                columns={apptColumns}
                dataSource={upcomingAppts.slice(0, 6)}
                rowKey="_id"
                pagination={false}
                loading={loading}
                className="caresync-table"
              />
            </div>

             {/* Patient Growth / Progress Placeholder */}
            <div className="bg-gradient-to-br from-red-500 to-pink-600 rounded-3xl p-8 text-white shadow-lg shadow-pink-100 relative overflow-hidden">
               <div className="relative z-10">
                 <h2 className="text-2xl font-black mb-2">Patient Care Progress</h2>
                 <p className="text-pink-100 text-sm mb-6 max-w-md opacity-80">
                   You have completed 85% of your scheduled sessions this week. Keep up the great work in providing quality healthcare!
                 </p>
                 <div className="flex items-end gap-6">
                    <div>
                      <p className="text-[10px] font-bold text-pink-200 uppercase tracking-widest mb-1">Weekly Target</p>
                      <h3 className="text-3xl font-black">42/50</h3>
                    </div>
                    <Progress 
                      percent={84} 
                      showInfo={false} 
                      strokeColor="#fff" 
                      railColor="rgba(255,255,255,0.2)"
                      className="flex-1 mb-2"
                      size={12}
                    />
                 </div>
               </div>
               <MedicineBoxOutlined className="absolute -right-8 -bottom-8 text-[200px] text-white opacity-10" />
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            
            {/* Quick Profile Card */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 text-center">
              <Avatar 
                size={80} 
                className="mx-auto mb-4 border-4 border-pink-50"
                style={{ background: "linear-gradient(135deg,#ef4444,#ec4899)", fontWeight: 800, fontSize: 32 }}
              >
                {session?.name?.slice(0,1).toUpperCase()}
              </Avatar>
              <h3 className="text-xl font-black text-slate-800">Dr. {session?.name}</h3>
              <p className="text-sm text-slate-500 font-medium mb-4">{session?.specialization}</p>
              <div className="flex items-center justify-center gap-2 py-2 px-4 bg-slate-50 rounded-2xl w-fit mx-auto border border-slate-100">
                 <RiseOutlined className="text-pink-500" />
                 <span className="text-xs font-bold text-slate-600">{session?.experience} Years Experience</span>
              </div>
            </div>

            {/* Department Info */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
               <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Department Details</h4>
               <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-pink-50 text-pink-600 flex items-center justify-center">
                      <MedicineBoxOutlined />
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 font-bold leading-none mb-1">Unit</p>
                      <p className="text-sm font-bold text-slate-700">{session?.department?.name || "N/A"}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                      <UserOutlined />
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 font-bold leading-none mb-1">Specialty</p>
                      <p className="text-sm font-bold text-slate-700">{session?.specialization}</p>
                    </div>
                  </div>
               </div>
            </div>

            {/* Quick Tips */}
            <div className="bg-amber-50 rounded-3xl p-6 border border-amber-100">
               <h4 className="text-xs font-black text-amber-600 uppercase tracking-widest mb-2">Doctor Tip</h4>
               <p className="text-xs text-amber-800 leading-relaxed italic">
                 "Reviewing patient history 5 minutes before the session improves consultation quality by 40%."
               </p>
            </div>

          </div>

        </div>

      </div>
    </DoctorLayout>
  );
}
