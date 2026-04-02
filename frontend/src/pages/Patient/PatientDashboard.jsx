import React, { useContext, useEffect, useMemo, useState } from "react";
import { Button, Empty, Skeleton, Tag } from "antd";
import { Activity, ArrowRight, CalendarClock, ClipboardPlus, HeartPulse, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";
import PatientLayout from "../../components/PatientLayout";
import Context from "../../util/context";
import API from "../../api/api";

function formatDate(dateString, options = {}) {
  if (!dateString) return "";
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    ...options,
  }).format(new Date(dateString));
}

export default function PatientDashboard() {
  const { session } = useContext(Context);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!session?.id) return;

    const load = async () => {
      try {
        setLoading(true);
        const { data } = await API.get(`/appointment/patient/${session.id}`);
        setAppointments(data.appointments || []);
      } catch {
        setAppointments([]);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [session?.id]);

  const stats = useMemo(() => {
    const upcoming = appointments.filter((appointment) => appointment.status === "booked").length;
    const completed = appointments.filter((appointment) => appointment.status === "completed").length;
    const cancelled = appointments.filter((appointment) => appointment.status === "cancelled").length;

    return [
      { label: "Upcoming Visits", value: upcoming, detail: "Scheduled with confirmed backend slots", icon: CalendarClock },
      { label: "Completed Appointments", value: completed, detail: "Visits already finished in CureSync", icon: ShieldCheck },
      { label: "Care Timeline", value: appointments.length, detail: `${cancelled} cancelled visit${cancelled === 1 ? "" : "s"}`, icon: Activity },
    ];
  }, [appointments]);

  const nextAppointment = appointments.find((appointment) => appointment.status === "booked");

  return (
    <PatientLayout>
      <div className="space-y-6">
        <section className="grid gap-6 xl:grid-cols-[1.15fr,0.85fr]">
          <div className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-sm">
            <div className="inline-flex items-center gap-2 rounded-full bg-sky-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-sky-700">
              <HeartPulse size={14} />
              Calm Care Dashboard
            </div>
            <h1 className="mt-5 max-w-2xl text-4xl font-semibold tracking-tight text-slate-900">
              Everything around your next visit, designed to feel lighter.
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-slate-500">
              CureSync now mirrors the backend appointment flow with a cleaner patient workspace, so booking and reviewing care feels structured, fast, and easy to trust.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/patient/appointments">
                <Button type="primary" size="large" style={{ background: "#0f172a", borderColor: "#0f172a" }}>
                  Book Appointment
                </Button>
              </Link>
              <Button size="large" className="border-slate-200 text-slate-700">
                Care Summary
              </Button>
            </div>
          </div>

          <div className="rounded-[32px] border border-slate-200 bg-slate-900 p-8 text-white shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">Next Confirmed Visit</p>
            {loading ? (
              <div className="mt-6">
                <Skeleton active paragraph={{ rows: 3 }} />
              </div>
            ) : nextAppointment ? (
              <div className="mt-6 space-y-4">
                <Tag color="blue" className="rounded-full px-3 py-1">
                  {formatDate(nextAppointment.date, { weekday: "long", day: "2-digit", month: "short", year: "numeric" })}
                </Tag>
                <div>
                  <h3 className="text-2xl font-semibold">{nextAppointment.doctorId?.name || "Doctor assigned"}</h3>
                  <p className="mt-2 text-slate-300">{nextAppointment.departmentId?.name || "Department"} at {nextAppointment.hospitalId?.name || "Hospital"}</p>
                </div>
                <div className="rounded-2xl border border-slate-700 bg-slate-800 px-4 py-3">
                  <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Time Slot</p>
                  <p className="mt-2 text-lg font-medium">{nextAppointment.slotTime}</p>
                </div>
              </div>
            ) : (
              <div className="mt-8 rounded-3xl border border-slate-700 bg-slate-800 p-6">
                <p className="text-lg font-semibold">No upcoming appointment yet</p>
                <p className="mt-2 text-sm text-slate-300">Open the appointment workspace to choose a hospital, doctor, and live slot from the backend.</p>
              </div>
            )}
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-900">
                  <Icon size={20} />
                </div>
                <p className="mt-5 text-3xl font-semibold text-slate-900">{stat.value}</p>
                <p className="mt-2 text-sm font-medium text-slate-800">{stat.label}</p>
                <p className="mt-1 text-sm text-slate-500">{stat.detail}</p>
              </div>
            );
          })}
        </section>

        <section className="grid gap-6 xl:grid-cols-[1.1fr,0.9fr]">
          <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-5 flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">Recent Appointments</p>
                <h3 className="mt-2 text-xl font-semibold text-slate-900">Your latest care activity</h3>
              </div>
              <Link to="/patient/appointments" className="inline-flex items-center gap-2 text-sm font-medium text-slate-600">
                Open planner
                <ArrowRight size={16} />
              </Link>
            </div>

            {loading ? (
              <div className="space-y-3">
                <Skeleton active paragraph={{ rows: 2 }} />
                <Skeleton active paragraph={{ rows: 2 }} />
              </div>
            ) : appointments.length === 0 ? (
              <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="No appointment records yet" />
            ) : (
              <div className="space-y-3">
                {appointments.slice(0, 4).map((appointment) => (
                  <div key={appointment._id} className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-slate-900">{appointment.doctorId?.name || "Doctor"}</p>
                        <p className="mt-1 text-sm text-slate-500">
                          {appointment.departmentId?.name || "Department"} at {appointment.hospitalId?.name || "Hospital"}
                        </p>
                      </div>
                      <Tag color={appointment.status === "completed" ? "green" : appointment.status === "booked" ? "blue" : "default"}>
                        {appointment.status}
                      </Tag>
                    </div>
                    <div className="mt-4 flex items-center gap-3 text-sm text-slate-600">
                      <CalendarClock size={16} />
                      <span>{formatDate(appointment.date)} • {appointment.slotTime}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">What Changed</p>
            <h3 className="mt-2 text-xl font-semibold text-slate-900">A cleaner CureSync patient experience</h3>
            <div className="mt-6 space-y-4">
              {[
                "Sidebar and dashboard structure now match the admin-style app shell, but tuned for patients.",
                "Appointment booking is connected to hospitals, departments, doctors, and live slot availability from the backend.",
                "Cancellation and history management are part of the same patient workspace, so there is less jumping around.",
              ].map((item) => (
                <div key={item} className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <ClipboardPlus size={18} className="mt-0.5 text-slate-500" />
                  <p className="text-sm leading-6 text-slate-600">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </PatientLayout>
  );
}
