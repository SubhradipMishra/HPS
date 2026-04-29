import React, { useContext, useState } from "react";
import API from "../api/api";
import Context from "../util/context";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [focused, setFocused] = useState("");
  const {session,setSession} = useContext(Context) ;
  const navigate = useNavigate() ;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await API.post("/auth/login", { identifier: formData.email, password: formData.password });
      console.log(res.data);

      const sessionData = await API.get("/auth/session")
      setSession(sessionData.data) ;
    
       if(res.data.role=="admin")
        navigate("/admin/dashboard");
       if(res.data.role=="doctor")
        navigate("/doctor/dashboard");
      if(res.data.role=="patient")
        navigate("/patient/dashboard")
    } catch (err) {
      console.log(err.message);
      setError(err.response?.data?.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@300;400;500;600&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        .login-root {
          min-height: 100vh;
          display: grid;
          grid-template-columns: 1fr 1fr;
          font-family: 'DM Sans', sans-serif;
          background: #fff;
        }

        /* ── LEFT PANEL ── */
        .left-panel {
          position: relative;
          background: linear-gradient(145deg, #fff0f3 0%, #ffe4ec 40%, #ffd6e7 100%);
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 60px 64px;
          overflow: hidden;
        }

        .left-panel::before {
          content: '';
          position: absolute;
          top: -120px; right: -120px;
          width: 420px; height: 420px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(255,100,130,0.18) 0%, transparent 70%);
          pointer-events: none;
        }

        .left-panel::after {
          content: '';
          position: absolute;
          bottom: -80px; left: -60px;
          width: 300px; height: 300px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(255,150,180,0.14) 0%, transparent 70%);
          pointer-events: none;
        }

        .badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: white;
          border: 1px solid #ffd0dc;
          border-radius: 100px;
          padding: 6px 16px;
          font-size: 12px;
          font-weight: 600;
          color: #e8365d;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          width: fit-content;
          margin-bottom: 32px;
          box-shadow: 0 2px 12px rgba(232,54,93,0.12);
        }

        .badge-dot {
          width: 7px; height: 7px;
          border-radius: 50%;
          background: #e8365d;
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.4); }
        }

        .brand-title {
          font-family: 'Playfair Display', serif;
          font-size: 62px;
          font-weight: 900;
          line-height: 1.05;
          color: #1a1a2e;
          margin-bottom: 24px;
          letter-spacing: -1px;
        }

        .brand-title span {
          color: #e8365d;
          font-style: italic;
        }

        .brand-desc {
          font-size: 15px;
          color: #6b7280;
          line-height: 1.8;
          max-width: 380px;
          margin-bottom: 48px;
          font-weight: 300;
        }

        .features-list {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .feature-item {
          display: flex;
          align-items: center;
          gap: 16px;
          background: white;
          border-radius: 16px;
          padding: 16px 20px;
          box-shadow: 0 2px 16px rgba(0,0,0,0.06);
          border: 1px solid rgba(255,200,215,0.4);
          transition: transform 0.2s, box-shadow 0.2s;
        }

        .feature-item:hover {
          transform: translateX(6px);
          box-shadow: 0 6px 24px rgba(232,54,93,0.1);
        }

        .feature-icon {
          width: 44px; height: 44px;
          border-radius: 12px;
          background: linear-gradient(135deg, #e8365d, #ff6b9d);
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
          font-size: 18px;
          box-shadow: 0 4px 12px rgba(232,54,93,0.3);
        }

        .feature-text strong {
          display: block;
          font-size: 13px;
          font-weight: 600;
          color: #1a1a2e;
        }

        .feature-text span {
          font-size: 12px;
          color: #9ca3af;
          font-weight: 300;
        }

        /* ── RIGHT PANEL ── */
        .right-panel {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 48px 40px;
          background: #ffffff;
          position: relative;
        }

        .right-panel::before {
          content: '';
          position: absolute;
          top: 0; right: 0;
          width: 200px; height: 200px;
          background: radial-gradient(circle at top right, rgba(255,220,230,0.5), transparent 70%);
          pointer-events: none;
        }

        .form-card {
          width: 100%;
          max-width: 440px;
          position: relative;
          z-index: 1;
        }

        .form-header {
          margin-bottom: 36px;
        }

        .form-eyebrow {
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #e8365d;
          margin-bottom: 10px;
        }

        .form-title {
          font-family: 'Playfair Display', serif;
          font-size: 34px;
          font-weight: 700;
          color: #1a1a2e;
          line-height: 1.2;
          margin-bottom: 8px;
        }

        .form-sub {
          font-size: 14px;
          color: #9ca3af;
          font-weight: 300;
        }

        .error-box {
          background: #fff1f4;
          border: 1px solid #fecdd3;
          border-left: 3px solid #e8365d;
          color: #e8365d;
          padding: 10px 14px;
          border-radius: 10px;
          font-size: 13px;
          margin-bottom: 20px;
        }

        .field-group {
          margin-bottom: 28px;
          position: relative;
        }

        .field-label {
          display: block;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #9ca3af;
          margin-bottom: 6px;
          transition: color 0.2s;
        }

        .field-label.active {
          color: #e8365d;
        }

        .underline-input {
          width: 100%;
          background: transparent;
          border: none;
          border-bottom: 2px solid #e5e7eb;
          padding: 10px 0;
          font-size: 14px;
          font-family: 'DM Sans', sans-serif;
          color: #1a1a2e;
          font-weight: 500;
          transition: border-color 0.3s;
          outline: none;
          appearance: none;
        }

        .underline-input::placeholder { color: #d1d5db; }

        .underline-input:focus {
          border-color: #e8365d;
        }

        .forgot-row {
          display: flex;
          justify-content: flex-end;
          margin-top: -18px;
          margin-bottom: 28px;
        }

        .forgot-link {
          font-size: 12px;
          color: #e8365d;
          font-weight: 600;
          cursor: pointer;
          text-decoration: none;
          border-bottom: 1px solid transparent;
          transition: border-color 0.2s;
        }

        .forgot-link:hover {
          border-color: #e8365d;
        }

        .submit-btn {
          width: 100%;
          padding: 16px;
          background: linear-gradient(135deg, #e8365d 0%, #ff6b9d 100%);
          color: white;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          font-weight: 700;
          letter-spacing: 0.05em;
          border: none;
          border-radius: 14px;
          cursor: pointer;
          position: relative;
          overflow: hidden;
          box-shadow: 0 8px 32px rgba(232,54,93,0.35);
          transition: transform 0.2s, box-shadow 0.2s, opacity 0.2s;
          margin-top: 8px;
        }

        .submit-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 12px 40px rgba(232,54,93,0.45);
        }

        .submit-btn:active:not(:disabled) {
          transform: translateY(0);
        }

        .submit-btn:disabled {
          opacity: 0.65;
          cursor: not-allowed;
        }

        .submit-btn::before {
          content: '';
          position: absolute;
          top: 0; left: -100%;
          width: 100%; height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent);
          transition: left 0.5s;
        }

        .submit-btn:hover::before {
          left: 100%;
        }

        .signup-link {
          text-align: center;
          margin-top: 24px;
          font-size: 13px;
          color: #9ca3af;
        }

        .signup-link a {
          color: #e8365d;
          font-weight: 600;
          cursor: pointer;
          text-decoration: none;
          border-bottom: 1px solid transparent;
          transition: border-color 0.2s;
        }

        .signup-link a:hover {
          border-color: #e8365d;
        }

        .divider {
          display: flex;
          align-items: center;
          gap: 12px;
          margin: 32px 0;
        }

        .divider-line {
          flex: 1;
          height: 1px;
          background: #f0f0f0;
        }

        .divider-text {
          font-size: 11px;
          color: #d1d5db;
          font-weight: 500;
          white-space: nowrap;
        }

        .welcome-back-pill {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: #fff0f3;
          border: 1px solid #ffd0dc;
          border-radius: 100px;
          padding: 8px 18px;
          font-size: 13px;
          font-weight: 500;
          color: #e8365d;
          margin-bottom: 32px;
        }

        @media (max-width: 768px) {
          .login-root { grid-template-columns: 1fr; }
          .left-panel { display: none; }
          .right-panel { padding: 32px 24px; }
        }
      `}</style>

      <div className="login-root">
        {/* LEFT PANEL */}
        <div className="left-panel">
          <div className="badge">
            <span className="badge-dot"></span>
            Next-Gen Hospital Platform
          </div>

          <h1 className="brand-title">
            Smart<br />
            Health<span>care</span><br />
            Platform
          </h1>

          <p className="brand-desc">
            CareSync helps hospitals manage patients, appointments, billing,
            doctors, and medical records in one modern cloud platform.
            Faster workflow, better care, zero paperwork.
          </p>

          <div className="features-list">
            <div className="feature-item">
              <div className="feature-icon">🧑‍⚕️</div>
              <div className="feature-text">
                <strong>Patient Management</strong>
                <span>Complete health records at your fingertips</span>
              </div>
            </div>
            <div className="feature-item">
              <div className="feature-icon">📅</div>
              <div className="feature-text">
                <strong>Appointment Scheduling</strong>
                <span>Book in seconds, no waiting queues</span>
              </div>
            </div>
            <div className="feature-item">
              <div className="feature-icon">💳</div>
              <div className="feature-text">
                <strong>Smart Billing System</strong>
                <span>Automated invoices and payment tracking</span>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="right-panel">
          <div className="form-card">

            <div className="welcome-back-pill">
              👋 &nbsp;Welcome back
            </div>

            <div className="form-header">
              <p className="form-eyebrow">Patient Portal</p>
              <h2 className="form-title">Sign in to your<br />account</h2>
              <p className="form-sub">Enter your email to access your health dashboard</p>
            </div>

            {error && <div className="error-box">⚠ {error}</div>}

            <form onSubmit={handleSubmit}>
              <div className="field-group">
                <label className={`field-label ${focused === "email" ? "active" : ""}`}>Email Address</label>
                <input
                  className="underline-input"
                  type="email"
                  name="email"
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  onFocus={() => setFocused("email")}
                  onBlur={() => setFocused("")}
                  required
                  autoComplete="email"
                />
              </div>

              <div className="field-group">
                <label className={`field-label ${focused === "password" ? "active" : ""}`}>Password</label>
                <input
                  className="underline-input"
                  type="password"
                  name="password"
                  placeholder="Your password"
                  value={formData.password}
                  onChange={handleChange}
                  onFocus={() => setFocused("password")}
                  onBlur={() => setFocused("")}
                  required
                  autoComplete="current-password"
                />
              </div>

              <div className="forgot-row">
                <a className="forgot-link" href="/auth/forgot-password">Forgot password?</a>
              </div>

              <button type="submit" className="submit-btn" disabled={loading}>
                {loading ? "Signing you in..." : "Sign In to CareSync →"}
              </button>
            </form>

            <div className="divider">
              <div className="divider-line"></div>
              <span className="divider-text">New to CareSync?</span>
              <div className="divider-line"></div>
            </div>

            <p className="signup-link">
              Don't have an account? <a href="/patient/signup">Create one free</a>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;