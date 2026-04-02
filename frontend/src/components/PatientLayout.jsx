import React, { useContext, useEffect, useMemo, useState } from "react";
import { Avatar, Button, Spin } from "antd";
import { Bell, CalendarDays, LayoutDashboard, Menu, UserRound } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import DashboardSidebar from "./DashboardSidebar";
import Context from "../util/context";
import API from "../api/api";

const patientItems = [
  { to: "/patient/dashboard", label: "Overview", icon: LayoutDashboard },
  { to: "/patient/appointments", label: "Appointments", icon: CalendarDays },
  { to: "/patient/profile", label: "Profile", icon: UserRound },
];

function getTitle(pathname) {
  if (pathname.includes("/appointments")) {
    return {
      title: "Appointments",
      subtitle: "Book visits, review schedules, and manage cancellations in one place.",
    };
  }

  if (pathname.includes("/profile")) {
    return {
      title: "Patient Profile",
      subtitle: "Keep your CureSync account details visible inside the new light dashboard shell.",
    };
  }

  return {
    title: "Patient Overview",
    subtitle: "A cleaner space for your care journey, upcoming visits, and recent activity.",
  };
}

export default function PatientLayout({ children }) {
  const [collapsed, setCollapsed] = useState(false);
  const { session, setSession, sessionLoading } = useContext(Context);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!sessionLoading) {
      if (!session) {
        navigate("/login");
      } else if (session.role !== "patient") {
        navigate("/");
      }
    }
  }, [navigate, session, sessionLoading]);

  const headerCopy = useMemo(() => getTitle(location.pathname), [location.pathname]);

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

  if (sessionLoading || !session || session.role !== "patient") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f4f7fb] text-slate-900">
      <div className="absolute inset-x-0 top-0 h-80 bg-[radial-gradient(circle_at_top_left,_rgba(148,163,184,0.18),_transparent_48%),radial-gradient(circle_at_top_right,_rgba(14,165,233,0.10),_transparent_36%)]" />
      <div className="relative flex min-h-screen">
        <DashboardSidebar
          collapsed={collapsed}
          items={patientItems}
          brandLabel="CureSync"
          brandMeta="Patient Portal"
          profileName={session.name}
          profileEmail={session.email || session.mobileNumber}
          onLogout={handleLogout}
          homePath="/patient/dashboard"
        />

        <main className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/80 px-5 py-4 backdrop-blur md:px-8">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <Button
                  type="text"
                  onClick={() => setCollapsed((value) => !value)}
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-slate-50"
                >
                  <Menu size={18} />
                </Button>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-700">CureSync</p>
                  <h2 className="text-xl font-semibold tracking-tight text-slate-900">{headerCopy.title}</h2>
                  <p className="text-sm text-slate-500">{headerCopy.subtitle}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  className="flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-500 shadow-sm"
                >
                  <Bell size={17} />
                </button>
                <div className="hidden items-center gap-3 rounded-2xl border border-slate-200 bg-white px-3 py-2 shadow-sm md:flex">
                  <Avatar style={{ background: "linear-gradient(135deg, #0f172a, #334155)" }}>
                    {(session.name || "CU").slice(0, 1).toUpperCase()}
                  </Avatar>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-slate-900">{session.name}</p>
                    <p className="truncate text-xs text-slate-500">{session.email || session.mobileNumber}</p>
                  </div>
                </div>
              </div>
            </div>
          </header>

          <div className="flex-1 overflow-y-auto p-5 md:p-8">{children}</div>
        </main>
      </div>
    </div>
  );
}
