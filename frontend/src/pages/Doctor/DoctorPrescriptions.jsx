import React, { useState, useEffect, useContext, useMemo } from "react";
import { Avatar, Input, Table, Tag, message, Button, Empty, Modal, Rate } from "antd";
import { SearchOutlined, FileTextOutlined, UserOutlined, CalendarOutlined, DownloadOutlined } from "@ant-design/icons";
import DoctorLayout from "../../components/DoctorLayout";
import Context from "../../util/context";
import API from "../../api/api";

export default function DoctorPrescriptions() {
  const { session } = useContext(Context);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");

  // Review Modal State
  const [reviewModalVisible, setReviewModalVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);

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
    return appointments.filter(a => a.prescriptionFile).map(a => ({
      _id: a._id,
      patientName: a.patientId?.name,
      patientEmail: a.patientId?.email,
      date: a.date,
      prescription: a.remarks,
      file: a.prescriptionFile,
      patientReview: a.review,
      patientRating: a.rating,
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
      title: "Notes",
      dataIndex: "prescription",
      key: "prescription",
      render: (v) => <p className="text-xs text-slate-600 line-clamp-1 max-w-xs">{v || "No extra notes"}</p>
    },
    {
      title: "Patient Rating",
      key: "rating",
      render: (_, record) => (
        record.patientRating ? <Rate disabled defaultValue={record.patientRating} className="text-[12px]" /> : <span className="text-[10px] text-slate-300 italic">No review yet</span>
      )
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <div className="flex items-center gap-2">
          <Button 
            size="small" 
            onClick={() => {
              setSelectedRecord(record);
              setReviewModalVisible(true);
            }}
            className="rounded-lg text-[11px] font-bold border-slate-200 text-slate-600 hover:text-pink-600 hover:border-pink-200"
          >
            Review Details
          </Button>
          <Button 
            type="primary" 
            size="small" 
            icon={<DownloadOutlined />} 
            onClick={() => window.open(`http://localhost:7070/uploads/prescriptions/${record.file}`, "_blank")}
            className="bg-pink-500 hover:bg-pink-600 border-none rounded-lg text-[11px]"
          >
            View File
          </Button>
        </div>
      )
    }
  ];

  return (
    <DoctorLayout title="Review Prescriptions" subtitle="Manage and issue medical prescriptions">
      <Modal
        title={<div className="flex items-center gap-2 text-slate-800"><FileTextOutlined className="text-pink-600" /> Prescription Review</div>}
        open={reviewModalVisible}
        onCancel={() => setReviewModalVisible(false)}
        footer={[
          <Button key="close" type="primary" onClick={() => setReviewModalVisible(false)} className="bg-slate-900 border-none">
            Close
          </Button>
        ]}
        width={600}
      >
        {selectedRecord && (
          <div className="py-4 space-y-6">
            <div className="flex justify-between items-start border-b border-slate-100 pb-4">
               <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Patient</p>
                  <p className="text-lg font-black text-slate-800">{selectedRecord.patientName}</p>
                  <p className="text-xs text-slate-500">{selectedRecord.patientEmail}</p>
               </div>
               <div className="text-right">
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Date</p>
                  <p className="text-sm font-bold text-slate-700">{selectedRecord.date}</p>
               </div>
            </div>

            <div>
               <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-2">Medical Notes</p>
               <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-sm text-slate-700 leading-relaxed italic">
                 "{selectedRecord.prescription || "No extra notes provided."}"
               </div>
            </div>

            {selectedRecord.patientReview && (
              <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100">
                 <p className="text-[10px] text-amber-600 font-black uppercase tracking-widest mb-2 flex items-center gap-2">
                    Patient Feedback <Rate disabled defaultValue={selectedRecord.patientRating} className="text-[10px]" />
                 </p>
                 <p className="text-sm text-amber-800 leading-relaxed italic">
                    "{selectedRecord.patientReview}"
                 </p>
              </div>
            )}

            <div className="flex items-center justify-between p-4 border border-pink-100 bg-pink-50/30 rounded-2xl">
               <span className="text-xs font-bold text-pink-700">Digital Prescription File Attached</span>
               <Button 
                 type="link" 
                 icon={<DownloadOutlined />} 
                 onClick={() => window.open(`http://localhost:7070/uploads/prescriptions/${selectedRecord.file}`, "_blank")}
                 className="text-pink-600 font-bold hover:text-pink-700"
               >
                 View Document
               </Button>
            </div>
          </div>
        )}
      </Modal>

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
