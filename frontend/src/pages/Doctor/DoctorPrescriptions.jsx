import React, { useState, useEffect, useContext, useMemo } from "react";
import { Avatar, Input, Table, Tag, message, Button, Empty } from "antd";
import { SearchOutlined, FileTextOutlined, UserOutlined, CalendarOutlined, DownloadOutlined } from "@ant-design/icons";
import DoctorLayout from "../../components/DoctorLayout";
import Context from "../../util/context";
import API from "../../api/api";

export default function DoctorPrescriptions() {
  const { session } = useContext(Context);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    if (!session?.id) return;
    const fetchPrescriptions = async () => {
      try {
        setLoading(true);
        const { data } = await API.get(`/appointment/doctor/${session.id}?status=completed`);
        setAppointments(data.appointments || []);
      } catch {
        message.error("Failed to load prescriptions");
      } finally {
        setLoading(false);
      }
    };
    fetchPrescriptions();
  }, [session?.id]);

  const prescriptions = useMemo(() => {
    return appointments.filter(a => a.remarks).map(a => ({
      _id: a._id,
      patientName: a.patientId?.name,
      patientEmail: a.patientId?.email,
      date: a.date,
      prescription: a.remarks,
    }));
  }, [appointments]);

  const filtered = useMemo(() => {
    if (!searchText.trim()) return prescriptions;
    const q = searchText.toLowerCase();
    return prescriptions.filter(p => 
      p.patientName?.toLowerCase().includes(q) || 
      p.prescription?.toLowerCase().includes(q)
    );
  }, [prescriptions, searchText]);

  const columns = [
    {
      title: "Patient",
      key: "patient",
      render: (_, record) => (
        <div className="flex items-center gap-3">
          <Avatar size={36} style={{ background: "linear-gradient(135deg,#ef4444,#ec4899)", fontWeight: 700 }}>
            {record.patientName?.slice(0, 2).toUpperCase()}
          </Avatar>
          <div>
             <p className="text-sm font-bold text-slate-800 leading-none mb-1">{record.patientName}</p>
             <p className="text-[10px] text-slate-400 font-medium">{record.patientEmail}</p>
          </div>
        </div>
      )
    },
    {
      title: "Issue Date",
      dataIndex: "date",
      key: "date",
      render: (v) => <span className="text-xs text-slate-500 font-bold flex items-center gap-1"><CalendarOutlined /> {v}</span>
    },
    {
      title: "Prescription Summary",
      dataIndex: "prescription",
      key: "prescription",
      render: (v) => <p className="text-xs text-slate-600 line-clamp-1 max-w-xs">{v}</p>
    },
    {
      title: "Actions",
      key: "actions",
      render: () => (
        <Button 
          type="primary" 
          size="small" 
          icon={<DownloadOutlined />} 
          className="bg-pink-500 hover:bg-pink-600 border-none rounded-lg text-[11px]"
        >
          Download PDF
        </Button>
      )
    }
  ];

  return (
    <DoctorLayout title="Review Prescriptions" subtitle="Manage and issue medical prescriptions">
      <div className="space-y-6">
        <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm flex justify-between items-center">
           <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-2xl bg-pink-50 text-pink-600 flex items-center justify-center text-lg">
               <FileTextOutlined />
             </div>
             <div>
               <p className="text-sm font-black text-slate-800 leading-none mb-1">Prescription Hub</p>
               <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{prescriptions.length} Records Found</p>
             </div>
           </div>
           <Input
             placeholder="Search by patient or medication..."
             prefix={<SearchOutlined className="text-slate-400" />}
             value={searchText}
             onChange={(e) => setSearchText(e.target.value)}
             className="rounded-xl bg-slate-50 border-transparent hover:border-pink-200 focus:border-pink-300 max-w-xs"
           />
        </div>

        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
           {prescriptions.length === 0 && !loading ? (
             <Empty description="No prescriptions found" />
           ) : (
             <Table
               columns={columns}
               dataSource={filtered}
               rowKey="_id"
               loading={loading}
               className="caresync-table"
             />
           )}
        </div>
      </div>
    </DoctorLayout>
  );
}
