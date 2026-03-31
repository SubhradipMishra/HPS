import React from "react";
import { UserOutlined, CalendarOutlined, FileTextOutlined, HeartOutlined } from "@ant-design/icons";

const Features = () => {
  return (
    <section
      id="features"
      className="relative py-24 px-6 md:px-16 bg-gradient-to-br from-white via-red-50 to-pink-100 overflow-hidden"
    >

      {/* Background Glow */}
      <div className="absolute w-80 h-80 bg-red-300 rounded-full blur-3xl opacity-30 top-10 left-10"></div>
      <div className="absolute w-96 h-96 bg-pink-300 rounded-full blur-3xl opacity-30 bottom-10 right-10"></div>

      <div className="grid md:grid-cols-2 gap-16 items-center relative z-10">

        {/* LEFT SIDE CONTENT */}
        <div>
          <p className="text-red-500 font-semibold tracking-wide mb-3">
            Powerful Features
          </p>

          <h2 className="text-3xl md:text-5xl font-bold leading-tight text-gray-900">
            Everything You Need in a
            <br />
            <span className="bg-gradient-to-r from-red-500 to-pink-500 bg-clip-text text-transparent">
              Smart Hospital System
            </span>
          </h2>

          <p className="text-gray-600 mt-6 text-lg max-w-xl leading-relaxed">
            CareSync provides a complete hospital management solution that
            helps doctors, staff, and patients stay connected with a fast
            and secure platform.
          </p>

          {/* Small Points */}
          <div className="mt-8 space-y-4 text-gray-700">
            <p>✔ Manage patients and medical records in one place</p>
            <p>✔ Smart appointment booking and scheduling</p>
            <p>✔ Secure digital prescriptions and reports</p>
            <p>✔ Automated billing and smart analytics</p>
          </div>
        </div>

        {/* RIGHT SIDE FEATURE CARDS */}
        <div className="grid sm:grid-cols-2 gap-6">

          {/* Feature 1 */}
          <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-2xl transition transform hover:-translate-y-1">
            <div className="flex gap-4">
              <div className="bg-gradient-to-r from-red-500 to-pink-500 text-white p-3 rounded-xl text-xl">
                <UserOutlined />
              </div>

              <div>
                <h3 className="text-lg font-semibold">Patient Management</h3>
                <p className="text-gray-600 mt-1 text-sm">
                  Store patient records securely and access them anytime.
                </p>
              </div>
            </div>
          </div>

          {/* Feature 2 */}
          <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-2xl transition transform hover:-translate-y-1">
            <div className="flex gap-4">
              <div className="bg-gradient-to-r from-red-500 to-pink-500 text-white p-3 rounded-xl text-xl">
                <CalendarOutlined />
              </div>

              <div>
                <h3 className="text-lg font-semibold">Smart Appointments</h3>
                <p className="text-gray-600 mt-1 text-sm">
                  Easy scheduling for doctors and patients.
                </p>
              </div>
            </div>
          </div>

          {/* Feature 3 */}
          <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-2xl transition transform hover:-translate-y-1">
            <div className="flex gap-4">
              <div className="bg-gradient-to-r from-red-500 to-pink-500 text-white p-3 rounded-xl text-xl">
                <FileTextOutlined />
              </div>

              <div>
                <h3 className="text-lg font-semibold">Medical Records</h3>
                <p className="text-gray-600 mt-1 text-sm">
                  Digital prescriptions and patient reports anytime.
                </p>
              </div>
            </div>
          </div>

          {/* Feature 4 */}
          <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-2xl transition transform hover:-translate-y-1">
            <div className="flex gap-4">
              <div className="bg-gradient-to-r from-red-500 to-pink-500 text-white p-3 rounded-xl text-xl">
                <HeartOutlined />
              </div>

              <div>
                <h3 className="text-lg font-semibold">Billing & Reports</h3>
                <p className="text-gray-600 mt-1 text-sm">
                  Generate invoices and track revenue easily.
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Features;