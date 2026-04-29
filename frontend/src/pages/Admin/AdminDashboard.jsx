import React, { useEffect, useState, useContext, useMemo } from "react";
import { Avatar, Progress, Table, Skeleton, Empty, message } from "antd";
import {
  TeamOutlined,
  CalendarOutlined,
  MedicineBoxOutlined,
  SafetyOutlined,
  ArrowUpOutlined,
  ArrowRightOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ClockCircleOutlined,
  RiseOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../../components/AdminLayout";
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

export default function AdminDashboard() {
  const { session } = useContext(Context);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    appointments: [],
    doctors: [],
    departments: [],
  });

  const fetchData = async () => {
    if (!session?.hospitalId) return;
    try {
      setLoading(true);
      const [apptRes, docRes, deptRes] = await Promise.all([
        API.get(`/appointment/hospital/${session.hospitalId}`),
        API.get(`/doctor/${session.hospitalId}`),
        API.get("/department"),
      ]);

      setData({
        appointments: apptRes.data.appointments || [],
        doctors: docRes.data.doctors || [],
        departments: deptRes.data.departments || [],
      });
    } catch (error) {
      message.error("Failed to fetch dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [session?.hospitalId]);

  const stats = useMemo(() => {
    const { appointments, doctors, departments } = data;
    const today = new Date().toISOString().split("T")[0];
    
    return [
      { 
        label: "Total Doctors", 
        value: doctors.length, 
        icon: <SafetyOutlined />, 
        gradient: "from-blue-500 to-indigo-500",
        link: "/admin/doctors"
      },
      { 
        label: "Departments", 
        value: departments.length, 
        icon: <MedicineBoxOutlined />, 
        gradient: "from-purple-500 to-pink-500",
        link: "/admin/departments"
      },
      { 
        label: "Total Appointments", 
        value: appointments.length, 
        icon: <CalendarOutlined />, 
        gradient: "from-orange-500 to-red-500",
        link: "/admin/appointments"
      },
      { 
        label: "Today's Scheduled", 
        value: appointments.filter(a => a.date === today).length, 
        icon: <ClockCircleOutlined />, 
        gradient: "from-emerald-500 to-teal-500",
        link: "/admin/appointments"
      },
      { 
        label: "Completed", 
        value: appointments.filter(a => a.status === "completed").length, 
        icon: <CheckCircleOutlined />, 
        gradient: "from-cyan-500 to-blue-500",
        link: "/admin/appointments"
      },
      { 
        label: "Cancelled", 
        value: appointments.filter(a => a.status === "cancelled").length, 
        icon: <CloseCircleOutlined />, 
        gradient: "from-rose-500 to-pink-600",
        link: "/admin/appointments"
      },
    ];
  }, [data]);

  const deptLoad = useMemo(() => {
    const { appointments, departments } = data;
    if (departments.length === 0) return [];

    return departments.map(dept => {
      const count = appointments.filter(a => a.departmentId?._id === dept._id).length;
      const total = appointments.length || 1;
      return {
        name: dept.name,
        count,
        percent: Math.round((count / total) * 100),
        color: dept.name.length % 2 === 0 ? "#ec4899" : "#f43f5e"
      };
    }).sort((a, b) => b.count - a.count).slice(0, 5);
  }, [data]);

  const topDoctors = useMemo(() => {
    const { appointments, doctors } = data;
    const docMap = {};
    
    appointments.forEach(a => {
      const id = a.doctorId?._id;
      if (id) {
        docMap[id] = (docMap[id] || 0) + 1;
      }
    });

    return doctors
      .map(doc => ({
        ...doc,
        appts: docMap[doc._id] || 0
      }))
      .sort((a, b) => b.appts - a.appts)
      .slice(0, 5);
  }, [data]);

  const apptColumns = [
    {
      title: "Patient",
      key: "patient",
      render: (_, record) => {
        const name = record.patientId?.name || "Patient";
        return (
          <div className="flex items-center gap-3">
            <Avatar size={32} style={{ background: "linear-gradient(135deg,#ef4444,#ec4899)", fontWeight: 600, fontSize: 11 }}>
              {name.split(" ").map((w) => w[0]).join("").substring(0, 2).toUpperCase()}
            </Avatar>
            <span className="text-sm font-medium text-gray-800">{name}</span>
          </div>
        );
      },
    },
    {
      title: "Doctor",
      key: "doctor",
      render: (_, record) => <span className="text-sm text-gray-600">{record.doctorId?.name || "Doctor"}</span>,
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
          completed: "bg-green-50 text-green-600",
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

  return (
    <AdminLayout title="Dashboard" subtitle={`Welcome back, ${session?.name || "Admin"}`}>
      <div className="space-y-6">
        
        {/* ── Stat Cards ── */}
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {stats.map((c, i) => (
            <div 
              key={i} 
              onClick={() => navigate(c.link)}
              className="relative bg-white rounded-2xl p-4 shadow-sm border border-pink-50 overflow-hidden group hover:shadow-md transition-all cursor-pointer"
            >
              <div className={`absolute -right-3 -top-3 w-16 h-16 rounded-full bg-gradient-to-br ${c.gradient} opacity-10 group-hover:opacity-20 transition`} />
              <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${c.gradient} flex items-center justify-center text-white mb-3 text-sm`}>
                {c.icon}
              </div>
              {loading ? (
                <Skeleton.Input active size="small" style={{ width: 40 }} />
              ) : (
                <h3 className="text-xl font-bold text-gray-800">{c.value}</h3>
              )}
              <p className="text-xs text-gray-400 font-medium mt-0.5 uppercase tracking-wide">{c.label}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          
          {/* ── Recent Appointments ── */}
          <div className="xl:col-span-2 space-y-6">
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-pink-50">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="font-bold text-gray-800 text-lg">Recent Appointments</h3>
                  <p className="text-xs text-gray-400 mt-0.5">Latest activity in your hospital</p>
                </div>
                <button 
                  onClick={() => navigate("/admin/appointments")}
                  className="text-xs text-pink-600 font-bold bg-pink-50 px-4 py-2 rounded-xl hover:bg-pink-100 transition flex items-center gap-2"
                >
                  View All <ArrowRightOutlined />
                </button>
              </div>
              
              <Table
                columns={apptColumns}
                dataSource={data.appointments.slice(0, 6)}
                rowKey="_id"
                pagination={false}
                loading={loading}
                className="caresync-table"
                onRow={(record) => ({
                  onClick: () => navigate("/admin/appointments"),
                  className: "cursor-pointer"
                })}
              />
            </div>

            {/* ── Extra Stats Row ── */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="bg-white rounded-3xl p-6 shadow-sm border border-pink-50 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-8 opacity-5">
                    <RiseOutlined style={{ fontSize: 120 }} />
                  </div>
                  <h4 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <RiseOutlined className="text-pink-500" />
                    Growth Analytics
                  </h4>
                  <div className="space-y-4">
                    <div className="flex items-end justify-between">
                      <div>
                        <p className="text-xs text-gray-400">Monthly Growth</p>
                        <h2 className="text-2xl font-black text-gray-800">+12.5%</h2>
                      </div>
                      <div className="text-green-500 text-xs font-bold flex items-center gap-1 mb-1">
                        <ArrowUpOutlined /> Healthy
                      </div>
                    </div>
                    <Progress 
                      percent={75} 
                      showInfo={false} 
                      strokeColor={{ from: '#ec4899', to: '#ef4444' }}
                      trailColor="#fff1f2"
                      strokeWidth={10}
                    />
                  </div>
               </div>

               <div className="bg-white rounded-3xl p-6 shadow-sm border border-pink-50">
                  <h4 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <TeamOutlined className="text-blue-500" />
                    Patient Distribution
                  </h4>
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex-1 text-center p-3 rounded-2xl bg-blue-50 border border-blue-100">
                      <p className="text-[10px] text-blue-400 font-bold uppercase">Returning</p>
                      <h3 className="text-lg font-bold text-blue-700">64%</h3>
                    </div>
                    <div className="flex-1 text-center p-3 rounded-2xl bg-pink-50 border border-pink-100">
                      <p className="text-[10px] text-pink-400 font-bold uppercase">New</p>
                      <h3 className="text-lg font-bold text-pink-700">36%</h3>
                    </div>
                  </div>
                  <div className="mt-4 flex gap-1 h-2 rounded-full overflow-hidden">
                    <div className="bg-blue-500 w-[64%]" />
                    <div className="bg-pink-500 w-[36%]" />
                  </div>
               </div>
            </div>
          </div>

          {/* ── Sidebar: Department Load & Top Doctors ── */}
          <div className="space-y-6">
            
            {/* Department Load */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-pink-50">
              <h3 className="font-bold text-gray-800 text-base mb-5">Department Load</h3>
              {loading ? (
                <Skeleton active paragraph={{ rows: 4 }} />
              ) : deptLoad.length === 0 ? (
                <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
              ) : (
                <div className="space-y-5">
                  {deptLoad.map((dept, i) => (
                    <div key={i}>
                      <div className="flex justify-between items-center mb-1.5">
                        <span className="text-xs font-bold text-gray-600">{dept.name}</span>
                        <span className="text-[10px] font-black text-gray-400">{dept.count} appts</span>
                      </div>
                      <Progress 
                        percent={dept.percent} 
                        showInfo={false} 
                        strokeColor={dept.color}
                        trailColor="#fce7f3"
                        size="small"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Top Doctors */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-pink-50">
              <h3 className="font-bold text-gray-800 text-base mb-5">Top Performing Doctors</h3>
              {loading ? (
                <Skeleton active avatar paragraph={{ rows: 4 }} />
              ) : topDoctors.length === 0 ? (
                <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
              ) : (
                <div className="space-y-4">
                  {topDoctors.map((doc, i) => (
                    <div 
                      key={i} 
                      onClick={() => navigate(`/admin/doctors/${doc._id}/appointments`)}
                      className="flex items-center gap-3 p-3 rounded-2xl hover:bg-pink-50 transition cursor-pointer group"
                    >
                      <Avatar 
                        size={40} 
                        style={{ background: "linear-gradient(135deg,#ef4444,#ec4899)", fontWeight: 700 }}
                      >
                        {doc.name.split(" ").map(w => w[0]).join("").substring(0,2).toUpperCase()}
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-gray-800 truncate group-hover:text-pink-600 transition">{doc.name}</p>
                        <p className="text-[10px] text-gray-400 font-medium">{doc.specialization}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-black text-gray-700">{doc.appts}</p>
                        <p className="text-[9px] text-gray-400 font-bold uppercase">Appts</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div className="bg-gradient-to-br from-red-500 to-pink-600 rounded-3xl p-6 text-white shadow-lg shadow-pink-200">
               <h3 className="font-bold text-lg mb-2">Hospital Management</h3>
               <p className="text-xs text-pink-100 mb-6 leading-relaxed opacity-80">
                 Quickly manage your hospital resources and check patient appointments.
               </p>
               <button 
                 onClick={() => navigate("/admin/doctors")}
                 className="w-full py-3 bg-white text-pink-600 rounded-2xl font-bold text-sm shadow-sm hover:shadow-md transition active:scale-95"
               >
                 Go to Doctors Directory
               </button>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}