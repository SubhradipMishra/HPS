import React, { useContext, useEffect, useMemo, useState } from "react";
import { Button, Empty, Skeleton, Tag, Progress } from "antd";
import { 
  Activity, 
  ArrowRight, 
  CalendarClock, 
  ClipboardPlus, 
  HeartPulse, 
  ShieldCheck, 
  Stethoscope, 
  Hospital, 
  Clock3, 
  TrendingUp,
  FileText
} from "lucide-react";
import { Link } from "react-router-dom";
import PatientLayout from "../../components/PatientLayout";
import Context from "../../util/context";
import API from "../../api/api";

function formatDate(dateString, options = {}) {
  if (!dateString) return "";
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    ...options,
  }).format(new Date(dateString));
}

export default function PatientDashboard() {
  const { session } = useContext(Context);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!session?.id) return;

    const load = async () => {
      try {
        setLoading(true);
        const { data } = await API.get(`/appointment/patient/${session.id}`);
        setAppointments(data.appointments || []);
      } catch {
        setAppointments([]);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [session?.id]);

  const stats = useMemo(() => {
    const upcoming = appointments.filter((appointment) => appointment.status === "booked").length;
    const completed = appointments.filter((appointment) => appointment.status === "completed").length;
    const cancelled = appointments.filter((appointment) => appointment.status === "cancelled").length;

    return [
      { label: "Active Visits", value: upcoming, detail: "Confirmed slots", icon: CalendarClock, color: "sky" },
      { label: "Checkups", value: completed, detail: "Total consultations", icon: ShieldCheck, color: "emerald" },
      { label: "Engagement", value: appointments.length, detail: `${cancelled} cancelled`, icon: TrendingUp, color: "amber" },
    ];
  }, [appointments]);

  const nextAppointment = appointments.find((appointment) => appointment.status === "booked");

  return (
    <PatientLayout title="Overview" subtitle="Monitor your healthcare activity and upcoming visits">
      <div className="space-y-8 pb-12">
        {/* Modern Hero Section */}
        <section className="grid gap-6 xl:grid-cols-[1.3fr,0.7fr]">
          <div className="relative overflow-hidden rounded-[40px] border border-slate-200 bg-white p-10 shadow-sm group">
            <div className="absolute -right-20 -top-20 w-80 h-80 bg-sky-50 rounded-full blur-3xl group-hover:bg-sky-100 transition-colors duration-500" />
            
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-1.5 text-[10px] font-black uppercase tracking-widest text-white">
                <HeartPulse size={12} className="animate-pulse" />
                Medical Command Center
              </div>
              <h1 className="mt-8 max-w-2xl text-5xl font-black tracking-tight text-slate-900 leading-[1.1]">
                Your health, <span className="text-sky-500 italic">orchestrated</span> with precision.
              </h1>
              <p className="mt-6 max-w-xl text-base leading-relaxed text-slate-500 font-medium">
                Welcome back, {session?.name?.split(" ")[0]}. Access your clinical vault, monitor upcoming slots, and manage your medical journey from one unified workspace.
              </p>
              <div className="mt-10 flex flex-wrap gap-4">
                <Link to="/patient/appointments">
                  <Button type="primary" className="bg-slate-900 border-none h-14 px-8 rounded-2xl font-bold text-base hover:scale-105 transition-transform">
                    Start Booking
                  </Button>
                </Link>
                <Link to="/patient/profile">
                  <Button className="border-slate-200 text-slate-700 h-14 px-8 rounded-2xl font-bold text-base hover:bg-slate-50 transition">
                    Access Vault
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-[40px] bg-slate-900 p-8 text-white shadow-xl shadow-slate-200">
             <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-2xl" />
             <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-6 flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-ping" /> Upcoming Visit
             </p>

             {loading ? (
                <div className="space-y-4">
                   <div className="h-8 w-3/4 bg-white/10 rounded-lg animate-pulse" />
                   <div className="h-4 w-1/2 bg-white/5 rounded-lg animate-pulse" />
                   <div className="h-20 w-full bg-white/5 rounded-2xl animate-pulse" />
                </div>
             ) : nextAppointment ? (
                <div className="space-y-6 relative z-10">
                   <div className="inline-flex rounded-2xl bg-sky-500 px-4 py-2 text-xs font-black uppercase tracking-widest text-white shadow-lg shadow-sky-900/40">
                      {formatDate(nextAppointment.date, { weekday: "short", day: "2-digit", month: "short" })}
                   </div>
                   <div>
                      <h3 className="text-3xl font-black leading-tight">Dr. {nextAppointment.doctorId?.name}</h3>
                      <p className="mt-2 text-slate-400 font-bold uppercase tracking-wider text-[11px]">{nextAppointment.departmentId?.name} Specialists</p>
                   </div>
                   <div className="flex items-center justify-between p-5 rounded-[28px] bg-white/5 border border-white/10 backdrop-blur-md">
                      <div>
                         <p className="text-[10px] uppercase font-black tracking-widest text-slate-500">Scheduled Time</p>
                         <p className="mt-1 text-xl font-black flex items-center gap-2"><Clock3 size={18} className="text-sky-400" /> {nextAppointment.slotTime}</p>
                      </div>
                      <div className="w-12 h-12 rounded-2xl bg-sky-500/20 flex items-center justify-center">
                         <CalendarClock size={20} className="text-sky-400" />
                      </div>
                   </div>
                </div>
             ) : (
                <div className="py-10 text-center relative z-10">
                   <div className="w-20 h-20 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-6">
                      <CalendarClock size={32} className="text-slate-600" />
                   </div>
                   <h3 className="text-xl font-black mb-2">No Scheduled Visits</h3>
                   <p className="text-xs text-slate-400 leading-relaxed max-w-[200px] mx-auto font-medium">
                      Your schedule is clear. Use the planner to book your next consultation.
                   </p>
                </div>
             )}
          </div>
        </section>

        {/* Unified Stats Grid */}
        <section className="grid gap-6 md:grid-cols-3">
          {stats.map((stat) => {
            const Icon = stat.icon;
            const colorMap = {
               sky: "bg-sky-50 text-sky-600 border-sky-100",
               emerald: "bg-emerald-50 text-emerald-600 border-emerald-100",
               amber: "bg-amber-50 text-amber-600 border-amber-100"
            };
            return (
              <div key={stat.label} className="group rounded-[32px] border border-slate-200 bg-white p-8 shadow-sm hover:border-slate-300 hover:shadow-md transition-all duration-300">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110 ${colorMap[stat.color]}`}>
                  <Icon size={24} />
                </div>
                <div className="flex items-end justify-between">
                   <div>
                      <p className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400 mb-1">{stat.label}</p>
                      <p className="text-4xl font-black text-slate-900 leading-none">{stat.value}</p>
                   </div>
                   <div className="text-right">
                      <p className="text-[11px] font-bold text-slate-500">{stat.detail}</p>
                   </div>
                </div>
              </div>
            );
          })}
        </section>

        <section className="grid gap-8 xl:grid-cols-[1.3fr,0.7fr]">
          <div className="rounded-[40px] border border-slate-200 bg-white p-8 shadow-sm">
            <div className="mb-10 flex items-center justify-between">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400">Activity Monitor</p>
                <h3 className="mt-1 text-2xl font-black text-slate-900">Recent Medical Activity</h3>
              </div>
              <Link to="/patient/appointments" className="group flex items-center gap-2 text-xs font-black uppercase tracking-widest text-sky-600 hover:text-sky-700 transition">
                Full History
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {loading ? (
              <div className="space-y-4">
                <Skeleton active avatar paragraph={{ rows: 2 }} />
                <Skeleton active avatar paragraph={{ rows: 2 }} />
              </div>
            ) : appointments.length === 0 ? (
              <div className="py-20 text-center">
                 <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={<span className="text-xs font-bold text-slate-400 uppercase tracking-widest">No activity recorded</span>} />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {appointments.slice(0, 4).map((appointment) => (
                  <div key={appointment._id} className="group p-5 rounded-[28px] border border-slate-100 bg-slate-50/50 hover:bg-white hover:border-sky-200 hover:shadow-lg transition-all duration-300">
                    <div className="flex items-start justify-between gap-4 mb-4">
                       <div className="w-10 h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-slate-400 group-hover:text-sky-500 group-hover:scale-110 transition-all">
                          <Stethoscope size={20} />
                       </div>
                       <Tag className={`rounded-full px-3 py-0.5 border-none text-[9px] font-black uppercase tracking-widest ${
                          appointment.status === "completed" ? "bg-emerald-50 text-emerald-600" : 
                          appointment.status === "booked" ? "bg-sky-50 text-sky-600" : 
                          "bg-slate-200 text-slate-500"
                       }`}>
                         {appointment.status}
                       </Tag>
                    </div>
                    <h4 className="text-sm font-black text-slate-800 leading-tight mb-1 group-hover:text-sky-600 transition-colors">Dr. {appointment.doctorId?.name}</h4>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest truncate">{appointment.hospitalId?.name}</p>
                    
                    <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
                       <div className="flex items-center gap-2 text-[10px] font-black text-slate-500">
                          <Clock3 size={12} className="text-sky-500" />
                          <span>{appointment.slotTime}</span>
                       </div>
                       <div className="text-[10px] font-black text-slate-400">
                          {formatDate(appointment.date, { day: "2-digit", month: "short" })}
                       </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-6">
             <div className="rounded-[40px] border border-slate-200 bg-white p-8 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-sky-50 rounded-full -mr-12 -mt-12 opacity-50" />
                <p className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400 mb-6">Quick Shortcuts</p>
                <div className="space-y-3">
                   {[
                      { title: "Health Vault", desc: "Access medical records", icon: FileText, path: "/patient/profile", color: "sky" },
                      { title: "Care Planner", desc: "Schedule consultations", icon: CalendarClock, path: "/patient/appointments", color: "emerald" },
                   ].map((action, idx) => (
                      <Link key={idx} to={action.path} className="flex items-center gap-4 p-4 rounded-2xl border border-slate-100 bg-slate-50/50 hover:bg-white hover:border-sky-200 hover:shadow-md transition-all group">
                         <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 ${action.color === "sky" ? "bg-sky-50 text-sky-600" : "bg-emerald-50 text-emerald-600"}`}>
                            <action.icon size={18} />
                         </div>
                         <div>
                            <p className="text-[11px] font-black text-slate-800 leading-tight">{action.title}</p>
                            <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">{action.desc}</p>
                         </div>
                         <ArrowRight size={14} className="ml-auto text-slate-300 group-hover:text-sky-500 transition-colors" />
                      </Link>
                   ))}
                </div>
             </div>

             <div className="rounded-[40px] bg-gradient-to-br from-sky-600 to-indigo-700 p-8 text-white shadow-lg shadow-sky-100">
                <TrendingUp size={40} className="opacity-20 mb-6" />
                <h4 className="text-xl font-black mb-2">Health Wellness</h4>
                <p className="text-xs text-sky-100 leading-relaxed font-medium mb-6">
                   Your consultation frequency has increased by 15% this month. Keep monitoring your health journey with CureSync.
                </p>
                <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                   <div className="bg-white h-full w-[65%]" />
                </div>
                <p className="text-[9px] font-black uppercase tracking-widest mt-3 text-sky-200">65% Progress to goal</p>
             </div>
          </div>
        </section>
      </div>
    </PatientLayout>
  );
}

