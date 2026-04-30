import React from "react";
import {
  Users,
  Calendar,
  CreditCard,
  Zap,
  Activity,
  Lock,
  Globe
} from "lucide-react";

const Features = () => {
  const featureList = [
    { title: "Identity Vault", desc: "Digital patient records.", icon: Users },
    { title: "Live Sync", desc: "Real-time scheduling.", icon: Calendar },
    { title: "Encryption", desc: "256-bit AES protection.", icon: Lock },
    { title: "Analytics", desc: "Revenue tracking.", icon: Activity },
    { title: "Global API", desc: "Third-party ready.", icon: Globe },
    { title: "Smart Billing", desc: "Automated invoices.", icon: CreditCard }
  ];

  return (
    <section id="features" className="relative py-32 px-6 md:px-16 bg-slate-50 overflow-hidden border-b border-slate-100">
      <div className="container mx-auto">
        <div className="grid lg:grid-cols-12 gap-20 items-start">

          {/* CONTENT LEFT */}
          <div className="lg:col-span-5 space-y-10">
            <div className="inline-flex items-center gap-3 px-4 py-2 bg-white rounded-full text-[10px] font-black uppercase tracking-[0.2em] text-slate-900 shadow-sm border border-slate-100">
              <Zap size={12} className="text-sky-500 fill-sky-500" />
              Platform Stack
            </div>

            <h2 className="text-5xl md:text-7xl font-black tracking-tight text-slate-900 leading-[1.0] uppercase">
              Modular <br />
              <span className="text-sky-500">Architecture</span>.
            </h2>

            <p className="text-slate-500 text-lg font-bold leading-relaxed max-w-xl">
              A high-precision orchestration layer designed to simplify clinical workflows through modular technology blocks.
            </p>

            <div className="flex gap-10 border-t border-slate-200 pt-10">
              <div>
                <p className="text-2xl font-black text-slate-900">01.</p>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-2">Deployment</p>
              </div>
              <div>
                <p className="text-2xl font-black text-slate-900">02.</p>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-2">Scaling</p>
              </div>
              <div>
                <p className="text-2xl font-black text-slate-900">03.</p>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-2">Security</p>
              </div>
            </div>
          </div>

          {/* ROUNDED CARDS GRID */}
          <div className="lg:col-span-7 grid grid-cols-2 md:grid-cols-3 gap-6">
            {featureList.map((item, idx) => (
              <div key={idx} className="group relative aspect-square bg-white/40 backdrop-blur-md border border-white/50 p-8 flex flex-col justify-between hover:bg-slate-900 transition-all duration-500 hover:shadow-2xl rounded-[2.5rem]">
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-sky-500 group-hover:bg-white/10 group-hover:text-white transition-all shadow-sm">
                  <item.icon size={22} />
                </div>

                <div>
                  <h3 className="text-sm font-black text-slate-900 group-hover:text-white uppercase tracking-tighter transition-colors mb-2">{item.title}</h3>
                  <p className="text-[10px] font-bold text-slate-400 group-hover:text-slate-500 transition-colors leading-tight">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
};

export default Features;





