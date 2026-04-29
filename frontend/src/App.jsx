
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import PatientSignup from "./pages/Signup";
import Login from "./pages/Login";
import API from "./api/api";
import { useState } from "react";
import Context from "./util/context";
import { useEffect } from "react";
import PatientDashboard from "./pages/Patient/PatientDashboard";
import PatientAppointments from "./pages/Patient/PatientAppointments";
import PatientProfile from "./pages/Patient/PatientProfile";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import AdminDoctors from "./pages/Admin/AdminDoctors";
import AdminDepartments from "./pages/Admin/AdminDepartments";
import AdminAppointments from "./pages/Admin/AdminAppointments";
import DoctorAppointments from "./pages/Admin/DoctorAppointments";
function App() {
  const [sessionLoading, setSessionLoading] = useState(true);
  const [session, setSession] = useState(null);
  const getSession = async () => {
    try {
      setSessionLoading(true);
      const { data } = await API.get('/auth/session');
      setSession(data);
    } catch {
      setSession(null);
    } finally {
      setSessionLoading(false);
    }
  };
  useEffect(() => {
    getSession();
  }, []);
  return (
    <Context.Provider value={{ session, setSession, sessionLoading, setSessionLoading }}>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />

          <Route path="/patient/signup" element={<PatientSignup />} />
          <Route path="/login" element={<Login />} />

          <Route path='/patient/dashboard' element={<PatientDashboard />} />
          <Route path='/patient/appointments' element={<PatientAppointments />} />
          <Route path='/patient/profile' element={<PatientProfile />} />

          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/doctors" element ={<AdminDoctors/>} />
          <Route path="/admin/doctors/:doctorId/appointments" element={<DoctorAppointments />} />
          <Route path="/admin/departments" element={<AdminDepartments />} />
          <Route path="/admin/appointments" element={<AdminAppointments />} />
        </Routes>
      </Router>
    </Context.Provider>

  );
}

export default App;
