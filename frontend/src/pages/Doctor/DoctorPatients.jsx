import React, { useState, useEffect, useContext, useMemo } from "react";
import { Avatar, Input, Table, Tag, message, Button } from "antd";
import { SearchOutlined, UserOutlined, PhoneOutlined, MailOutlined, CalendarOutlined, ArrowRightOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import DoctorLayout from "../../components/DoctorLayout";
import Context from "../../util/context";
import API from "../../api/api";

export default function DoctorPatients() {
  const { session } = useContext(Context);
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    if (!session?.id) return;
    const fetchHistory = async () => {
      try {
        setLoading(true);
        const { data } = await API.get(`/appointment/doctor/${session.id}`);
        setAppointments(data.appointments || []);
      } catch {
        message.error("Failed to load patient list");
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, [session?.id]);

  const patients = useMemo(() => {
    const map = new Map();
    appointments.forEach(appt => {
      const p = appt.patientId;
      if (p && !map.has(p._id)) {
        map.set(p._id, {
          ...p,
          lastVisit: appt.date,
          totalVisits: 1,
        });
      } else if (p) {
        const existing = map.get(p._id);
        existing.totalVisits += 1;
        if (appt.date > existing.lastVisit) existing.lastVisit = appt.date;
      }
    });
    return Array.from(map.values());
  }, [appointments]);

  const filtered = useMemo(() => {
    if (!searchText.trim()) return patients;
    const q = searchText.toLowerCase();
    return patients.filter(p => 
      p.name?.toLowerCase().includes(q) || 
      p.email?.toLowerCase().includes(q) || 
      p.mobileNumber?.includes(q)
    );
  }, [patients, searchText]);

  const columns = [
    {
      title: "Patient Name",
      key: "name",
      render: (_, record) => (
        <div className="flex items-center gap-3">
          <Avatar size={36} style={{ background: "linear-gradient(135deg,#ef4444,#ec4899)", fontWeight: 700 }}>
            {record.name?.slice(0, 2).toUpperCase()}
          </Avatar>
          <span className="text-sm font-bold text-slate-800">{record.name}</span>
        </div>
      )
    },
    {
      title: "Contact Information",
      key: "contact",
      render: (_, record) => (
        <div className="space-y-1">
          <p className="text-xs text-slate-500 flex items-center gap-1.5"><MailOutlined className="text-[10px]" /> {record.email || "N/A"}</p>
          <p className="text-xs text-slate-500 flex items-center gap-1.5"><PhoneOutlined className="text-[10px]" /> {record.mobileNumber || "N/A"}</p>
        </div>
      )
    },
    {
      title: "Last Visit",
      dataIndex: "lastVisit",
      key: "lastVisit",
      render: (v) => <Tag color="pink" icon={<CalendarOutlined />}>{v}</Tag>
    },
    {
      title: "Visits",
      dataIndex: "totalVisits",
      key: "totalVisits",
      render: (v) => <span className="text-sm font-black text-slate-700">{v}</span>
    },
    {
      title: "Actions",
      key: "actions",
      render: () => (
        <Button 
          type="text" 
          icon={<ArrowRightOutlined />} 
          className="text-pink-600 font-bold hover:bg-pink-50"
          onClick={() => navigate("/doctor/appointments")}
        >
          View History
        </Button>
      )
    }
  ];

  return (
    <DoctorLayout title="My Patients" subtitle="List of patients you have treated">
      <div className="space-y-6">
        <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm flex justify-between items-center">
           <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-2xl bg-pink-50 text-pink-600 flex items-center justify-center text-lg">
               <UserOutlined />
             </div>
             <div>
               <p className="text-sm font-black text-slate-800 leading-none mb-1">Patient Directory</p>
               <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{patients.length} Total Patients</p>
             </div>
           </div>
           <Input
             placeholder="Search by name, email..."
             prefix={<SearchOutlined className="text-slate-400" />}
             value={searchText}
             onChange={(e) => setSearchText(e.target.value)}
             className="rounded-xl bg-slate-50 border-transparent hover:border-pink-200 focus:border-pink-300 max-w-xs"
           />
        </div>

        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
           <Table
             columns={columns}
             dataSource={filtered}
             rowKey="_id"
             loading={loading}
             className="caresync-table"
           />
        </div>
      </div>
    </DoctorLayout>
  );
}
