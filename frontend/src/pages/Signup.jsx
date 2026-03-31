import React, { useState } from "react";
import API from "../api/api";

const PatientSignup = () => {
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
      const res = await API.post("/patient/signup", formData);
      console.log(res.data);
      alert("Welcome to CareSync 🎉 Account created successfully");
    } catch (err) {
        console.log(err.message);
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const inputClass = (name) => `
    w-full bg-transparent border-b-2 px-0 py-3 text-gray-800 placeholder-gray-400
    focus:outline-none transition-all duration-300 text-sm font-medium
    ${focused === name ? "border-pink-500" : "border-gray-200"}
  `;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@300;400;500;600&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        .signup-root {
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

        .two-col {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
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

        .login-link {
          text-align: center;
          margin-top: 24px;
          font-size: 13px;
          color: #9ca3af;
        }

        .login-link a {
          color: #e8365d;
          font-weight: 600;
          cursor: pointer;
          text-decoration: none;
          border-bottom: 1px solid transparent;
          transition: border-color 0.2s;
        }

        .login-link a:hover {
          border-color: #e8365d;
        }

        .divider {
          display: flex;
          align-items: center;
          gap: 12px;
          margin: 28px 0;
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

        .step-dots {
          display: flex;
          gap: 6px;
          margin-bottom: 32px;
        }

        .step-dot {
          height: 4px;
          border-radius: 2px;
          background: #ffd0dc;
          transition: width 0.3s, background 0.3s;
        }

        .step-dot.active {
          background: #e8365d;
          width: 24px;
        }

        .step-dot:not(.active) {
          width: 8px;
        }

        @media (max-width: 768px) {
          .signup-root { grid-template-columns: 1fr; }
          .left-panel { display: none; }
          .right-panel { padding: 32px 24px; }
        }

        select.underline-input {
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%23e8365d' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 4px center;
          padding-right: 24px;
          cursor: pointer;
        }

        input[type="date"].underline-input::-webkit-calendar-picker-indicator {
          opacity: 0.4;
          cursor: pointer;
        }
      `}</style>

      <div className="signup-root">
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
            <div className="step-dots">
              <div className="step-dot active"></div>
              <div className="step-dot"></div>
              <div className="step-dot"></div>
            </div>

            <div className="form-header">
              <p className="form-eyebrow">Get Started Free</p>
              <h2 className="form-title">Create your<br />account</h2>
              <p className="form-sub">Join CareSync and manage your healthcare digitally</p>
            </div>

            {error && <div className="error-box">⚠ {error}</div>}

            <form onSubmit={handleSubmit}>
              <div className="field-group">
                <label className={`field-label ${focused === "name" ? "active" : ""}`}>Full Name</label>
                <input
                  className="underline-input"
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
                />
              </div>

              <div className="field-group">
                <label className={`field-label ${focused === "mobileNumber" ? "active" : ""}`}>Mobile Number</label>
                <input
                  className="underline-input"
                  type="text"
                  name="mobileNumber"
                  placeholder="+91 98765 43210"
                  value={formData.mobileNumber}
                  onChange={handleChange}
                  onFocus={() => setFocused("mobileNumber")}
                  onBlur={() => setFocused("")}
                  required
                />
              </div>

              <div className="field-group">
                <label className={`field-label ${focused === "password" ? "active" : ""}`}>Password</label>
                <input
                  className="underline-input"
                  type="password"
                  name="password"
                  placeholder="Min. 8 characters"
                  value={formData.password}
                  onChange={handleChange}
                  onFocus={() => setFocused("password")}
                  onBlur={() => setFocused("")}
                  required
                />
              </div>

              <div className="two-col">
                <div className="field-group">
                  <label className={`field-label ${focused === "gender" ? "active" : ""}`}>Gender</label>
                  <select
                    className="underline-input"
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

                <div className="field-group">
                  <label className={`field-label ${focused === "dob" ? "active" : ""}`}>Date of Birth</label>
                  <input
                    className="underline-input"
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

              <button type="submit" className="submit-btn" disablesd={loading}>
                {loading ? "Creating your account..." : "Join CareSync →"}
              </button>
            </form>

            <p className="login-link">
              Already have an account? <a href="/login">Login here</a>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default PatientSignup;