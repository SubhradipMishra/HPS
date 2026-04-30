import React from "react";
import { Zap, ShieldCheck, HeartPulse } from "lucide-react";

const About = () => {
  return (
    <section id="about" className="relative px-8 md:px-16 py-32 bg-white overflow-hidden border-b border-slate-100">
      <div className="container mx-auto grid md:grid-cols-2 gap-24 items-center relative z-10">
        {/* LEFT SIDE CONTENT */}
        <div className="space-y-12">
          <div className="inline-flex items-center gap-3 px-4 py-2 bg-slate-900 rounded-full text-[10px] font-black uppercase tracking-[0.2em] text-white shadow-xl shadow-slate-200">
            <HeartPulse size={12} className="text-sky-400 animate-pulse" />
            The Mission
          </div>

          <h2 className="text-5xl md:text-8xl font-black tracking-tight text-slate-900 leading-[0.9] uppercase">
            Unified <br />
            <span className="text-sky-500">Care</span>.
          </h2>

          <p className="text-slate-500 text-lg font-bold leading-relaxed max-w-xl">
            Founded on the principle of operational transparency, CureSync provides a modern orchestration layer for medical facilities that want to move faster without compromising patient safety.
          </p>

          <div className="grid grid-cols-3 gap-3 pt-8">
            {[
              { val: "500+", lab: "Hospitals" },
              { val: "1.2M", lab: "Records" },
              { val: "99.9%", lab: "Uptime" }
            ].map((stat, i) => (
              <div key={i} className="bg-white/40 backdrop-blur-md p-8 rounded-3xl border border-white/50 hover:bg-white hover:shadow-xl transition-all shadow-sm">
                <h3 className="text-3xl font-black text-slate-900 leading-none tracking-tighter">{stat.val}</h3>
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-3">{stat.lab}</p>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT SIDE DESIGN ELEMENT */}
        <div className="relative">
          <div className="relative bg-white/40 backdrop-blur-md p-16 rounded-[3rem] border border-white/50 shadow-sm group overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-sky-500/10 -mr-16 -mt-16 rotate-45 group-hover:scale-150 transition-transform duration-700" />

            <div className="space-y-10 relative z-10">
              <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center text-sky-400 shadow-xl">
                <ShieldCheck size={32} />
              </div>
              <h3 className="text-3xl font-black text-slate-900 uppercase tracking-tighter leading-tight">Cloud-Native <br /> Compliance.</h3>
              <p className="text-slate-500 text-sm font-medium leading-relaxed">
                Our architecture is built on top of enterprise-grade security protocols, ensuring every clinical record is encrypted and accessible only to authorized personnel.
              </p>
              <div className="pt-4 flex flex-wrap gap-2">
                {["HIPAA", "GDPR", "SOC2"].map(tag => (
                  <span key={tag} className="px-4 py-2 bg-slate-100 border border-slate-200 rounded-full text-[9px] font-black uppercase tracking-widest text-sky-500 hover:bg-sky-500 hover:text-white transition-all cursor-default">{tag}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;


;


