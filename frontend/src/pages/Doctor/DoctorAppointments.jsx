import React, { useState, useEffect, useContext, useMemo } from "react";
import { Avatar, Button, Empty, Input, Skeleton, Table, Tag, message, Modal, Tooltip, Upload } from "antd";
const { TextArea } = Input;
import {
  CalendarOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  SearchOutlined,
  MedicineBoxOutlined,
  UserOutlined,
  FileTextOutlined,
  UploadOutlined,
} from "@ant-design/icons";
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

const statusConfig = {
  booked:    { color: "bg-blue-50 text-blue-600 border-blue-100",   icon: <ClockCircleOutlined />,       tag: "blue", label: "Upcoming" },
  completed: { color: "bg-pink-50 text-pink-600 border-pink-100", icon: <CheckCircleOutlined />,       tag: "green", label: "Completed" },
  cancelled: { color: "bg-red-50 text-red-500 border-red-100",     icon: <CloseCircleOutlined />,       tag: "default", label: "Cancelled" },
};

export default function DoctorAppointments() {
  const { session } = useContext(Context);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [messageApi, contextHolder] = message.useMessage();

  // Filters
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchText, setSearchText] = useState("");

  // Complete Modal State
  const [completeModalVisible, setCompleteModalVisible] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [remarks, setRemarks] = useState("");
  const [reportReview, setReportReview] = useState("");
  const [fileList, setFileList] = useState([]);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchAppointments = async () => {
    if (!session?.id) return;
    try {
      setLoading(true);
      const params = filterStatus !== "all" ? `?status=${filterStatus}` : "";
      const { data } = await API.get(`/appointment/doctor/${session.id}${params}`);
      setAppointments(data.appointments || []);
    } catch {
      setAppointments([]);
      messageApi.error("Failed to load your schedule");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, [session?.id, filterStatus]);

  const handleComplete = async () => {
    if (!selectedAppointment) return;
    try {
      setActionLoading(true);
      const formData = new FormData();
      formData.append("remarks", remarks);
      formData.append("reportReview", reportReview);
      if (fileList.length > 0) {
        formData.append("prescription", fileList[0]);
      }


      await API.patch(`/appointment/${selectedAppointment._id}/complete`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      messageApi.success("Appointment marked as completed");
      setCompleteModalVisible(false);
      setRemarks("");
      setReportReview("");
      setFileList([]);
      fetchAppointments();

    } catch (err) {
      messageApi.error(err?.response?.data?.message || "Failed to complete appointment");
    } finally {
      setActionLoading(false);
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

  const filteredAppointments = useMemo(() => {
    if (!searchText.trim()) return appointments;
    const q = searchText.toLowerCase();
    return appointments.filter(
      (a) =>
        a.patientId?.name?.toLowerCase().includes(q) ||
        a.patientId?.email?.toLowerCase().includes(q) ||
        a.date?.includes(q)
    );
  }, [appointments, searchText]);

  const isTimePassed = (date, slotTime) => {
    if (!date || !slotTime) return false;
    const appointmentDateTime = new Date(`${date}T${slotTime}`);
    return new Date() >= appointmentDateTime;
  };

  const columns = [
    {
      title: "Patient Details",
      key: "patient",
      render: (_, record) => {
        const name = record.patientId?.name || "Patient";
        return (

          <div className="flex items-center gap-3">
            <Avatar size={40} style={{ background: "linear-gradient(135deg,#ef4444,#ec4899)", fontWeight: 700 }}>
              {name.slice(0, 2).toUpperCase()}
            </Avatar>
            <div>
              <span className="text-sm font-bold text-slate-800 block leading-none mb-1">{name}</span>
              <span className="text-[11px] text-slate-400">{record.patientId?.email || record.patientId?.mobileNumber || "No contact"}</span>
            </div>
          </div>
        );
      },
    },
    {
      title: "Date & Time",
      key: "datetime",
      render: (_, record) => (
        <div>
          <span className="text-sm text-slate-700 font-bold block">{formatDate(record.date)}</span>
          <span className="text-xs text-pink-500 font-medium flex items-center gap-1 mt-0.5"><ClockCircleOutlined /> {record.slotTime}</span>
        </div>
      ),
    },
    {
      title: "Status",
      key: "status",
      render: (_, record) => {
        const cfg = statusConfig[record.status] || statusConfig.booked;
        return (
          <div className="flex flex-col gap-1">
            <span className={`text-[10px] px-2.5 py-1 rounded-full font-bold uppercase tracking-wider flex items-center gap-1 w-fit border ${cfg.color}`}>
              {cfg.icon} {cfg.label}
            </span>
            {record.patientReport && (
              <Tag 
                color="processing" 
                className="text-[10px] rounded-full border-none bg-blue-50 text-blue-600 font-bold w-fit cursor-pointer flex items-center gap-1 mt-1 hover:bg-blue-100 transition-colors"
                onClick={() => window.open(`http://localhost:7070/uploads/prescriptions/${record.patientReport}`, "_blank")}
              >
                <FileTextOutlined /> {record.patientReportCategory || "Report"}
              </Tag>
            )}
            {record.prescriptionFile && (
              <Tag 
                color="pink" 
                className="text-[10px] rounded-full border-none bg-pink-50 text-pink-600 font-bold w-fit cursor-pointer flex items-center gap-1 mt-1 hover:bg-pink-100 transition-colors"
                onClick={() => window.open(`http://localhost:7070/uploads/prescriptions/${record.prescriptionFile}`, "_blank")}
              >
                <MedicineBoxOutlined /> Prescription
              </Tag>
            )}
            {record.status === "completed" && record.remarks && (
              <Tooltip title={record.remarks}>
                <span className="text-[10px] text-slate-400 italic truncate max-w-[120px] cursor-help">
                  Note: {record.remarks}
                </span>
              </Tooltip>
            )}
          </div>
        );
      },
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => {
        if (record.status !== "booked") return <span className="text-xs text-slate-300">—</span>;
        const passed = isTimePassed(record.date, record.slotTime);
        return (

          <div className="flex items-center gap-2">
            <Tooltip title={!passed ? `Can only complete after ${record.slotTime}` : ""}>
              <Button 
                type="primary" 
                size="small" 
                icon={<CheckCircleOutlined />}
                onClick={() => confirmAction("complete", record, record.patientId?.name)}
                disabled={!passed}
                className={`${passed ? "bg-pink-500 hover:bg-pink-600" : "bg-slate-200"} border-none rounded-lg text-xs`}
              >
                Complete
              </Button>
            </Tooltip>

            <Button 
              size="small" 
              danger
              icon={<CloseCircleOutlined />}
              onClick={() => confirmAction("cancel", record, record.patientId?.name)}
              className="rounded-lg text-xs"
            >
              Cancel
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <DoctorLayout title="My Appointments" subtitle="Manage your patient consultations">
      {contextHolder}

      <Modal
        title={<div className="flex items-center gap-2 text-pink-600"><CheckCircleOutlined /> Finalize Consultation</div>}
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
            className="bg-pink-500 hover:bg-pink-600 border-none"
          >
            Mark as Completed
          </Button>
        ]}
      >
        <div className="py-4">
          <p className="text-sm text-slate-500 mb-4 leading-relaxed">
            Consultation with <span className="font-bold text-slate-800">{selectedAppointment?.patientId?.name}</span> is ending. Add your medical observations or prescriptions below.
          </p>
          <div className="space-y-2">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Medical Remarks / Prescription</label>
            <TextArea
              rows={5}
              placeholder="E.g. Take Paracetamol 500mg twice daily. Bed rest recommended for 2 days."
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              className="rounded-2xl border-slate-200 focus:border-pink-400 focus:ring-pink-100"
            />
          </div>

          {selectedAppointment?.patientReport && (
            <div className="mt-6 space-y-2">
              <label className="text-xs font-black text-blue-400 uppercase tracking-widest">Doctor's Review on Patient Report</label>
              <TextArea
                rows={3}
                placeholder="E.g. The blood sugar levels are slightly elevated but manageable."
                value={reportReview}
                onChange={(e) => setReportReview(e.target.value)}
                className="rounded-2xl border-slate-200 focus:border-blue-400 focus:ring-blue-100"
              />
            </div>
          )}


          <div className="mt-6 space-y-2">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest block">Attachment (Prescription / Lab Report)</label>
            <Upload
              onRemove={() => setFileList([])}
              beforeUpload={(file) => {
                setFileList([file]);
                return false;
              }}
              fileList={fileList}
              maxCount={1}
              className="w-full"
            >
              <Button icon={<UploadOutlined />} className="w-full h-12 rounded-xl border-dashed border-slate-300 hover:border-pink-400 hover:text-pink-600 transition-all">
                Select Document (PDF, Image)
              </Button>
            </Upload>
            <p className="text-[10px] text-slate-400 italic mt-1 px-1">Max size: 5MB. Supported: PDF, JPG, PNG</p>
          </div>
        </div>
      </Modal>

      <div className="space-y-6">
        
        {/* Header Actions */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-3xl border border-slate-100 shadow-sm">
           <div className="flex items-center gap-2">
              {["all", "booked", "completed", "cancelled"].map(s => (
                <button
                  key={s}
                  onClick={() => setFilterStatus(s)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    filterStatus === s 
                    ? "bg-pink-600 text-white shadow-md shadow-pink-100" 
                    : "bg-slate-50 text-slate-500 hover:bg-slate-100"
                  }`}
                >
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </button>
              ))}
           </div>
           <Input
             placeholder="Search patient..."
             prefix={<SearchOutlined className="text-slate-400" />}
             value={searchText}
             onChange={(e) => setSearchText(e.target.value)}
             className="rounded-xl bg-slate-50 border-transparent hover:border-pink-200 focus:border-pink-300 max-w-xs"
           />
        </div>

        {/* Table Container */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
           <Table
             columns={columns}
             dataSource={filteredAppointments}
             rowKey="_id"
             loading={loading}
             pagination={{ pageSize: 8, showSizeChanger: false }}
             className="caresync-table"
           />
        </div>

      </div>
    </DoctorLayout>
  );
}
