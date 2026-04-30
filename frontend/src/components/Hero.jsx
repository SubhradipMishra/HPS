import React, { useState } from "react";
import { Button, Carousel } from "antd";
import {
  SafetyCertificateOutlined,
  CalendarOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { HeartPulse, ArrowRight, Activity, Zap, Play, X } from "lucide-react";
import { Link } from "react-router-dom";
import demoVideo from "../assets/CURESYNC_DEMO.mp4";

const Hero = () => {
  const [isDemoOpen, setIsDemoOpen] = useState(false);

  const slides = [
    {
      image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=1000",
      title: "Smart Consultations",
      tag: "Telehealth Ready"
    },
    {
      image: "https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=1000",
      title: "Modern Diagnostics",
      tag: "AI Powered"
    },
    {
      image: "https://images.unsplash.com/photo-1581056771107-24ca5f033742?auto=format&fit=crop&q=80&w=1000",
      title: "Seamless Management",
      tag: "Cloud Native"
    }
  ];

  return (
    <>
      <section id="hero" className="relative overflow-hidden bg-white py-24 px-6 md:px-16 lg:py-40 border-b border-slate-100">
        {/* Dynamic Background Elements */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-sky-50 rounded-full blur-[120px] -mr-64 -mt-64 opacity-60 animate-pulse" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-indigo-50 rounded-full blur-[100px] -ml-48 -mb-48 opacity-40" />

        <div className="container mx-auto grid lg:grid-cols-2 gap-20 items-center relative z-10">
          {/* LEFT SIDE: CONTENT */}
          <div className="space-y-12">
            <div className="inline-flex items-center gap-3 px-4 py-2 bg-slate-900 rounded-full text-white shadow-2xl shadow-slate-200">
              <Zap size={14} className="text-sky-400 fill-sky-400 animate-pulse" />
              <p className="text-[10px] font-black uppercase tracking-[0.3em]">v4.0 Architecture</p>
            </div>

            <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-slate-900 leading-[0.85] uppercase">
              Future <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-500 to-indigo-600">Medicine</span>.
            </h1>

            <p className="max-w-xl text-lg md:text-xl text-slate-500 font-bold leading-relaxed">
              CureSync is a high-precision medical orchestration suite designed to unify clinical workflows through modular technology blocks and AI-driven insights.
            </p>

            <div className="flex flex-wrap gap-4 pt-4">
              <Link to="/patient/signup">
                <Button
                  size="large"
                  className="bg-slate-900 border-none text-white h-20 px-12 rounded-3xl font-black text-xs uppercase tracking-[0.2em] hover:!bg-sky-500 hover:scale-105 transition-all flex items-center gap-2 shadow-2xl shadow-slate-300"
                >
                  Join Platform <ArrowRight size={16} />
                </Button>
              </Link>
              <Button
                onClick={() => setIsDemoOpen(true)}
                size="large"
                className="bg-white border border-slate-100 text-slate-900 h-20 px-12 rounded-3xl font-black text-xs uppercase tracking-[0.2em] hover:!bg-slate-900 hover:!text-white hover:scale-105 transition-all flex items-center gap-3 shadow-lg shadow-slate-100"
              >
                <div className="w-8 h-8 bg-sky-50 rounded-full flex items-center justify-center text-sky-500">
                  <Play size={14} fill="currentColor" />
                </div>
                View Demo
              </Button>
            </div>

            <div className="flex items-center gap-10 pt-8 border-t border-slate-100">
              {[
                { icon: <CalendarOutlined />, label: "Live Nodes" },
                { icon: <SafetyCertificateOutlined />, label: "Vault Sync" },
                { icon: <UserOutlined />, label: "Portal Access" }
              ].map((feature, i) => (
                <div key={i} className="flex flex-col gap-2">
                  <span className="text-sky-500 text-xl">{feature.icon}</span>
                  <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">{feature.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT SIDE: CAROUSEL & STATS */}
          <div className="relative">
            {/* Glassy Background Plate */}
            <div className="absolute -inset-10 bg-slate-50 rounded-[4rem] blur-2xl opacity-50" />

            <div className="relative rounded-[3rem] overflow-hidden border-8 border-white shadow-[0_40px_100px_-20px_rgba(0,0,0,0.15)] bg-white">
              <Carousel autoplay effect="fade" dotPosition="bottom" className="custom-hero-carousel">
                {slides.map((slide, i) => (
                  <div key={i} className="relative h-[550px] md:h-[750px]">
                    <img src={slide.image} className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000" alt={slide.title} />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent" />
                    <div className="absolute bottom-16 left-16 text-white max-w-md">
                      <div className="bg-sky-500/20 backdrop-blur-md border border-sky-400/30 text-[10px] font-black uppercase tracking-widest text-sky-300 px-4 py-2 mb-6 rounded-full inline-block">
                        {slide.tag}
                      </div>
                      <h3 className="text-5xl font-black uppercase tracking-tighter leading-none">{slide.title}</h3>
                    </div>
                  </div>
                ))}
              </Carousel>
            </div>

            {/* Floating Live Stats - Glassmorphic */}
            <div className="absolute -bottom-10 -left-10 bg-white/80 backdrop-blur-2xl p-10 rounded-[3rem] shadow-2xl border border-white/50 hidden md:block hover:-translate-y-3 transition-transform duration-500 group">
              <div className="flex items-center gap-8">
                <div className="w-16 h-16 bg-slate-900 rounded-[1.5rem] flex items-center justify-center text-sky-400 shadow-xl group-hover:rotate-12 transition-transform">
                  <Activity size={32} />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-2">Network Stream</p>
                  <div className="flex items-end gap-2">
                    <p className="text-4xl font-black text-slate-900 tracking-tighter">984.20</p>
                    <span className="text-emerald-500 text-[10px] font-black mb-1">↑ 12%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Video Modal Overlay */}
      {isDemoOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-10 bg-slate-900/90 backdrop-blur-xl transition-all duration-500 animate-in fade-in zoom-in-95">
          <button
            onClick={() => setIsDemoOpen(false)}
            className="absolute top-8 right-8 w-14 h-14 bg-white/10 hover:bg-white/20 border border-white/20 rounded-2xl flex items-center justify-center text-white transition-all shadow-xl z-50"
          >
            <X size={24} />
          </button>
          
          <div className="relative w-full max-w-6xl aspect-video bg-black rounded-[3rem] overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.5)] border border-white/10 flex items-center justify-center">
            <video
              src={demoVideo}
              controls
              autoPlay
              className="w-full h-full object-contain"
            />
          </div>
        </div>
      )}
    </>
  );
};

export default Hero;


