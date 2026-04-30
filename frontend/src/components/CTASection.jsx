import React from "react";
import { Link } from "react-router-dom";
import { Button } from "antd";
import { ArrowRight, Zap } from "lucide-react";

const CTASection = () => {
  return (
    <section className="px-8 md:px-16 py-32 bg-white relative overflow-hidden border-b border-slate-100">
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="bg-slate-900/95 backdrop-blur-3xl p-16 md:p-32 border border-white/5 text-center relative overflow-hidden group rounded-[4rem] shadow-2xl">
          {/* Abstract Glow */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-sky-500/10 rounded-full blur-[100px] -mr-48 -mt-48 animate-pulse" />

          <div className="relative z-10 space-y-12">
            <div className="inline-flex items-center gap-3 px-4 py-2 bg-white/5 border border-white/10 mx-auto text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-full shadow-lg">
              <Zap size={12} className="text-sky-400 fill-sky-400" />
              Network Deployment
            </div>

            <h2 className="text-5xl md:text-8xl font-black text-white tracking-tighter leading-[0.9] uppercase">
              Modernize <br />
              <span className="text-sky-400">Care Architecture</span>.
            </h2>

            <p className="text-slate-400 text-lg md:text-xl font-bold max-w-2xl mx-auto leading-relaxed">
              Join the growing network of clinics and hospitals achieving 30% higher operational efficiency with CureSync.
            </p>

            <div className="flex flex-col md:flex-row justify-center gap-4 pt-8">
              <Link to="/patient/signup">
                <Button className="h-20 px-16 rounded-[2rem] bg-sky-500 border-none text-white font-black text-[11px] uppercase tracking-[0.2em] hover:!bg-white hover:!text-slate-900 transition-all shadow-xl shadow-sky-500/20">
                  Initialize Nodes
                </Button>
              </Link>
              <Link to="/architecture">
                <Button className="h-20 px-16 rounded-[2rem] bg-white/5 border border-white/10 text-white font-black text-[11px] uppercase tracking-[0.2em] hover:!bg-white/10 transition-all flex items-center justify-center gap-2">
                  System Demo <ArrowRight size={14} className="text-sky-400" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;

