import React, { useState, useEffect, useContext, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Avatar,
  Button,
  Empty,
  Input,
  Skeleton,
  Tag,
  message,
  Modal,
  Tooltip,
} from "antd";
const { TextArea } = Input;
import {
  CalendarOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  SearchOutlined,
  ArrowLeftOutlined,
  MedicineBoxOutlined,
  ExclamationCircleOutlined,
  UserOutlined,
  PhoneOutlined,
  MailOutlined,
} from "@ant-design/icons";
import AdminLayout from "../../components/AdminLayout";
import Context from "../../util/context";
import API from "../../api/api";

/* ─── Helpers ─── */
function formatDate(dateString) {
  if (!dateString) return "";
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(dateString));
}

function formatWeekday(dateString) {
  if (!dateString) return "";
  return new Intl.DateTimeFormat("en-IN", { weekday: "long" }).format(
    new Date(dateString)
  );
}

/** Returns true if the appointment date+slotTime is in the past */
function isSlotPassed(dateStr, slotTime) {
  if (!dateStr || !slotTime) return false;
  try {
    // slotTime comes as "HH:MM" or "HH:MM AM/PM"
    const dateObj = new Date(dateStr);
    const timeParts = slotTime.match(/(\d{1,2}):(\d{2})\s*(AM|PM)?/i);
    if (!timeParts) return false;

    let hours = parseInt(timeParts[1], 10);
    const minutes = parseInt(timeParts[2], 10);
    const meridian = timeParts[3];

    if (meridian) {
      if (meridian.toUpperCase() === "PM" && hours !== 12) hours += 12;
      if (meridian.toUpperCase() === "AM" && hours === 12) hours = 0;
    }

    dateObj.setHours(hours, minutes, 0, 0);
    return dateObj <= new Date();
  } catch {
    return false;
  }
}

const STATUS_TABS = [
  { key: "all", label: "All", icon: <CalendarOutlined />, gradient: "from-slate-500 to-slate-700" },
  { key: "booked", label: "Booked", icon: <ClockCircleOutlined />, gradient: "from-blue-500 to-indigo-500" },
  { key: "completed", label: "Completed", icon: <CheckCircleOutlined />, gradient: "from-green-500 to-emerald-500" },
  { key: "cancelled", label: "Cancelled", icon: <CloseCircleOutlined />, gradient: "from-rose-500 to-pink-600" },
];

const statusBadge = {
  booked: {
    bg: "bg-blue-50",
    text: "text-blue-600",
    border: "border-blue-200",
    dot: "bg-blue-500",
    icon: <ClockCircleOutlined />,
    label: "Booked",
  },
  completed: {
    bg: "bg-emerald-50",
    text: "text-emerald-600",
    border: "border-emerald-200",
    dot: "bg-emerald-500",
    icon: <CheckCircleOutlined />,
    label: "Completed",
  },
  cancelled: {
    bg: "bg-red-50",
    text: "text-red-500",
    border: "border-red-200",
    dot: "bg-red-500",
    icon: <CloseCircleOutlined />,
    label: "Cancelled",
  },
};

