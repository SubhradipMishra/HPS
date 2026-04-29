import React, { useState, useEffect, useContext, useMemo } from "react";
import { Avatar, Button, Empty, Input, Select, Skeleton, Table, Tag, message, Modal } from "antd";
import {
  CalendarOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  SearchOutlined,
  MedicineBoxOutlined,
  TeamOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
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

const statusConfig = {
  booked:    { color: "bg-blue-50 text-blue-600",   icon: <ClockCircleOutlined />,       tag: "blue" },
  completed: { color: "bg-green-50 text-green-600", icon: <CheckCircleOutlined />,       tag: "green" },
  cancelled: { color: "bg-red-50 text-red-500",     icon: <CloseCircleOutlined />,       tag: "default" },
};

export default function AdminAppointments() {
  const { session } = useContext(Context);
  const [appointments, setAppointments] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [messageApi, contextHolder] = message.useMessage();

  // Filters
  const [filterDept, setFilterDept] = useState("all");
  const [filterDoctor, setFilterDoctor] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchText, setSearchText] = useState("");

  /* ─── Fetch all appointments for this hospital ─── */
  const fetchAppointments = async () => {
    if (!session?.hospitalId) return;
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filterStatus !== "all") params.append("status", filterStatus);
      if (filterDept !== "all") params.append("departmentId", filterDept);
      if (filterDoctor !== "all") params.append("doctorId", filterDoctor);

      const { data } = await API.get(
        `/appointment/hospital/${session.hospitalId}?${params.toString()}`
      );
      setAppointments(data.appointments || []);
    } catch {
      setAppointments([]);
      messageApi.error("Failed to load appointments");
    } finally {
      setLoading(false);
    }
  };

  /* ─── Fetch departments & doctors ─── */
  useEffect(() => {
    if (!session?.hospitalId) return;

    const loadMeta = async () => {
      try {
        const [deptRes, docRes] = await Promise.all([
          API.get("/department"),
          API.get(`/doctor/${session.hospitalId}`),
        ]);
        setDepartments(deptRes.data.departments || []);
        setDoctors(docRes.data.doctors || []);
      } catch {
        /* silent */
      }
    };

    loadMeta();
  }, [session?.hospitalId]);

  useEffect(() => {
    fetchAppointments();
  }, [session?.hospitalId, filterStatus, filterDept, filterDoctor]);

  /* ─── Computed stats ─── */
  const stats = useMemo(() => {
    const total = appointments.length;
    const booked = appointments.filter((a) => a.status === "booked").length;
    const completed = appointments.filter((a) => a.status === "completed").length;
    const cancelled = appointments.filter((a) => a.status === "cancelled").length;
    return { total, booked, completed, cancelled };
  }, [appointments]);

  /* ─── Doctor per department breakdown ─── */
  const deptDoctorBreakdown = useMemo(() => {
    const map = {};

    appointments.forEach((appt) => {
      const deptName = appt.departmentId?.name || "Unknown";
      const docName = appt.doctorId?.name || "Unknown";

      if (!map[deptName]) map[deptName] = {};
      if (!map[deptName][docName]) map[deptName][docName] = 0;
      map[deptName][docName]++;
    });

    return Object.entries(map).map(([dept, docs]) => ({
      dept,
      doctors: Object.entries(docs)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count),
      total: Object.values(docs).reduce((s, c) => s + c, 0),
    })).sort((a, b) => b.total - a.total);
  }, [appointments]);

  /* ─── Filtered by search text ─── */
  const filteredAppointments = useMemo(() => {
    if (!searchText.trim()) return appointments;
    const q = searchText.toLowerCase();
    return appointments.filter(
      (a) =>
        a.patientId?.name?.toLowerCase().includes(q) ||
        a.doctorId?.name?.toLowerCase().includes(q) ||
        a.departmentId?.name?.toLowerCase().includes(q)
    );
  }, [appointments, searchText]);

  /* ─── Doctors filtered by selected department ─── */
  const filteredDoctors = useMemo(() => {
    if (filterDept === "all") return doctors;
    return doctors.filter((d) => d.departmentId?._id === filterDept);
  }, [doctors, filterDept]);

  /* ─── Actions ─── */
  const handleComplete = async (appointmentId) => {
    try {
      await API.patch(`/appointment/${appointmentId}/complete`);
      messageApi.success("Appointment marked as completed");
      fetchAppointments();
    } catch (err) {
      messageApi.error(err?.response?.data?.message || "Failed to complete appointment");
    }
  };

  const handleCancel = async (appointmentId) => {
    try {
      await API.patch(`/appointment/${appointmentId}/cancel`);
      messageApi.success("Appointment cancelled");
      fetchAppointments();
    } catch (err) {
      messageApi.error(err?.response?.data?.message || "Failed to cancel appointment");
    }
  };

  const confirmAction = (type, appointmentId, patientName) => {
    Modal.confirm({
      title: type === "complete" ? "Complete Appointment" : "Cancel Appointment",
      icon: type === "complete" ? <CheckCircleOutlined style={{ color: "#22c55e" }} /> : <ExclamationCircleOutlined style={{ color: "#ef4444" }} />,
      content: `Are you sure you want to ${type} the appointment for ${patientName || "this patient"}?`,
      okText: type === "complete" ? "Yes, Complete" : "Yes, Cancel",
      okButtonProps: {
        className: type === "complete"
          ? "bg-green-500 hover:bg-green-600 border-none"
          : "bg-red-500 hover:bg-red-600 border-none",
      },
      cancelText: "Go Back",
      onOk: () => type === "complete" ? handleComplete(appointmentId) : handleCancel(appointmentId),
    });
  };

  /* ─── Table columns ─── */
  const columns = [
    {
      title: "Patient",
      key: "patient",
      render: (_, record) => {
        const name = record.patientId?.name || "Patient";
        return (
          <div className="flex items-center gap-3">
            <Avatar size={34} style={{ background: "linear-gradient(135deg,#ef4444,#ec4899)", fontWeight: 600, fontSize: 12 }}>
              {name.split(" ").map((w) => w[0]).join("").substring(0, 2).toUpperCase()}
            </Avatar>
            <div>
              <span className="text-sm font-semibold text-gray-800 block">{name}</span>
              <span className="text-xs text-gray-400">{record.patientId?.email || record.patientId?.mobileNumber || ""}</span>
            </div>
          </div>
        );
      },
    },
    {
      title: "Doctor",
      key: "doctor",
      render: (_, record) => (
        <div>
          <span className="text-sm font-medium text-gray-700 block">{record.doctorId?.name || "Doctor"}</span>
          <span className="text-xs text-gray-400">{record.doctorId?.specialization || ""}</span>
        </div>
      ),
    },
    {
      title: "Department",
      key: "department",
      render: (_, record) => (
        <span className="text-xs bg-pink-50 text-pink-600 px-2 py-1 rounded-full font-semibold flex items-center gap-1 w-fit">
          <MedicineBoxOutlined /> {record.departmentId?.name || "N/A"}
        </span>
      ),
    },
    {
      title: "Date & Time",
      key: "datetime",
      render: (_, record) => (
        <div>
          <span className="text-sm text-gray-700 font-medium block">{formatDate(record.date)}</span>
          <span className="text-xs text-gray-400 flex items-center gap-1"><ClockCircleOutlined /> {record.slotTime}</span>
        </div>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (v) => {
        const cfg = statusConfig[v] || statusConfig.booked;
        return (
          <span className={`text-xs px-2.5 py-1 rounded-full font-medium flex items-center gap-1 w-fit ${cfg.color}`}>
            {cfg.icon} {v}
          </span>
        );
      },
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => {
        if (record.status !== "booked") {
          return <span className="text-xs text-gray-400">—</span>;
        }
        return (
          <div className="flex items-center gap-2">
            <button
              onClick={() => confirmAction("complete", record._id, record.patientId?.name)}
              className="px-3 py-1.5 rounded-lg bg-green-50 text-green-600 text-xs font-semibold hover:bg-green-100 transition flex items-center gap-1"
            >
              <CheckCircleOutlined /> Complete
            </button>
            <button
              onClick={() => confirmAction("cancel", record._id, record.patientId?.name)}
              className="px-3 py-1.5 rounded-lg bg-red-50 text-red-500 text-xs font-semibold hover:bg-red-100 transition flex items-center gap-1"
            >
              <CloseCircleOutlined /> Cancel
            </button>
          </div>
        );
      },
    },
  ];

  const statCards = [
    { label: "Total Appointments", value: stats.total, gradient: "from-red-500 to-pink-500", icon: <CalendarOutlined /> },
    { label: "Booked (Active)", value: stats.booked, gradient: "from-blue-500 to-indigo-500", icon: <ClockCircleOutlined /> },
    { label: "Completed", value: stats.completed, gradient: "from-green-500 to-emerald-500", icon: <CheckCircleOutlined /> },
    { label: "Cancelled", value: stats.cancelled, gradient: "from-rose-500 to-pink-600", icon: <CloseCircleOutlined /> },
  ];

  return (
    <AdminLayout title="Appointments" subtitle="Manage all hospital appointments">
      {contextHolder}
      <div className="space-y-6">

        {/* ── Stat Cards ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map((c, i) => (
            <div key={i} className="relative bg-white rounded-2xl p-5 shadow-sm border border-pink-50 overflow-hidden group hover:shadow-md transition-all">
              <div className={`absolute -right-3 -top-3 w-16 h-16 rounded-full bg-gradient-to-br ${c.gradient} opacity-10 group-hover:opacity-20 transition`} />
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-1">{c.label}</p>
                  {loading ? (
                    <Skeleton.Input active size="small" style={{ width: 48, height: 28 }} />
                  ) : (
                    <h3 className="text-2xl font-bold text-gray-800">{c.value}</h3>
                  )}
                </div>
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${c.gradient} flex items-center justify-center text-white text-lg`}>
                  {c.icon}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ── Filters & Table + Sidebar ── */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">

          {/* Main table section */}
          <div className="xl:col-span-2 bg-white rounded-2xl p-5 shadow-sm border border-pink-50">

            {/* Filters */}
            <div className="flex flex-wrap items-center gap-3 mb-5">
              <Select
                value={filterDept}
                onChange={(v) => { setFilterDept(v); setFilterDoctor("all"); }}
                className="min-w-[170px]"
                options={[
                  { label: "All Departments", value: "all" },
                  ...departments.map((d) => ({ label: d.name, value: d._id })),
                ]}
              />
              <Select
                value={filterDoctor}
                onChange={(v) => setFilterDoctor(v)}
                className="min-w-[170px]"
                options={[
                  { label: "All Doctors", value: "all" },
                  ...filteredDoctors.map((d) => ({ label: d.name, value: d._id })),
                ]}
              />
              <Select
                value={filterStatus}
                onChange={(v) => setFilterStatus(v)}
                className="min-w-[140px]"
                options={[
                  { label: "All Status", value: "all" },
                  { label: "Booked", value: "booked" },
                  { label: "Completed", value: "completed" },
                  { label: "Cancelled", value: "cancelled" },
                ]}
              />
              <Input
                placeholder="Search patient or doctor..."
                prefix={<SearchOutlined className="text-gray-400" />}
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                className="rounded-lg bg-gray-50 border-transparent hover:border-pink-200 focus:border-pink-300 w-52"
              />
            </div>

            {/* Table */}
            <Table
              columns={columns}
              dataSource={filteredAppointments}
              rowKey="_id"
              loading={loading}
              pagination={{ pageSize: 8, showSizeChanger: false }}
              className="caresync-table"
              locale={{
                emptyText: (
                  <Empty
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                    description="No appointments found for the selected filters"
                  />
                ),
              }}
            />
          </div>

          {/* Sidebar — Doctor per Department breakdown */}
          <div className="xl:col-span-1 space-y-5">

            {/* Quick summary */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-pink-50">
              <h3 className="font-bold text-gray-800 text-base mb-4">Appointment Status</h3>
              <div className="space-y-3">
                {[
                  { label: "Booked", val: stats.booked, color: "bg-blue-400" },
                  { label: "Completed", val: stats.completed, color: "bg-green-400" },
                  { label: "Cancelled", val: stats.cancelled, color: "bg-red-400" },
                ].map((s, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${s.color}`} />
                    <span className="text-sm text-gray-600 flex-1">{s.label}</span>
                    <span className="text-sm font-bold text-gray-800">{loading ? "..." : s.val}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Doctor per Department */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-pink-50">
              <h3 className="font-bold text-gray-800 text-base mb-4">Doctors per Department</h3>
              {loading ? (
                <Skeleton active paragraph={{ rows: 4 }} />
              ) : deptDoctorBreakdown.length === 0 ? (
                <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="No data yet" />
              ) : (
                <div className="space-y-4">
                  {deptDoctorBreakdown.map((item, idx) => (
                    <div key={idx} className="rounded-xl border border-pink-100 bg-pink-50/40 p-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs bg-pink-100 text-pink-700 px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
                          <MedicineBoxOutlined /> {item.dept}
                        </span>
                        <span className="text-xs font-bold text-gray-500">{item.total} appts</span>
                      </div>
                      <div className="space-y-1.5">
                        {item.doctors.map((doc, di) => (
                          <div key={di} className="flex items-center gap-2">
                            <Avatar size={24} style={{ background: "linear-gradient(135deg,#ef4444,#ec4899)", fontSize: 10, fontWeight: 700 }}>
                              {doc.name.split(" ").map((w) => w[0]).join("").substring(0, 2).toUpperCase()}
                            </Avatar>
                            <span className="text-xs text-gray-700 flex-1 truncate">{doc.name}</span>
                            <span className="text-xs font-bold text-gray-600">{doc.count}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Recent activity mini-list */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-pink-50">
              <h3 className="font-bold text-gray-800 text-base mb-4">Latest Activity</h3>
              {loading ? (
                <Skeleton active paragraph={{ rows: 3 }} />
              ) : appointments.length === 0 ? (
                <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="No activity" />
              ) : (
                <div className="space-y-3">
                  {appointments.slice(0, 5).map((appt) => (
                    <div key={appt._id} className="flex items-start gap-2.5">
                      <span className={`mt-1 w-2 h-2 rounded-full flex-shrink-0 ${
                        appt.status === "booked" ? "bg-blue-400" :
                        appt.status === "completed" ? "bg-green-400" : "bg-red-400"
                      }`} />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-gray-700 leading-snug truncate">
                          <span className="font-semibold">{appt.patientId?.name || "Patient"}</span> → {appt.doctorId?.name || "Doctor"}
                        </p>
                        <p className="text-[10px] text-gray-400 mt-0.5">
                          {formatDate(appt.date)} • {appt.slotTime} • <span className="capitalize">{appt.status}</span>
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
