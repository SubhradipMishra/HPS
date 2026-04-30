import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Video, MessageSquare, Pill, BrainCircuit, Microscope, Radio } from "lucide-react";

const UpcomingServices = () => {
  const services = [
    {
      title: "Telehealth Matrix",
      desc: "High-definition video consultation layer with real-time biometric overlay.",
      icon: Video,
      status: "Beta 2026",
      color: "from-sky-400 to-indigo-500"
    },
    {
      title: "Neural Diagnostic AI",
      desc: "Advanced LLM-driven medical reasoning engine for preliminary triage.",
      icon: BrainCircuit,
      status: "In Development",
      color: "from-indigo-500 to-purple-600"
    },
    {
      title: "PharmaSync Pipeline",
      desc: "Automated prescription fulfillment network with drone-ready logistics.",
      icon: Pill,
      status: "Q4 2026",
      color: "from-emerald-400 to-teal-600"
    },
    {
      title: "Bio-Stream Monitoring",
      desc: "Continuous health telemetry integration for wearable medical devices.",
      icon: Radio,
      status: "Prototyping",
      color: "from-rose-400 to-orange-500"
    },
    {
      title: "Genomic Vault",
      desc: "Secure storage and analysis of patient genomic sequences for precision care.",
      icon: Microscope,
      status: "Future Scope",
      color: "from-amber-400 to-orange-600"
    },
    {
      title: "Nexus Chatbot",
      desc: "24/7 autonomous patient support agent with multilingual capability.",
      icon: MessageSquare,
      status: "Beta 2026",
      color: "from-sky-500 to-cyan-400"
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      
      <main className="pt-40 pb-32">
        <div className="container mx-auto px-8 md:px-16">
          
          {/* Header Section */}
          <div className="max-w-4xl mb-24">
            <div className="inline-flex items-center gap-3 px-5 py-2 bg-slate-900 rounded-full text-[10px] font-black uppercase tracking-[0.4em] text-white mb-8 shadow-xl">
              <span className="w-2 h-2 bg-sky-400 rounded-full animate-ping" />
              Future Roadmap
            </div>
            <h1 className="text-6xl md:text-9xl font-black tracking-tighter text-slate-900 leading-[0.85] uppercase mb-10">
              Upcoming <br />
              <span className="text-sky-500">Services</span>.
            </h1>
            <p className="text-slate-500 text-xl font-bold leading-relaxed max-w-2xl">
              We are expanding the CureSync architecture to include next-generation clinical tools. These services are currently in our R&D pipeline.
            </p>
          </div>

          {/* Services Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, idx) => {
              const Icon = service.icon;
              return (
                <div key={idx} className="group relative bg-white/70 backdrop-blur-xl border border-white p-12 rounded-[3rem] shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 overflow-hidden">
                  {/* Decorative Gradient Blob */}
                  <div className={`absolute -top-12 -right-12 w-32 h-32 bg-gradient-to-br ${service.color} opacity-0 group-hover:opacity-10 rounded-full blur-3xl transition-opacity duration-700`} />
                  
                  <div className="relative z-10 space-y-10">
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${service.color} p-[1px] group-hover:rotate-6 transition-transform duration-500`}>
                      <div className="w-full h-full bg-white rounded-[calc(1rem-1px)] flex items-center justify-center text-slate-900 group-hover:text-sky-500 transition-colors">
                        <Icon size={28} />
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center gap-3 mb-4">
                        <span className="text-[9px] font-black uppercase tracking-widest px-3 py-1 bg-slate-100 rounded-full text-slate-500 group-hover:bg-sky-500 group-hover:text-white transition-colors">
                          {service.status}
                        </span>
                      </div>
                      <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter mb-4">{service.title}</h3>
                      <p className="text-sm font-bold text-slate-400 leading-relaxed group-hover:text-slate-500 transition-colors">
                        {service.desc}
                      </p>
                    </div>

                    <div className="pt-6">
                      <button className="text-[10px] font-black uppercase tracking-widest text-slate-900 group-hover:text-sky-500 flex items-center gap-3 transition-colors">
                        Join Waitlist <span className="w-8 h-[1px] bg-slate-200 group-hover:w-12 group-hover:bg-sky-500 transition-all" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom Banner */}
          <div className="mt-32 p-16 bg-slate-900 rounded-[4rem] relative overflow-hidden text-center">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-sky-500/10 via-transparent to-transparent" />
            <div className="relative z-10 space-y-8">
              <h2 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter">Want to Beta Test?</h2>
              <p className="text-slate-400 font-bold max-w-xl mx-auto">Early access nodes get priority deployment for all upcoming neural and telehealth services.</p>
              <button className="px-12 py-6 bg-sky-500 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-white hover:text-slate-900 transition-all shadow-2xl shadow-sky-500/20">
                Register for Beta
              </button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default UpcomingServices;