export default function DoctorAppointments() {
  const { doctorId } = useParams();
  const navigate = useNavigate();
  const { session } = useContext(Context);
  const [messageApi, contextHolder] = message.useMessage();

  const [doctor, setDoctor] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [searchText, setSearchText] = useState("");

  /* ─── Fetch doctor info ─── */
  useEffect(() => {
    if (!session?.hospitalId) return;
    const fetchDoctor = async () => {
      try {
        const { data } = await API.get(`/doctor/${session.hospitalId}`);
        const doc = (data.doctors || []).find((d) => d._id === doctorId);
        if (doc) setDoctor(doc);
      } catch {
        /* silent */
      }
    };
    fetchDoctor();
  }, [session?.hospitalId, doctorId]);

  /* ─── Fetch appointments ─── */
  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const params = activeTab !== "all" ? `?status=${activeTab}` : "";
      const { data } = await API.get(`/appointment/doctor/${doctorId}${params}`);
      setAppointments(data.appointments || []);
    } catch {
      setAppointments([]);
      messageApi.error("Failed to load appointments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (doctorId) fetchAppointments();
  }, [doctorId, activeTab]);

  /* ─── Stats ─── */
  const stats = useMemo(() => {
    // When tab is "all" we have all appointments, compute counts
    // When tab is specific, we only have that subset — so we need a separate all-fetch for counts
    // For simplicity, always show counts from current dataset
    const all = appointments.length;
    const booked = activeTab === "all" ? appointments.filter((a) => a.status === "booked").length : activeTab === "booked" ? all : 0;
    const completed = activeTab === "all" ? appointments.filter((a) => a.status === "completed").length : activeTab === "completed" ? all : 0;
    const cancelled = activeTab === "all" ? appointments.filter((a) => a.status === "cancelled").length : activeTab === "cancelled" ? all : 0;
    return { all: activeTab === "all" ? all : "—", booked, completed, cancelled };
  }, [appointments, activeTab]);

  /* ─── Search filter ─── */
  const filtered = useMemo(() => {
    if (!searchText.trim()) return appointments;
    const q = searchText.toLowerCase();
    return appointments.filter(
      (a) =>
        a.patientId?.name?.toLowerCase().includes(q) ||
        a.patientId?.email?.toLowerCase().includes(q) ||
        a.departmentId?.name?.toLowerCase().includes(q) ||
        a.date?.includes(q) ||
        a.slotTime?.toLowerCase().includes(q)
    );
  }, [appointments, searchText]);

  /* ─── Actions ─── */
  const [completeModalVisible, setCompleteModalVisible] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [remarks, setRemarks] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  const handleComplete = async () => {
    if (!selectedAppointment) return;
    try {
      setActionLoading(true);
      await API.patch(`/appointment/${selectedAppointment._id}/complete`, { remarks });
      messageApi.success("Appointment marked as completed");
      setCompleteModalVisible(false);
      setRemarks("");
      fetchAppointments();
    } catch (err) {
      messageApi.error(err?.response?.data?.message || "Failed to complete");
    } finally {
      setActionLoading(false);
    }
  };

  const handleCancel = async (id) => {
    try {
      await API.patch(`/appointment/${id}/cancel`);
      messageApi.success("Appointment cancelled");
      fetchAppointments();
    } catch (err) {
      messageApi.error(err?.response?.data?.message || "Failed to cancel");
    }
  };

  const confirmAction = (type, appt, patientName) => {
    if (type === "complete") {
      setSelectedAppointment(appt);
      setCompleteModalVisible(true);
    } else {
      Modal.confirm({
        title: "Cancel Appointment",
        icon: <ExclamationCircleOutlined style={{ color: "#ef4444" }} />,
        content: `Are you sure you want to cancel the appointment for ${patientName || "this patient"}?`,
        okText: "Yes, Cancel",
        okButtonProps: { className: "bg-red-500 hover:bg-red-600 border-none" },
        cancelText: "Go Back",
        onOk: () => handleCancel(appt._id),
      });
    }
  };

  /* ─── Doctor initials ─── */
  const doctorInitials = doctor
    ? doctor.name
        .split(" ")
        .map((w) => w[0])
        .join("")
        .substring(0, 2)
        .toUpperCase()
    : "DR";

  return (
    <AdminLayout
      title={doctor ? `Dr. ${doctor.name}` : "Doctor Appointments"}
      subtitle="View & manage all appointments"
    >
      {contextHolder}

      <Modal
        title={<div className="flex items-center gap-2 text-green-600"><CheckCircleOutlined /> Complete Appointment</div>}
        open={completeModalVisible}
        onCancel={() => { setCompleteModalVisible(false); setRemarks(""); }}
        footer={[
          <Button key="cancel" onClick={() => { setCompleteModalVisible(false); setRemarks(""); }}>
            Cancel
          </Button>,
          <Button
            key="submit"
            type="primary"
            loading={actionLoading}
            onClick={handleComplete}
            className="bg-green-500 hover:bg-green-600 border-none"
          >
            Complete Appointment
          </Button>
        ]}
      >
        <div className="py-4">
          <p className="text-sm text-gray-500 mb-4">
            Are you sure you want to mark the appointment for <span className="font-bold text-gray-800">{selectedAppointment?.patientId?.name}</span> as completed?
          </p>
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Completion Remarks (Optional)</label>
            <TextArea
              rows={4}
              placeholder="Add any medical notes or remarks here..."
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              className="rounded-xl border-slate-200 focus:border-green-400 focus:ring-green-100"
            />
          </div>
        </div>
      </Modal>
      <div className="space-y-6">
        {/* ── Back button + Doctor header ── */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <button
            onClick={() => navigate("/admin/doctors")}
            className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-800 font-medium transition group w-fit"
          >
            <span className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center shadow-sm group-hover:shadow transition">
              <ArrowLeftOutlined className="text-xs" />
            </span>
            Back to Doctors
          </button>

          {doctor && (
            <div className="flex items-center gap-4 ml-0 sm:ml-auto bg-white rounded-2xl px-5 py-4 shadow-sm border border-pink-50">
              <Avatar
                size={52}
                style={{
                  background: "linear-gradient(135deg,#ef4444,#ec4899)",
                  fontWeight: 700,
                  fontSize: 18,
                }}
              >
                {doctorInitials}
              </Avatar>
              <div>
                <h3 className="text-base font-bold text-gray-800">
                  {doctor.name}
                </h3>
                <div className="flex items-center gap-3 mt-0.5 flex-wrap">
                  <span className="text-xs text-gray-500">
                    {doctor.specialization}
                  </span>
                  <span className="text-xs bg-pink-50 text-pink-600 px-2 py-0.5 rounded-full font-semibold flex items-center gap-1">
                    <MedicineBoxOutlined /> {doctor.departmentId?.name || "—"}
                  </span>
                  <span className="text-xs text-gray-400">
                    {doctor.experience} yrs exp
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ── Status Tab Cards ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {STATUS_TABS.map((tab) => {
            const count =
              tab.key === "all"
                ? stats.all
                : tab.key === "booked"
                ? stats.booked
                : tab.key === "completed"
                ? stats.completed
                : stats.cancelled;

            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`relative rounded-2xl p-5 shadow-sm border overflow-hidden group text-left transition-all duration-200 ${
                  isActive
                    ? "bg-white border-pink-200 shadow-md ring-2 ring-pink-100"
                    : "bg-white border-pink-50 hover:shadow-md hover:border-pink-100"
                }`}
              >
                <div
                  className={`absolute -right-3 -top-3 w-16 h-16 rounded-full bg-gradient-to-br ${tab.gradient} transition ${
                    isActive ? "opacity-20" : "opacity-10 group-hover:opacity-20"
                  }`}
                />
                <div className="flex justify-between items-start relative">
                  <div>
                    <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-1">
                      {tab.label}
                    </p>
                    {loading ? (
                      <Skeleton.Input
                        active
                        size="small"
                        style={{ width: 48, height: 28 }}
                      />
                    ) : (
                      <h3 className="text-2xl font-bold text-gray-800">
                        {count}
                      </h3>
                    )}
                  </div>
                  <div
                    className={`w-10 h-10 rounded-xl bg-gradient-to-br ${tab.gradient} flex items-center justify-center text-white text-lg`}
                  >
                    {tab.icon}
                  </div>
                </div>
                {/* Active indicator bar */}
                {isActive && (
                  <div className="absolute bottom-0 left-4 right-4 h-[3px] rounded-full bg-gradient-to-r from-red-500 to-pink-500" />
                )}
              </button>
            );
          })}
        </div>

        {/* ── Search bar ── */}
        <div className="bg-white rounded-2xl px-5 py-4 shadow-sm border border-pink-50 flex items-center gap-4 flex-wrap">
          <Input
            placeholder="Search by patient name, email, date..."
            prefix={<SearchOutlined className="text-gray-400" />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="rounded-xl bg-gray-50 border-transparent hover:border-pink-200 focus:border-pink-300 max-w-md"
            size="large"
            allowClear
          />
          <span className="text-sm text-gray-400 ml-auto">
            Showing{" "}
            <span className="font-bold text-gray-700">{filtered.length}</span>{" "}
            appointment{filtered.length !== 1 ? "s" : ""}
          </span>
        </div>

        {/* ── Appointment Cards Grid ── */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="bg-white rounded-2xl p-5 shadow-sm border border-pink-50"
              >
                <Skeleton active avatar paragraph={{ rows: 3 }} />
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 shadow-sm border border-pink-50 text-center">
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description={
                <span className="text-gray-400">
                  No {activeTab !== "all" ? activeTab : ""} appointments found
                </span>
              }
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filtered.map((appt) => {
              const cfg = statusBadge[appt.status] || statusBadge.booked;
              const patientName = appt.patientId?.name || "Patient";
              const patientInitials = patientName
                .split(" ")
                .map((w) => w[0])
                .join("")
                .substring(0, 2)
                .toUpperCase();

              return (
                <div
                  key={appt._id}
                  className="bg-white rounded-2xl shadow-sm border border-pink-50 hover:shadow-md hover:border-pink-100 transition-all duration-200 overflow-hidden group"
                >
                  {/* Status accent bar */}
                  <div
                    className={`h-1 w-full ${
                      appt.status === "booked"
                        ? "bg-gradient-to-r from-blue-400 to-indigo-400"
                        : appt.status === "completed"
                        ? "bg-gradient-to-r from-green-400 to-emerald-400"
                        : "bg-gradient-to-r from-red-400 to-pink-400"
                    }`}
                  />

                  <div className="p-5">
                    {/* Header: Patient + Status */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <Avatar
                          size={40}
                          style={{
                            background:
                              "linear-gradient(135deg,#6366f1,#a855f7)",
                            fontWeight: 700,
                            fontSize: 13,
                          }}
                        >
                          {patientInitials}
                        </Avatar>
                        <div>
                          <h4 className="text-sm font-bold text-gray-800 leading-tight">
                            {patientName}
                          </h4>
                          {appt.patientId?.email && (
                            <span className="text-[11px] text-gray-400 flex items-center gap-1 mt-0.5">
                              <MailOutlined /> {appt.patientId.email}
                            </span>
                          )}
                        </div>
                      </div>
                      <span
                        className={`text-[11px] px-2.5 py-1 rounded-full font-semibold flex items-center gap-1 ${cfg.bg} ${cfg.text} border ${cfg.border}`}
                      >
                        {cfg.icon} {cfg.label}
                      </span>
                    </div>

                    {/* Date, Time, Department */}
                    <div className="space-y-2.5 mb-4">
                      <div className="flex items-center gap-2.5 text-sm text-gray-600">
                        <span className="w-7 h-7 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400">
                          <CalendarOutlined />
                        </span>
                        <div>
                          <span className="font-medium">
                            {formatDate(appt.date)}
                          </span>
                          <span className="text-xs text-gray-400 ml-1.5">
                            {formatWeekday(appt.date)}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2.5 text-sm text-gray-600">
                        <span className="w-7 h-7 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400">
                          <ClockCircleOutlined />
                        </span>
                        <span className="font-medium">{appt.slotTime}</span>
                      </div>

                      {appt.departmentId?.name && (
                        <div className="flex items-center gap-2.5 text-sm text-gray-600">
                          <span className="w-7 h-7 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400">
                            <MedicineBoxOutlined />
                          </span>
                          <span className="text-xs bg-pink-50 text-pink-600 px-2 py-0.5 rounded-full font-semibold">
                            {appt.departmentId.name}
                          </span>
                        </div>
                      )}

                      {appt.patientId?.mobileNumber && (
                        <div className="flex items-center gap-2.5 text-sm text-gray-600">
                          <span className="w-7 h-7 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400">
                            <PhoneOutlined />
                          </span>
                          <span className="text-xs text-gray-500">
                            {appt.patientId.mobileNumber}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Actions for booked only */}
                    {appt.status === "booked" && (
                      <div className="flex items-center gap-2 pt-3 border-t border-slate-100">
                        {isSlotPassed(appt.date, appt.slotTime) ? (
                          <button
                            onClick={() =>
                              confirmAction(
                                "complete",
                                appt,
                                patientName
                              )
                            }
                            className="flex-1 px-3 py-2 rounded-xl bg-emerald-50 text-emerald-600 text-xs font-semibold hover:bg-emerald-100 transition flex items-center justify-center gap-1.5"
                          >
                            <CheckCircleOutlined /> Complete
                          </button>
                        ) : (
                          <span className="flex-1 px-3 py-2 rounded-xl bg-slate-50 text-slate-400 text-xs font-medium flex items-center justify-center gap-1.5 cursor-default">
                            <ClockCircleOutlined /> Upcoming
                          </span>
                        )}
                        <button
                          onClick={() =>
                            confirmAction("cancel", appt._id, patientName)
                          }
                          className="flex-1 px-3 py-2 rounded-xl bg-red-50 text-red-500 text-xs font-semibold hover:bg-red-100 transition flex items-center justify-center gap-1.5"
                        >
                          <CloseCircleOutlined /> Cancel
                        </button>
                      </div>
                    )}

                    {/* Completed / Cancelled info */}
                    {appt.status !== "booked" && (
                      <div className="pt-3 border-t border-slate-100">
                        <div className="flex flex-col gap-1">
                          <span className="text-[11px] text-gray-400">
                            {appt.status === "completed"
                              ? "✓ This appointment was completed"
                              : "✕ This appointment was cancelled"}
                          </span>
                          {appt.status === "completed" && appt.remarks && (
                            <div className="bg-slate-50 rounded-lg p-2 border border-slate-100 mt-1">
                              <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">Doctor's Remarks:</p>
                              <p className="text-[11px] text-gray-600 italic">"{appt.remarks}"</p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
