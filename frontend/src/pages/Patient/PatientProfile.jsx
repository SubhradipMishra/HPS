import React, { useState, useEffect, useContext } from "react";
import { Avatar, Button, Card, Descriptions, Empty, Input, Modal, Select, Tag, message, Upload } from "antd";
import { 
  UserOutlined, 
  MailOutlined, 
  PhoneOutlined, 
  CalendarOutlined, 
  SafetyCertificateOutlined, 
  CloudUploadOutlined, 
  FileTextOutlined, 
  DeleteOutlined, 
  EyeOutlined,
  ManOutlined,
  WomanOutlined,
  PlusOutlined
} from "@ant-design/icons";
import PatientLayout from "../../components/PatientLayout";
import Context from "../../util/context";
import API from "../../api/api";

export default function PatientProfile() {
  const { session } = useContext(Context);
  const [patientData, setPatientData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploadModalVisible, setUploadModalVisible] = useState(false);
  const [category, setCategory] = useState("Lab Report");
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const fetchPatientData = async () => {
    if (!session?.id) return;
    try {
      setLoading(true);
      const { data } = await API.get(`/patient/${session.id}`);
      setPatientData(data.patient);
    } catch {
      message.error("Failed to load profile data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatientData();
  }, [session?.id]);

  const handleUpload = async () => {
    if (!file) return message.error("Please select a file");
    try {
      setUploading(true);
      const formData = new FormData();
      formData.append("report", file);
      formData.append("category", category);

      await API.post(`/patient/${session.id}/add-report`, formData);
      message.success("Report added to your vault");
      setUploadModalVisible(false);
      setFile(null);
      fetchPatientData();
    } catch (err) {
      message.error("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (reportId) => {
    try {
      await API.delete(`/patient/${session.id}/remove-report/${reportId}`);
      message.success("Report removed from vault");
      fetchPatientData();
    } catch {
      message.error("Failed to remove report");
    }
  };

  return (
    <PatientLayout title="My Identity" subtitle="Manage your personal health data and medical vault">
      <div className="space-y-8 pb-12">
        
        {/* Profile Header Card */}
        <div className="relative overflow-hidden rounded-[32px] border border-slate-200 bg-white p-1 shadow-sm">
           <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-slate-900 to-slate-800 opacity-90" />
           <div className="relative pt-12 pb-8 px-8 flex flex-col md:flex-row items-end gap-6">
              <div className="relative">
                <Avatar 
                  size={120} 
                  icon={<UserOutlined />} 
                  className="border-4 border-white shadow-xl bg-slate-100 text-slate-400"
                  src={patientData?.profileImage}
                />
                <div className="absolute bottom-1 right-1 w-8 h-8 rounded-full bg-sky-500 border-4 border-white flex items-center justify-center">
                   <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
                </div>
              </div>
              <div className="flex-1 mb-2">
                 <h1 className="text-3xl font-black text-slate-900 leading-tight">{patientData?.name}</h1>
                 <div className="flex flex-wrap items-center gap-4 mt-2">
                    <span className="flex items-center gap-1.5 text-xs font-bold text-slate-500 uppercase tracking-widest bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100">
                       <MailOutlined className="text-sky-500" /> {patientData?.email || "No Email"}
                    </span>
                    <span className="flex items-center gap-1.5 text-xs font-bold text-slate-500 uppercase tracking-widest bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100">
                       <PhoneOutlined className="text-sky-500" /> {patientData?.mobileNumber}
                    </span>
                 </div>
              </div>
              <div className="mb-2">
                 <Button type="primary" className="bg-slate-900 border-none h-11 px-6 rounded-2xl font-bold flex items-center gap-2 hover:bg-slate-800 transition">
                    Edit Profile
                 </Button>
              </div>
           </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           {/* Details Section */}
           <div className="lg:col-span-1 space-y-6">
              <Card className="rounded-[28px] border-slate-100 shadow-sm" title={<span className="text-sm font-black uppercase tracking-widest text-slate-400">Biological Details</span>}>
                 <Descriptions column={1} labelStyle={{ color: "#94a3b8", fontWeight: 800, fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.1em" }} contentStyle={{ color: "#1e293b", fontWeight: 700, fontSize: "14px" }}>
                    <Descriptions.Item label="Gender">
                       <span className="flex items-center gap-2">
                          {patientData?.gender === "male" ? <ManOutlined className="text-sky-500" /> : <WomanOutlined className="text-sky-400" />}
                          <span className="capitalize">{patientData?.gender || "Unknown"}</span>
                       </span>
                    </Descriptions.Item>
                    <Descriptions.Item label="Birth Date">
                       {patientData?.dob ? new Date(patientData.dob).toLocaleDateString("en-US", { day: "numeric", month: "long", year: "numeric" }) : "-"}
                    </Descriptions.Item>
                    <Descriptions.Item label="Account Type">
                       <Tag className="rounded-full px-3 py-0.5 border-none bg-sky-50 text-sky-600 font-bold uppercase text-[10px] tracking-widest">
                          {patientData?.createdBy === "self" ? "Verified User" : "Institutional Record"}
                       </Tag>
                    </Descriptions.Item>
                    <Descriptions.Item label="Status">
                       <Tag className="rounded-full px-3 py-0.5 border-none bg-emerald-50 text-emerald-600 font-bold uppercase text-[10px] tracking-widest">
                          Active
                       </Tag>
                    </Descriptions.Item>
                 </Descriptions>
              </Card>

              <div className="p-6 rounded-[28px] bg-slate-900 text-white relative overflow-hidden shadow-lg shadow-slate-100">
                 <SafetyCertificateOutlined style={{ fontSize: 120 }} className="absolute -right-8 -bottom-8 opacity-10" />
                 <h4 className="text-lg font-black mb-2 relative z-10">CureSync Identity</h4>
                 <p className="text-xs text-slate-300 leading-relaxed mb-6 font-medium relative z-10">
                    Your account is fully verified. We use 256-bit AES encryption to keep your medical data secure and private.
                 </p>
                 <Button className="w-full bg-white/10 border-white/20 text-white font-bold rounded-xl h-10 backdrop-blur hover:bg-white/20 transition">
                    View Security Logs
                 </Button>
              </div>
           </div>


           {/* Vault Section */}
           <div className="lg:col-span-2">
              <div className="bg-white rounded-[32px] border border-slate-200 p-8 shadow-sm h-full min-h-[500px]">
                 <div className="flex items-center justify-between mb-8">
                    <div>
                       <p className="text-[10px] font-black uppercase tracking-[0.15em] text-sky-500 mb-1">CureSync Vault</p>
                       <h3 className="text-2xl font-black text-slate-900">Personal Medical Reports</h3>
                    </div>
                    <Button 
                      type="primary" 
                      icon={<PlusOutlined />} 
                      onClick={() => setUploadModalVisible(true)}
                      className="bg-sky-500 border-none h-11 px-6 rounded-2xl font-bold"
                    >
                      New Upload
                    </Button>
                 </div>

                 {patientData?.reports?.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-slate-100 rounded-[32px]">
                       <div className="w-16 h-16 rounded-3xl bg-slate-50 flex items-center justify-center mb-4">
                          <CloudUploadOutlined className="text-3xl text-slate-200" />
                       </div>
                       <p className="text-sm font-bold text-slate-400">Your medical vault is empty</p>
                       <p className="text-[11px] text-slate-300 mt-1 max-w-[240px] text-center">Upload blood reports, X-rays, or prescriptions for easy access.</p>
                    </div>
                 ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                       {patientData?.reports?.map((report) => (
                          <div key={report._id} className="group relative p-4 rounded-2xl border border-slate-100 bg-slate-50/50 hover:bg-white hover:border-sky-200 hover:shadow-md transition-all duration-300">
                             <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-white border border-slate-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                                   <FileTextOutlined className="text-2xl text-sky-500" />
                                </div>
                                <div className="flex-1 min-w-0">
                                   <p className="text-xs font-black text-slate-800 truncate mb-1 uppercase tracking-tight">{report.category}</p>
                                   <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Uploaded {new Date(report.uploadDate).toLocaleDateString()}</p>
                                </div>
                             </div>
                             <div className="mt-4 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Button 
                                  size="small" 
                                  icon={<EyeOutlined />} 
                                  className="rounded-lg text-[10px] font-bold border-slate-200"
                                  onClick={() => window.open(`http://localhost:7070/uploads/prescriptions/${report.fileName}`, "_blank")}
                                >
                                  View
                                </Button>
                                <Button 
                                  size="small" 
                                  danger 
                                  icon={<DeleteOutlined />} 
                                  className="rounded-lg text-[10px] font-bold"
                                  onClick={() => handleDelete(report._id)}
                                >
                                  Delete
                                </Button>
                             </div>
                          </div>
                       ))}
                    </div>
                 )}
              </div>
           </div>
        </div>
      </div>

      <Modal
        title={<div className="flex items-center gap-2 text-slate-900 font-black"><CloudUploadOutlined className="text-sky-500" /> Secure Vault Upload</div>}
        open={uploadModalVisible}
        onCancel={() => setUploadModalVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setUploadModalVisible(false)} className="rounded-xl font-bold">Cancel</Button>,
          <Button 
            key="submit" 
            type="primary" 
            loading={uploading} 
            onClick={handleUpload}
            className="bg-sky-500 border-none rounded-xl h-10 px-6 font-bold"
          >
            Add to Vault
          </Button>
        ]}
        className="rounded-[32px] overflow-hidden"
      >
        <div className="py-4 space-y-6">
           <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Report Classification</p>
              <Select
                className="w-full h-12"
                value={category}
                onChange={setCategory}
                options={[
                  { label: "Lab Report", value: "Lab Report" },
                  { label: "Prescription", value: "Prescription" },
                  { label: "MRI / X-Ray", value: "MRI/X-Ray" },
                  { label: "Vaccination Record", value: "Vaccination" },
                  { label: "Other", value: "Other" },
                ]}
              />
           </div>

           <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">File Attachment</p>
              <Upload.Dragger
                beforeUpload={(file) => {
                  setFile(file);
                  return false;
                }}
                maxCount={1}
                onRemove={() => setFile(null)}
                className="rounded-2xl border-2 border-dashed border-slate-100 bg-slate-50/50 hover:bg-sky-50/30 hover:border-sky-200 transition-all py-8"
              >
                <p className="ant-upload-drag-icon">
                  <CloudUploadOutlined className="text-sky-400 text-3xl" />
                </p>
                <p className="text-xs font-black text-slate-600 mt-2">Drop medical report here or browse</p>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">PDF, JPG or PNG (MAX 10MB)</p>
              </Upload.Dragger>
           </div>
        </div>
      </Modal>
    </PatientLayout>
  );
}

