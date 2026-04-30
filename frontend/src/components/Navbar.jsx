import React, { useState, useContext, useRef, useEffect } from "react";
import { Button, Tag } from "antd";
import {
  MenuOutlined,
  CloseOutlined,
  UserOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { HeartPulse } from "lucide-react";
import Context from "../util/context";
import { Link, useLocation } from "react-router-dom";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { session, setSession } = useContext(Context);
  const profileRef = useRef(null);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    setSession(null);
    setProfileOpen(false);
  };

  const getDashboardLink = (role) => {
    switch (role) {
      case "patient": return "/patient/dashboard";
      case "doctor": return "/doctor/dashboard";
      case "admin": return "/admin/dashboard";
      default: return "/dashboard";
    }
  };

  const menuItems = [
    { label: "Home", href: "/" },
    { label: "Architecture", href: "/architecture" },
    { label: "Solutions", href: "/solutions" },
    { label: "Economics", href: "/economics" },
    { label: "Upcoming", href: "/upcoming" },
    { label: "Inquiries", href: "/inquiries" }
  ];

  return (
    <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? "bg-white/80 backdrop-blur-xl border-b border-slate-100 py-4 shadow-sm" : "bg-transparent py-6"}`}>
      <div className="container mx-auto flex items-center justify-between px-6 md:px-12">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center transition-transform group-hover:scale-105 shadow-lg shadow-slate-200">
            <HeartPulse size={20} className="text-sky-400" />
          </div>
          <h1 className="text-2xl font-black tracking-tighter text-slate-900 uppercase">
            Cure<span className="text-sky-500">Sync</span>
          </h1>
        </Link>

        {/* Desktop Menu */}
        <nav className="hidden lg:flex items-center gap-12">
          {menuItems.map((item) => (
            <Link
              key={item.label}
              to={item.href}
              className={`text-[10px] font-black uppercase tracking-[0.2em] transition-colors relative group ${location.pathname === item.href ? "text-sky-500" : "text-slate-500 hover:text-sky-500"}`}
            >
              {item.label}
              <span className={`absolute -bottom-1 left-0 h-0.5 bg-sky-500 transition-all duration-300 ${location.pathname === item.href ? "w-full" : "w-0 group-hover:w-full"}`} />
            </Link>
          ))}
        </nav>

        {/* Desktop Buttons */}
        <div className="hidden lg:flex items-center gap-3">
          {session ? (
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-4 bg-white border border-slate-100 px-6 py-3 rounded-2xl hover:border-sky-500 transition-colors group shadow-sm"
              >
                <div className="text-left">
                  <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Session Active</p>
                  <p className="text-xs font-black text-slate-800 leading-none truncate max-w-[120px] uppercase tracking-tighter">{session.email.split('@')[0]}</p>
                </div>
                <UserOutlined className="text-sky-500 text-sm" />
              </button>

              {profileOpen && (
                <div className="absolute right-0 mt-3 w-64 bg-white/90 backdrop-blur-2xl shadow-2xl border border-slate-100 rounded-[2rem] overflow-hidden z-50">
                  <div className="p-6 flex items-center gap-4 border-b border-slate-100">
                    <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-sky-400 shadow-lg">
                      <UserOutlined />
                    </div>
                    <div className="overflow-hidden">
                      <p className="text-slate-900 font-black text-xs truncate leading-tight uppercase tracking-tighter">{session.email}</p>
                      <p className="text-sky-500 text-[8px] font-black uppercase tracking-widest mt-1">[{session.role}]</p>
                    </div>
                  </div>

                  <div className="p-2 space-y-1">
                    <Link
                      to={getDashboardLink(session.role)}
                      className="flex items-center gap-3 px-6 py-4 text-slate-600 hover:bg-slate-50 hover:text-sky-600 rounded-xl font-black text-[10px] uppercase tracking-widest transition"
                      onClick={() => setProfileOpen(false)}
                    >
                      Workspace
                    </Link>

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-6 py-4 text-rose-500 hover:bg-rose-50 rounded-xl font-black text-[10px] uppercase tracking-widest transition"
                    >
                      Terminate Session
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login">
                <Button className="h-14 px-8 border border-slate-100 bg-white text-slate-900 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:!border-sky-500 transition-all">
                  Sign In
                </Button>
              </Link>
              <Link to="/patient/signup">
                <Button type="primary" className="h-14 px-8 border-none bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:!bg-sky-500 transition-all shadow-xl shadow-slate-200">
                  Join Platform
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Hamburger */}
        <button className="lg:hidden w-12 h-12 flex items-center justify-center bg-slate-900 text-white rounded-2xl" onClick={() => setOpen(!open)}>
          {open ? <CloseOutlined /> : <MenuOutlined />}
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="lg:hidden absolute top-full left-0 w-full bg-white border-b border-slate-100 p-8 space-y-8 animate-in slide-in-from-top-4 duration-300">
          <nav className="flex flex-col gap-6">
            {menuItems.map((item) => (
              <Link key={item.label} to={item.href} onClick={() => setOpen(false)} className={`text-[10px] font-black transition-colors uppercase tracking-[0.2em] ${location.pathname === item.href ? "text-sky-500" : "text-slate-900 hover:text-sky-500"}`}>
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="pt-8 border-t border-slate-100 flex flex-col gap-2">
            {session ? (
              <Link to={getDashboardLink(session.role)} className="w-full">
                <Button type="primary" className="w-full h-14 bg-slate-900 rounded-2xl border-none font-black text-[10px] uppercase tracking-[0.2em]">Workspace</Button>
              </Link>
            ) : (
              <>
                <Link to="/login" className="w-full">
                  <Button className="w-full h-14 bg-white border border-slate-100 rounded-2xl text-slate-900 font-black text-[10px] uppercase tracking-[0.2em]">Sign In</Button>
                </Link>
                <Link to="/patient/signup" className="w-full">
                  <Button type="primary" className="w-full h-14 bg-sky-500 rounded-2xl border-none text-white font-black text-[10px] uppercase tracking-[0.2em]">Join Platform</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;






