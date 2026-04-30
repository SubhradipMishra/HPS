import React from "react";

const ClientLogos = () => {
  const clients = [
    { name: "Mayo Clinic", location: "Rochester, MN" },
    { name: "Johns Hopkins", location: "Baltimore, MD" },
    { name: "Cleveland Clinic", location: "Cleveland, OH" },
    { name: "Mass General", location: "Boston, MA" },
    { name: "Cedars-Sinai", location: "Los Angeles, CA" },
    { name: "Stanford Health", location: "Stanford, CA" },
  ];

  // Double the list for infinite marquee effect
  const marqueeList = [...clients, ...clients];

  return (
    <section className="py-20 bg-white overflow-hidden border-b border-slate-50 relative">
      <div className="container mx-auto px-6 mb-12 flex flex-col items-center text-center">
        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 mb-4">Trusted by Leading Medical Institutions</p>
      </div>

      <div className="relative">
        {/* Transparent Masking Gradients */}
        <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

        <div className="flex gap-12 animate-marquee-smooth whitespace-nowrap">
          {marqueeList.map((client, i) => (
            <div 
              key={i} 
              className="inline-flex flex-col items-start gap-1 px-10 py-8 rounded-[2rem] border border-slate-100 hover:border-sky-500/30 hover:bg-sky-50/50 transition-all cursor-default min-w-[280px] group bg-white/50 backdrop-blur-sm"
            >
              <span className="text-xl font-black text-slate-900 tracking-tighter uppercase group-hover:text-sky-500 transition-colors">
                {client.name}
              </span>
              <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest group-hover:text-slate-400 transition-colors">
                {client.location}
              </span>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes marquee-smooth {
          0% { transform: translateX(0); }
          100% { transform: translateX(calc(-50% - 1.5rem)); }
        }
        .animate-marquee-smooth {
          display: flex;
          width: max-content;
          animation: marquee-smooth 40s linear infinite;
        }
        .animate-marquee-smooth:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
};

export default ClientLogos;

