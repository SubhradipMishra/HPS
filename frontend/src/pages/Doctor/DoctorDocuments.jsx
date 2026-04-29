import React, { useState, useEffect, useContext, useMemo } from "react";
import { Avatar, Input, Table, Tag, message, Button, Empty, Card, Modal, Rate } from "antd";
import { SearchOutlined, UserOutlined, CalendarOutlined, DownloadOutlined, FileSearchOutlined, SafetyCertificateOutlined, FileDoneOutlined } from "@ant-design/icons";
import DoctorLayout from "../../components/DoctorLayout";
import Context from "../../util/context";
import API from "../../api/api";

export default function DoctorDocuments() {
  const { session } = useContext(Context);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");

  // Review Modal State
  const [reviewModalVisible, setReviewModalVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);

  useEffect(() => {
    if (!session?.id) return;
    const fetchDocuments = async () => {
      try {
        setLoading(true);
        // Get all appointments for the doctor
        const { data } = await API.get(`/appointment/doctor/${session.id}`);
        setAppointments(data.appointments || []);
      } catch {
        message.error("Failed to load documents");
      } finally {
        setLoading(false);
      }
    };
    fetchDocuments();
  }, [session?.id]);

  const documents = useMemo(() => {
    return appointments.filter(a => a.patientReport).map(a => ({
      _id: a._id,
      patientName: a.patientId?.name,
      patientEmail: a.patientId?.email,
      date: a.date,
      category: a.patientReportCategory || "Other",
      file: a.patientReport,
      patientReview: a.review,
      patientRating: a.rating,
      remarks: a.remarks,
    }));
  }, [appointments]);

  const filtered = useMemo(() => {
    if (!searchText.trim()) return documents;
    const q = searchText.toLowerCase();
    return documents.filter(d => 
      d.patientName?.toLowerCase().includes(q) || 
      d.category?.toLowerCase().includes(q)
    );
  }, [documents, searchText]);

  const stats = useMemo(() => {
    const lab = documents.filter(d => d.category === "Lab Report").length;
    const pres = documents.filter(d => d.category === "Prescription").length;
    const other = documents.filter(d => d.category === "Other").length;
    return { lab, pres, other };
  }, [documents]);

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
      title: "Upload Date",
      dataIndex: "date",
      key: "date",
      render: (v) => <span className="text-xs text-slate-500 font-bold flex items-center gap-1"><CalendarOutlined /> {v}</span>
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
      render: (v) => (
        <Tag color={v === "Lab Report" ? "blue" : v === "Prescription" ? "green" : "default"} className="rounded-full text-[10px] font-bold border-none px-3">
          {v}
        </Tag>
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
            Review
          </Button>
          <Button 
            type="primary" 
            size="small" 
            icon={<DownloadOutlined />} 
            onClick={() => window.open(`http://localhost:7070/uploads/prescriptions/${record.file}`, "_blank")}
            className="bg-slate-800 hover:bg-slate-900 border-none rounded-lg text-[11px]"
          >
            View Document
          </Button>
        </div>
      )
    }
  ];

  return (
    <DoctorLayout title="Document Vault" subtitle="Review patient medical reports and history">
      <Modal
        title={<div className="flex items-center gap-2 text-slate-800"><FileSearchOutlined className="text-pink-600" /> Patient Consultation Review</div>}
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
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Appointment Date</p>
                  <p className="text-sm font-bold text-slate-700">{selectedRecord.date}</p>
               </div>
            </div>

            <div>
               <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-2">Doctor's Remarks</p>
               <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-sm text-slate-700 leading-relaxed italic">
                 "{selectedRecord.remarks || "No clinical remarks provided for this session."}"
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

            <div className="flex items-center justify-between p-4 border border-blue-100 bg-blue-50/30 rounded-2xl">
               <div>
                 <span className="text-xs font-bold text-blue-700 block">Report Category: {selectedRecord.category}</span>
                 <span className="text-[10px] text-blue-500">Document securely stored in CureSync Vault</span>
               </div>
               <Button 
                 type="link" 
                 icon={<DownloadOutlined />} 
                 onClick={() => window.open(`http://localhost:7070/uploads/prescriptions/${selectedRecord.file}`, "_blank")}
                 className="text-blue-600 font-bold hover:text-blue-700"
               >
                 Open Document
               </Button>
            </div>
          </div>
        )}
      </Modal>

      <div className="space-y-8 py-4">
        
        {/* Banner */}
        <div className="bg-gradient-to-r from-pink-500 to-rose-600 rounded-3xl p-8 text-white relative overflow-hidden shadow-lg shadow-pink-100">
           <div className="relative z-10 max-w-lg">
              <h2 className="text-3xl font-black mb-3">Secure Document Access</h2>
              <p className="text-pink-100 text-sm mb-6 leading-relaxed">
                Review blood reports, MRI scans, and previous medical history uploaded by your patients. All documents are encrypted and HIPAA compliant.
              </p>
              <div className="flex gap-4">
                 <Button className="bg-white text-pink-600 font-bold border-none rounded-xl h-11 px-6 hover:bg-pink-50 transition">
                    Upload New Record
                 </Button>
                 <Button className="bg-pink-400/30 text-white font-bold border-white/30 rounded-xl h-11 px-6 backdrop-blur hover:bg-pink-400/50 transition">
                    Request Documents
                 </Button>
              </div>
           </div>
           <SafetyCertificateOutlined style={{ fontSize: 240 }} className="absolute -right-12 -bottom-12 text-white/10" />
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           <Card className="rounded-3xl border-slate-100 shadow-sm hover:shadow-md transition group">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-500 flex items-center justify-center group-hover:scale-110 transition">
                   <FileSearchOutlined style={{ fontSize: 24 }} />
                </div>
                <div>
                   <h3 className="font-black text-slate-800 text-lg leading-none mb-1">Lab Reports</h3>
                   <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">{stats.lab} RECORDS</p>
                </div>
              </div>
           </Card>

           <Card className="rounded-3xl border-slate-100 shadow-sm hover:shadow-md transition group">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-green-50 text-green-500 flex items-center justify-center group-hover:scale-110 transition">
                   <FileDoneOutlined style={{ fontSize: 24 }} />
                </div>
                <div>
                   <h3 className="font-black text-slate-800 text-lg leading-none mb-1">Prescriptions</h3>
                   <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">{stats.pres} RECORDS</p>
                </div>
              </div>
           </Card>

           <Card className="rounded-3xl border-slate-100 shadow-sm hover:shadow-md transition group">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-slate-50 text-slate-500 flex items-center justify-center group-hover:scale-110 transition">
                   <SafetyCertificateOutlined style={{ fontSize: 24 }} />
                </div>
                <div>
                   <h3 className="font-black text-slate-800 text-lg leading-none mb-1">Other Docs</h3>
                   <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">{stats.other} RECORDS</p>
                </div>
              </div>
           </Card>
        </div>

        {/* Documents Table */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
            <div className="flex justify-between items-center mb-6">
               <h3 className="text-lg font-black text-slate-800">All Patient Documents</h3>
               <Input
                 placeholder="Search by patient or category..."
                 prefix={<SearchOutlined className="text-slate-400" />}
                 value={searchText}
                 onChange={(e) => setSearchText(e.target.value)}
                 className="rounded-xl bg-slate-50 border-transparent hover:border-pink-200 focus:border-pink-300 max-w-xs"
               />
            </div>
            
            {documents.length === 0 && !loading ? (
              <Empty description="No patient documents found yet" />
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
