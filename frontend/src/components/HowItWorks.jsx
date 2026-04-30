import React from "react";
import { UserPlus, CalendarDays, FileCheck, ShieldCheck, ArrowRight, Activity } from "lucide-react";

const HowItWorks = () => {
  const steps = [
    {
      title: "Identity Establishment",
      desc: "Connect your global health ID through our high-speed biometric-grade authentication layer.",
      icon: UserPlus,
      tag: "Step 01"
    },
    {
      title: "Resource Scheduling",
      desc: "Our AI-driven orchestration engine syncs your needs with the nearest available specialist nodes.",
      icon: CalendarDays,
      tag: "Step 02"
    },
    {
      title: "Vault Initialization",
      desc: "Initialize your private medical vault, encrypted with enterprise-level security protocols.",
      icon: ShieldCheck,
      tag: "Step 03"
    },
    {
      title: "Continuous Monitoring",
      desc: "Stay connected through real-time health streams and automated diagnostic feedback loops.",
      icon: Activity,
      tag: "Step 04"
    }
  ];

  return (
    <section id="how-it-works" className="relative px-8 md:px-16 py-32 bg-white overflow-hidden border-b border-slate-100">
      {/* Background Decorative Element */}
      <div className="absolute top-1/2 left-0 w-full h-[1px] bg-slate-100 hidden lg:block" />

      <div className="relative z-10 container mx-auto">
        {/* Heading Area */}
        <div className="flex flex-col items-center text-center mb-32 space-y-8">
          <div className="inline-flex items-center gap-3 px-5 py-2 bg-slate-900 rounded-full text-[10px] font-black uppercase tracking-[0.4em] text-white shadow-xl shadow-slate-200">
            <span className="w-2 h-2 bg-sky-400 rounded-full animate-ping" />
            Operation Pipeline
          </div>
          <h2 className="text-6xl md:text-9xl font-black tracking-tighter text-slate-900 leading-none uppercase">
            The <span className="text-sky-500">Flow</span>.
          </h2>
          <p className="text-slate-400 text-lg font-bold max-w-xl mx-auto leading-relaxed">
            A high-precision orchestration model designed for rapid clinical deployment and seamless patient transitions.
          </p>
        </div>

        {/* Pipeline Steps */}
        <div className="grid lg:grid-cols-4 gap-12 relative">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div key={idx} className="relative group">
                {/* Connector Line (Desktop) */}
                {idx !== steps.length - 1 && (
                  <div className="hidden lg:block absolute top-14 left-full w-full h-[2px] bg-slate-100 z-0 overflow-hidden">
                    <div className="w-full h-full bg-sky-500 -translate-x-full group-hover:translate-x-0 transition-transform duration-700 ease-in-out" />
                  </div>
                )}

                {/* Card Container */}
                <div className="relative z-10 bg-white/30 backdrop-blur-xl p-12 rounded-[3rem] border border-white/50 shadow-sm transition-all duration-500 hover:shadow-2xl hover:shadow-sky-100 hover:-translate-y-4 flex flex-col items-start gap-10">
                  <div className="w-20 h-20 bg-white rounded-[2rem] flex items-center justify-center text-sky-500 group-hover:bg-slate-900 group-hover:text-sky-400 transition-all duration-500 rotate-3 group-hover:rotate-0 shadow-sm">
                    <Icon size={36} strokeWidth={1.5} />
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] font-black text-sky-500 uppercase tracking-widest bg-sky-50 px-3 py-1 rounded-full group-hover:bg-sky-500 group-hover:text-white transition-colors">
                        {step.tag}
                      </span>
                      <div className="h-[1px] w-8 bg-slate-100 group-hover:w-16 transition-all duration-500" />
                    </div>
                    <h3 className="text-xl font-black text-slate-900 uppercase tracking-tighter leading-tight">
                      {step.title}
                    </h3>
                    <p className="text-sm font-bold text-slate-400 leading-relaxed">
                      {step.desc}
                    </p>
                  </div>

                  {/* Progressive Number Background */}
                  <span className="absolute -bottom-6 -right-6 text-9xl font-black text-slate-50 group-hover:text-sky-50 transition-colors pointer-events-none select-none z-[-1] opacity-50">
                    0{idx + 1}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA for Section */}
        <div className="mt-32 text-center">
          <button className="inline-flex items-center gap-4 text-xs font-black uppercase tracking-[0.3em] text-slate-900 hover:text-sky-500 transition-colors group">
            Analyze Full Protocol <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;



