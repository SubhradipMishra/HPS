import React from "react";
import { Empty, Button, Card } from "antd";
import { ClipboardCheck, FileSearch, ShieldCheck } from "lucide-react";
import DoctorLayout from "../../components/DoctorLayout";

export default function DoctorDocuments() {
  return (
    <DoctorLayout title="Document Vault" subtitle="Review patient medical reports and history">
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
           <ShieldCheck size={240} className="absolute -right-12 -bottom-12 text-white/10" />
        </div>

        {/* Categories */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           <Card className="rounded-3xl border-slate-100 shadow-sm hover:shadow-md transition group">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-500 flex items-center justify-center mb-4 group-hover:scale-110 transition">
                 <FileSearch size={24} />
              </div>
              <h3 className="font-black text-slate-800 text-lg mb-1">Lab Reports</h3>
              <p className="text-xs text-slate-400 font-medium mb-4">Pathology and radiology results</p>
              <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="No active reports" />
           </Card>

           <Card className="rounded-3xl border-slate-100 shadow-sm hover:shadow-md transition group">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center mb-4 group-hover:scale-110 transition">
                 <ClipboardCheck size={24} />
              </div>
              <h3 className="font-black text-slate-800 text-lg mb-1">Checkup History</h3>
              <p className="text-xs text-slate-400 font-medium mb-4">Physical examination records</p>
              <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="No history found" />
           </Card>

           <Card className="rounded-3xl border-slate-100 shadow-sm hover:shadow-md transition group">
              <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-500 flex items-center justify-center mb-4 group-hover:scale-110 transition">
                 <ShieldCheck size={24} />
              </div>
              <h3 className="font-black text-slate-800 text-lg mb-1">Insurance & IDs</h3>
              <p className="text-xs text-slate-400 font-medium mb-4">Identification and coverage docs</p>
              <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="No documents" />
           </Card>
        </div>

      </div>
    </DoctorLayout>
  );
}
