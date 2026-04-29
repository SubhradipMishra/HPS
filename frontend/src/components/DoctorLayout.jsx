import React, { useContext, useEffect, useState } from "react";
import { Avatar, Badge, Spin } from "antd";
import { Bell, CalendarDays, LayoutDashboard, Menu, Settings, UserCircle, LogOut, FileText, ClipboardCheck } from "lucide-react";
import { useNavigate, NavLink } from "react-router-dom";
import Context from "../util/context";
import API from "../api/api";

const doctorSidebarItems = [
  { to: "/doctor/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/doctor/appointments", label: "My Schedule", icon: CalendarDays },
  { to: "/doctor/patients", label: "My Patients", icon: UserCircle },
  { to: "/doctor/prescriptions", label: "Review Prescription", icon: FileText },
  { to: "/doctor/documents", label: "Documents", icon: ClipboardCheck },
  { to: "/doctor/settings", label: "Settings", icon: Settings },
];

export default function DoctorLayout({ children, title = "Doctor Console", subtitle = "Today" }) {
  const [collapsed, setCollapsed] = useState(false);
  const { session, setSession, sessionLoading } = useContext(Context);
  const navigate = useNavigate();

  useEffect(() => {
    if (!sessionLoading) {
      if (!session) {
        navigate("/login");
      } else if (session.role !== "doctor") {
        navigate("/");
      }
    }
  }, [navigate, session, sessionLoading]);

  const handleLogout = async () => {
    try {
      await API.post("/auth/logout");
    } catch {
      void 0;
    } finally {
      setSession(null);
      navigate("/login");
    }
  };

  if (sessionLoading || !session || session.role !== "doctor") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc]" style={{ fontFamily: "'Plus Jakarta Sans','Segoe UI',sans-serif" }}>
      <div className="relative flex min-h-screen">
        
        {/* Sidebar */}
        <aside className={`${collapsed ? "w-20" : "w-64"} bg-white border-r border-slate-200 transition-all duration-300 flex flex-col z-20`}>
          <div className="p-6 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-red-500 to-pink-600 flex items-center justify-center text-white font-bold">
              C
            </div>
            {!collapsed && <span className="font-black text-xl tracking-tight text-slate-800">CureSync</span>}
          </div>

          <nav className="flex-1 px-4 space-y-1">
            {doctorSidebarItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all group ${
                    isActive 
                      ? "bg-pink-50 text-pink-600 font-bold shadow-sm shadow-pink-100" 
                      : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <item.icon size={18} className={isActive ? "text-pink-600" : "text-slate-400 group-hover:text-slate-600"} />
                    {!collapsed && <span>{item.label}</span>}
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          <div className="p-4 border-t border-slate-100">
            <button 
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-red-500 hover:bg-red-50 transition"
            >
              <LogOut size={18} />
              {!collapsed && <span className="font-medium">Logout</span>}
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/80 px-6 py-4 backdrop-blur flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setCollapsed(!collapsed)}
                className="p-2 rounded-lg border border-slate-200 bg-slate-50 text-slate-600 hover:text-slate-900 transition"
              >
                <Menu size={18} />
              </button>
              <div>
                <h2 className="text-lg font-bold text-slate-900 leading-none">{title}</h2>
                <p className="text-xs text-slate-500 mt-1">{subtitle}</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Badge count={3} size="small" offset={[-2, 2]}>
                <button className="p-2.5 rounded-xl border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 transition">
                  <Bell size={18} />
                </button>
              </Badge>
              <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-bold text-slate-900 leading-none">Dr. {session.name}</p>
                  <p className="text-[10px] text-slate-500 mt-1">{session.specialization}</p>
                </div>
                <Avatar 
                  size={40} 
                  style={{ background: "linear-gradient(135deg,#ef4444,#ec4899)", cursor: "pointer" }}
                >
                  {session.name.slice(0,1).toUpperCase()}
                </Avatar>
              </div>
            </div>
          </header>

          <div className="flex-1 overflow-y-auto p-6 bg-slate-50/50">
            {children}
          </div>
        </main>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        * { font-family: 'Plus Jakarta Sans', 'Segoe UI', sans-serif; }
      `}</style>
    </div>
  );
}
