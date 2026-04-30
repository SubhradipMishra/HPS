import React, { useContext, useState } from "react";
import API from "../api/api";
import Context from "../util/context";
import { useNavigate, Link } from "react-router-dom";
import { HeartPulse, ArrowRight, Mail, Lock, CheckCircle2, ShieldCheck } from "lucide-react";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [focused, setFocused] = useState("");
  const { session, setSession } = useContext(Context);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await API.post("/auth/login", { identifier: formData.email, password: formData.password });
      const sessionData = await API.get("/auth/session");
      setSession(sessionData.data);

      if (res.data.role === "admin") navigate("/admin/dashboard");
      else if (res.data.role === "doctor") navigate("/doctor/dashboard");
      else if (res.data.role === "patient") navigate("/patient/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 md:p-12 font-sans overflow-hidden relative">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-sky-100/50 rounded-full blur-[120px] -mr-64 -mt-64 opacity-60" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-indigo-100/50 rounded-full blur-[100px] -ml-48 -mb-48 opacity-40" />

      <div className="w-full max-w-6xl grid lg:grid-cols-2 bg-white rounded-[3rem] shadow-2xl overflow-hidden border border-slate-100 relative z-10">

        {/* LEFT PANEL: Branding & Context */}
        <div className="hidden lg:flex flex-col justify-center p-20 bg-slate-900 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-sky-500/10 -mr-32 -mt-32 rounded-full blur-3xl" />

          <div className="relative z-10 space-y-12">
            <Link to="/" className="flex items-center gap-3 group w-fit">
              <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-105 border border-white/10 shadow-lg">
                <HeartPulse size={24} className="text-sky-400" />
              </div>
              <h1 className="text-2xl font-black tracking-tighter text-white uppercase">
                Cure<span className="text-sky-500">Sync</span>
              </h1>
            </Link>

            <div className="space-y-6">
              <h2 className="text-5xl font-black text-white leading-[1.1] uppercase tracking-tighter">
                Access Your <br />
                <span className="text-sky-500">Health Portal</span>.
              </h2>
              <p className="text-slate-400 text-lg font-medium leading-relaxed max-w-md">
                Securely manage your medical history, appointments, and prescriptions through our unified orchestration platform.
              </p>
            </div>

            <div className="space-y-4 pt-8">
              {[
                { title: "Biometric Grade Security", desc: "Enterprise level data protection" },
                { title: "Real-time Node Access", desc: "Direct uplink to your hospital" },
                { title: "Unified Health ID", desc: "One identity across the network" }
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/5 hover:border-white/10 transition-all">
                  <div className="w-10 h-10 bg-sky-500/20 rounded-xl flex items-center justify-center text-sky-400">
                    <ShieldCheck size={20} />
                  </div>
                  <div>
                    <h4 className="text-white text-xs font-black uppercase tracking-widest">{item.title}</h4>
                    <p className="text-slate-500 text-[10px] font-bold mt-1">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT PANEL: Login Form */}
        <div className="p-10 md:p-20 flex flex-col justify-center relative bg-white">
          <div className="max-w-md mx-auto w-full space-y-10">
            <div>
              <p className="text-sky-500 text-[10px] font-black uppercase tracking-[0.3em] mb-3">Authentication Protocol</p>
              <h3 className="text-4xl font-black text-slate-900 uppercase tracking-tighter leading-none">Sign In</h3>
              <p className="text-slate-400 text-sm font-bold mt-4">Provide your credentials to access the clinical workspace.</p>
            </div>

            {error && (
              <div className="bg-rose-50 border border-rose-100 text-rose-500 p-4 rounded-2xl text-xs font-bold flex items-center gap-3 animate-shake">
                <span>⚠️ {error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Email Identifier</label>
                <div className={`flex items-center gap-4 px-6 py-5 bg-slate-50 border rounded-2xl transition-all ${focused === "email" ? "border-sky-500 ring-4 ring-sky-500/5 bg-white" : "border-slate-100"}`}>
                  <Mail size={18} className={focused === "email" ? "text-sky-500" : "text-slate-400"} />
                  <input
                    className="bg-transparent border-none outline-none w-full text-sm font-bold text-slate-900 placeholder:text-slate-300"
                    type="email"
                    name="email"
                    placeholder="john@sync.md"
                    value={formData.email}
                    onChange={handleChange}
                    onFocus={() => setFocused("email")}
                    onBlur={() => setFocused("")}
                    required
                    autoComplete="email"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center px-1">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Security Key</label>
                  <Link to="/auth/forgot-password" size="small" className="text-[9px] font-black uppercase tracking-widest text-sky-500 hover:underline">
                    Recover?
                  </Link>
                </div>
                <div className={`flex items-center gap-4 px-6 py-5 bg-slate-50 border rounded-2xl transition-all ${focused === "password" ? "border-sky-500 ring-4 ring-sky-500/5 bg-white" : "border-slate-100"}`}>
                  <Lock size={18} className={focused === "password" ? "text-sky-500" : "text-slate-400"} />
                  <input
                    className="bg-transparent border-none outline-none w-full text-sm font-bold text-slate-900 placeholder:text-slate-300"
                    type="password"
                    name="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    onFocus={() => setFocused("password")}
                    onBlur={() => setFocused("")}
                    required
                    autoComplete="current-password"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-slate-900 text-white h-16 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-sky-500 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 shadow-xl shadow-slate-200 mt-4"
              >
                {loading ? "Verifying..." : <>Authorize Session <ArrowRight size={18} /></>}
              </button>
            </form>

            <div className="pt-8 border-t border-slate-100">
              <p className="text-center text-xs font-bold text-slate-400">
                New to the platform?{" "}
                <Link to="/patient/signup" className="text-sky-500 hover:underline">
                  Establish Identity
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;


