import React from "react";
import { Link } from "react-router-dom";
import { HeartPulse, Mail, Phone, MapPin } from "lucide-react";

const GithubIcon = (props) => (
  <svg width={props.size} height={props.size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={props.className}>
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const TwitterIcon = (props) => (
  <svg width={props.size} height={props.size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={props.className}>
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
  </svg>
);

const LinkedinIcon = (props) => (
  <svg width={props.size} height={props.size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={props.className}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const Footer = () => {
  const socials = [
    { Icon: TwitterIcon, label: "Twitter" },
    { Icon: GithubIcon, label: "Github" },
    { Icon: LinkedinIcon, label: "Linkedin" }
  ];

  return (
    <footer className="relative bg-slate-900 text-white overflow-hidden pt-24 pb-12 border-t border-white/5">
      <div className="container mx-auto px-6 md:px-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-24">

          {/* Brand Identity */}
          <div className="space-y-10">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-105 border border-white/10 shadow-lg">
                <HeartPulse size={24} className="text-sky-400" />
              </div>
              <h1 className="text-2xl font-black tracking-tighter text-white uppercase">
                Cure<span className="text-sky-500">Sync</span>
              </h1>
            </Link>
            <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] leading-relaxed max-w-xs">
              Autonomous Clinical Orchestration for high-throughput healthcare environments.
            </p>
            <div className="flex gap-2">
              {socials.map((social, idx) => (
                <div key={idx} className="w-10 h-10 bg-white/5 border border-white/5 rounded-xl flex items-center justify-center hover:bg-sky-500 hover:border-sky-500 transition-all cursor-pointer group">
                  <social.Icon size={16} className="text-slate-500 group-hover:text-white transition-colors" />
                </div>
              ))}
            </div>
          </div>

          {/* Solution Links */}
          <div>
            <h4 className="text-[9px] font-black uppercase tracking-[0.3em] text-sky-500 mb-10">Infrastructure</h4>
            <ul className="space-y-4">
              {[
                { name: "Doctor Workspace", path: "/login" },
                { name: "Patient Vault", path: "/patient/dashboard" },
                { name: "Admin Panel", path: "/login" },
                { name: "Live Scheduling", path: "/solutions" }
              ].map(item => (
                <li key={item.name}>
                  <Link to={item.path} className="text-[10px] font-black text-slate-400 hover:text-white transition-colors uppercase tracking-widest">{item.name}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="text-[9px] font-black uppercase tracking-[0.3em] text-sky-500 mb-10">Network</h4>
            <ul className="space-y-4">
              {[
                { name: "Developer API", path: "/architecture" },
                { name: "Hospital Nodes", path: "/architecture" },
                { name: "Compliance Lab", path: "/privacy" },
                { name: "Security Trust", path: "/privacy" }
              ].map(item => (
                <li key={item.name}>
                  <Link to={item.path} className="text-[10px] font-black text-slate-400 hover:text-white transition-colors uppercase tracking-widest">{item.name}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h4 className="text-[9px] font-black uppercase tracking-[0.3em] text-sky-500 mb-10">Terminal</h4>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <Mail size={14} className="text-slate-600 mt-1" />
                <div>
                  <p className="text-[8px] font-black text-slate-600 uppercase tracking-widest mb-1">Direct Stream</p>
                  <p className="text-[10px] font-black text-slate-200 uppercase tracking-widest">nexus@caresync.cloud</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Phone size={14} className="text-slate-600 mt-1" />
                <div>
                  <p className="text-[8px] font-black text-slate-600 uppercase tracking-widest mb-1">Emergency Uplink</p>
                  <p className="text-[10px] font-black text-slate-200 uppercase tracking-widest">+91 800 293 847</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
          <p className="text-[9px] font-black text-slate-600 uppercase tracking-[0.2em]">
            © 2026 CureSync Architecture. Built for Performance.
          </p>
          <div className="flex items-center gap-8 text-[9px] font-black text-slate-600 uppercase tracking-widest">
            <Link to="/privacy" className="hover:text-sky-500 transition">Security</Link>
            <Link to="/terms" className="hover:text-sky-500 transition">Terms</Link>
            <Link to="/inquiries" className="hover:text-sky-500 transition">Status</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;


