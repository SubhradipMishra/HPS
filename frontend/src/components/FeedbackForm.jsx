import React from "react";
import { Send, MessageCircle } from "lucide-react";

const FeedbackForm = () => {
  return (
    <section className="relative px-8 md:px-16 py-32 bg-white overflow-hidden border-b border-slate-100">
      <div className="container mx-auto relative z-10">
        
        <div className="grid lg:grid-cols-2 gap-24 items-center">
          
          {/* Left Side: Copy */}
          <div className="space-y-12">
            <div className="inline-flex items-center gap-3 px-5 py-2 bg-slate-900 rounded-full text-[10px] font-black uppercase tracking-[0.4em] text-white shadow-xl">
              <MessageCircle size={12} className="text-sky-400" />
              Community Intel
            </div>
            
            <h2 className="text-6xl md:text-8xl font-black tracking-tighter text-slate-900 leading-[0.85] uppercase">
              Share Your <br />
              <span className="text-sky-500">Thoughts</span>.
            </h2>
            
            <p className="text-slate-500 text-lg font-bold leading-relaxed max-w-xl">
              Our architecture is built on the collective feedback of medical visionaries. Help us calibrate the future of clinical orchestration.
            </p>

            <div className="flex gap-12 pt-8">
              <div>
                <p className="text-2xl font-black text-slate-900">24h</p>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-2">Response Sync</p>
              </div>
              <div>
                <p className="text-2xl font-black text-slate-900">100%</p>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-2">Encrypted Stream</p>
              </div>
            </div>
          </div>

          {/* Right Side: Form */}
          <div className="relative">
            <div className="absolute -inset-4 bg-sky-500/5 blur-3xl rounded-[4rem] -z-10" />
            <div className="bg-white/40 backdrop-blur-xl border border-white/50 p-12 rounded-[3rem] shadow-2xl space-y-8">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Identity</label>
                  <input 
                    type="text" 
                    placeholder="Full Name"
                    className="w-full bg-white border border-slate-100 px-6 py-4 rounded-2xl text-xs font-bold text-slate-900 placeholder:text-slate-300 focus:outline-none focus:border-sky-500 transition-colors shadow-sm"
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Uplink</label>
                  <input 
                    type="email" 
                    placeholder="Email Address"
                    className="w-full bg-white border border-slate-100 px-6 py-4 rounded-2xl text-xs font-bold text-slate-900 placeholder:text-slate-300 focus:outline-none focus:border-sky-500 transition-colors shadow-sm"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Intel / Thoughts</label>
                <textarea 
                  rows="5"
                  placeholder="Tell us what you think about the CureSync ecosystem..."
                  className="w-full bg-white border border-slate-100 px-6 py-6 rounded-[2rem] text-xs font-bold text-slate-900 placeholder:text-slate-300 focus:outline-none focus:border-sky-500 transition-colors shadow-sm resize-none"
                />
              </div>

              <button className="w-full bg-slate-900 text-white py-6 rounded-2xl font-black text-xs uppercase tracking-[0.3em] flex items-center justify-center gap-4 hover:bg-sky-500 transition-all shadow-xl shadow-slate-200 group">
                Transmit Thoughts
                <Send size={14} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </button>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default FeedbackForm;
