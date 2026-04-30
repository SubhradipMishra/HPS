import React from "react";
import { Activity, Users, Calendar, BarChart3, ArrowUpRight } from "lucide-react";

const DashboardPreview = () => {
  return (
    <section id="dashboard" className="relative px-8 md:px-16 py-32 bg-white overflow-hidden border-b border-slate-100">
      <div className="relative z-10 container mx-auto">
        {/* Heading */}
        <div className="flex flex-col md:flex-row justify-between items-end gap-10 mb-24">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-3 px-4 py-2 bg-slate-900 rounded-full text-[10px] font-black uppercase tracking-[0.3em] text-white mb-6">
              <Activity size={12} className="text-sky-400" />
              Live Monitoring
            </div>
            <h2 className="text-5xl md:text-8xl font-black tracking-tight text-slate-900 leading-[0.9] uppercase">
              Clinical <br />
              <span className="text-sky-500">Analytics</span>.
            </h2>
          </div>
          <p className="text-slate-500 text-lg font-bold max-w-sm mb-2">
            Real-time orchestration of clinical nodes and patient throughput analytics.
          </p>
        </div>

        {/* Dashboard Mock UI */}
        <div className="relative max-w-6xl mx-auto">
          <div className="relative bg-slate-900/90 backdrop-blur-3xl p-2 border border-white/5 shadow-2xl overflow-hidden group rounded-[3rem]">

            <div className="grid md:grid-cols-12 gap-2">

              {/* Stats Sidebar */}
              <div className="md:col-span-3 grid grid-cols-1 gap-2">
                {[
                  { label: "Active Nodes", val: "12,482", icon: Users, color: "text-sky-400" },
                  { label: "Daily Sync", val: "248", icon: Calendar, color: "text-indigo-400" },
                  { label: "System Load", val: "18%", icon: Activity, color: "text-emerald-400" },
                  { label: "Uptime", val: "99.9%", icon: BarChart3, color: "text-amber-400" }
                ].map((stat, i) => (
                  <div key={i} className="bg-white/5 backdrop-blur-xl p-8 flex flex-col justify-between aspect-square md:aspect-auto rounded-[2rem] border border-white/5">
                    <stat.icon size={20} className={stat.color} />
                    <div>
                      <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">{stat.label}</p>
                      <p className="text-2xl font-black text-white">{stat.val}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Main Viewport */}
              <div className="md:col-span-6 bg-white/5 backdrop-blur-xl p-10 border border-white/5 rounded-[2.5rem]">
                <div className="flex justify-between items-center mb-12">
                  <h4 className="text-[10px] font-black text-white uppercase tracking-[0.2em]">Live Consultation Stream</h4>
                  <div className="flex items-center gap-2">
                    <span className="text-[8px] font-black text-emerald-400 uppercase tracking-widest">System Live</span>
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                  </div>
                </div>

                <div className="space-y-2">
                  {[
                    { name: "S. Mishra", task: "Cardiac Sync", time: "10:30 AM", status: "Active" },
                    { name: "P. Verma", task: "Dental Scan", time: "11:15 AM", status: "Queued" },
                    { name: "A. Singh", task: "Neuro Eval", time: "11:45 AM", status: "Queued" },
                    { name: "K. Gupta", task: "General Check", time: "12:30 PM", status: "Idle" }
                  ].map((p, i) => (
                    <div key={i} className="flex items-center justify-between p-6 bg-white/5 border border-white/5 hover:bg-white/10 transition-colors rounded-2xl">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-sky-500/10 rounded-xl flex items-center justify-center text-sky-400 font-black text-xs">{p.name[0]}</div>
                        <div>
                          <p className="text-xs font-black text-white leading-none mb-1">{p.name}</p>
                          <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{p.task}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] font-black text-white mb-2">{p.time}</p>
                        <span className="text-[7px] font-black uppercase tracking-widest text-white/40 border border-white/10 px-3 py-1 rounded-full">{p.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Performance & CTA */}
              <div className="md:col-span-3 grid grid-cols-1 gap-2">
                <div className="bg-sky-500/90 backdrop-blur-xl p-8 flex flex-col justify-between rounded-[2rem]">
                  <h4 className="text-xl font-black text-white leading-tight uppercase">Optimize <br /> Network.</h4>
                  <button className="bg-slate-900 text-white text-[9px] font-black uppercase tracking-widest py-5 rounded-2xl w-full mt-8 hover:bg-white hover:text-slate-900 transition-all shadow-xl">Launch Sync</button>
                </div>

                <div className="bg-white/5 backdrop-blur-xl p-8 rounded-[2rem] border border-white/5">
                  <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-6">Core Status</p>
                  <div className="space-y-5">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="h-1 bg-white/5 rounded-full relative overflow-hidden">
                        <div className="absolute inset-y-0 left-0 bg-sky-500 w-[70%] animate-pulse rounded-full" />
                      </div>
                    ))}
                  </div>
                  <p className="text-[8px] font-bold text-slate-600 mt-8 leading-tight">All clinical nodes are operating within nominal parameters.</p>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DashboardPreview;




