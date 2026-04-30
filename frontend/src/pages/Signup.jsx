import React, { useState } from "react";
import API from "../api/api";
import { useNavigate, Link } from "react-router-dom";
import { HeartPulse, ArrowRight, User, Mail, Phone, Lock, Calendar, CheckCircle2 } from "lucide-react";

const PatientSignup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobileNumber: "",
    password: "",
    gender: "",
    dob: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [focused, setFocused] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await API.post("/patient/signup", formData);
      alert("Welcome to CareSync 🎉 Account created successfully");
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
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

        {/* LEFT PANEL: Branding & Mission */}
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
                Start Your <br />
                <span className="text-sky-500">Health Journey</span>.
              </h2>
              <p className="text-slate-400 text-lg font-medium leading-relaxed max-w-md">
                Secure your digital medical vault and connect with top-tier healthcare professionals in seconds.
              </p>
            </div>

            <div className="space-y-4 pt-8">
              {[
                { title: "Personal Medical Vault", desc: "Encrypted and accessible 24/7" },
                { title: "Live Specialist Sync", desc: "Instant booking with doctors" },
                { title: "Automated Report Flow", desc: "No more paper record hunting" }
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/5 hover:border-white/10 transition-all">
                  <div className="w-10 h-10 bg-sky-500/20 rounded-xl flex items-center justify-center text-sky-400">
                    <CheckCircle2 size={20} />
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

        {/* RIGHT PANEL: Form */}
        <div className="p-10 md:p-20 flex flex-col justify-center relative bg-white">
          <div className="max-w-md mx-auto w-full space-y-10">
            <div>
              <p className="text-sky-500 text-[10px] font-black uppercase tracking-[0.3em] mb-3">Onboarding v4.0</p>
              <h3 className="text-4xl font-black text-slate-900 uppercase tracking-tighter leading-none">Create Account</h3>
              <p className="text-slate-400 text-sm font-bold mt-4">Fill in your clinical details to initialize your profile.</p>
            </div>

            {error && (
              <div className="bg-rose-50 border border-rose-100 text-rose-500 p-4 rounded-2xl text-xs font-bold flex items-center gap-3 animate-shake">
                <span>⚠️ {error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Full Name</label>
                  <div className={`flex items-center gap-3 px-5 py-4 bg-slate-50 border rounded-2xl transition-all ${focused === "name" ? "border-sky-500 ring-4 ring-sky-500/5 bg-white" : "border-slate-100"}`}>
                    <User size={16} className={focused === "name" ? "text-sky-500" : "text-slate-400"} />
                    <input
                      className="bg-transparent border-none outline-none w-full text-sm font-bold text-slate-900 placeholder:text-slate-300"
                      type="text"
                      name="name"
                      placeholder="John Doe"
                      value={formData.name}
                      onChange={handleChange}
                      onFocus={() => setFocused("name")}
                      onBlur={() => setFocused("")}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Email Address</label>
                  <div className={`flex items-center gap-3 px-5 py-4 bg-slate-50 border rounded-2xl transition-all ${focused === "email" ? "border-sky-500 ring-4 ring-sky-500/5 bg-white" : "border-slate-100"}`}>
                    <Mail size={16} className={focused === "email" ? "text-sky-500" : "text-slate-400"} />
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
                    />
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Mobile Number</label>
                  <div className={`flex items-center gap-3 px-5 py-4 bg-slate-50 border rounded-2xl transition-all ${focused === "mobile" ? "border-sky-500 ring-4 ring-sky-500/5 bg-white" : "border-slate-100"}`}>
                    <Phone size={16} className={focused === "mobile" ? "text-sky-500" : "text-slate-400"} />
                    <input
                      className="bg-transparent border-none outline-none w-full text-sm font-bold text-slate-900 placeholder:text-slate-300"
                      type="text"
                      name="mobileNumber"
                      placeholder="+1 (555) 000-0000"
                      value={formData.mobileNumber}
                      onChange={handleChange}
                      onFocus={() => setFocused("mobile")}
                      onBlur={() => setFocused("")}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Password</label>
                  <div className={`flex items-center gap-3 px-5 py-4 bg-slate-50 border rounded-2xl transition-all ${focused === "password" ? "border-sky-500 ring-4 ring-sky-500/5 bg-white" : "border-slate-100"}`}>
                    <Lock size={16} className={focused === "password" ? "text-sky-500" : "text-slate-400"} />
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
                    />
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Gender</label>
                  <div className={`flex items-center gap-3 px-5 py-4 bg-slate-50 border rounded-2xl transition-all ${focused === "gender" ? "border-sky-500 ring-4 ring-sky-500/5 bg-white" : "border-slate-100"}`}>
                    <select
                      className="bg-transparent border-none outline-none w-full text-sm font-bold text-slate-900 cursor-pointer"
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      onFocus={() => setFocused("gender")}
                      onBlur={() => setFocused("")}
                      required
                    >
                      <option value="">Select</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Date of Birth</label>
                  <div className={`flex items-center gap-3 px-5 py-4 bg-slate-50 border rounded-2xl transition-all ${focused === "dob" ? "border-sky-500 ring-4 ring-sky-500/5 bg-white" : "border-slate-100"}`}>
                    <Calendar size={16} className={focused === "dob" ? "text-sky-500" : "text-slate-400"} />
                    <input
                      className="bg-transparent border-none outline-none w-full text-sm font-bold text-slate-900 cursor-pointer"
                      type="date"
                      name="dob"
                      value={formData.dob}
                      onChange={handleChange}
                      onFocus={() => setFocused("dob")}
                      onBlur={() => setFocused("")}
                      required
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-slate-900 text-white h-16 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-sky-500 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 shadow-xl shadow-slate-200 mt-4"
              >
                {loading ? "Initializing..." : <>Establish Identity <ArrowRight size={18} /></>}
              </button>
            </form>

            <p className="text-center text-xs font-bold text-slate-400">
              Already a member?{" "}
              <Link to="/login" className="text-sky-500 hover:underline">
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientSignup;


