import React from "react";

const DashboardPreview = () => {
  return (
    <section
      id="dashboard"
      className="relative px-8 md:px-16 py-28 bg-gradient-to-br from-white via-red-50 to-pink-100 overflow-hidden"
    >
      {/* Background Glow */}
      <div className="absolute w-80 h-80 bg-red-200 rounded-full blur-3xl opacity-30 top-10 left-10"></div>
      <div className="absolute w-96 h-96 bg-pink-200 rounded-full blur-3xl opacity-30 bottom-10 right-10"></div>

      <div className="relative z-10">

        {/* Heading */}
        <div className="text-center max-w-3xl mx-auto">
          <p className="text-red-500 font-semibold tracking-wide mb-3">
            Dashboard Preview
          </p>

          <h2 className="text-3xl md:text-5xl font-bold leading-tight text-gray-900">
            A Powerful Dashboard Built for
            <br />
            <span className="bg-gradient-to-r from-red-500 to-pink-500 bg-clip-text text-transparent">
              Modern Hospitals
            </span>
          </h2>

          <p className="text-gray-600 mt-6 text-lg">
            Manage patients, appointments, doctors, and billing from one
            modern and easy-to-use dashboard.
          </p>
        </div>

        {/* Dashboard Mock UI */}
        <div className="mt-20 max-w-6xl mx-auto bg-white/70 backdrop-blur-xl p-8 md:p-12 rounded-3xl shadow-2xl">

          {/* Top Stats */}
          <div className="grid md:grid-cols-4 gap-6">

            <div className="bg-white p-6 rounded-2xl shadow-md">
              <h4 className="text-gray-500 text-sm">Total Patients</h4>
              <p className="text-2xl font-bold text-gray-900 mt-2">1,245</p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-md">
              <h4 className="text-gray-500 text-sm">Appointments Today</h4>
              <p className="text-2xl font-bold text-gray-900 mt-2">86</p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-md">
              <h4 className="text-gray-500 text-sm">Doctors Available</h4>
              <p className="text-2xl font-bold text-gray-900 mt-2">24</p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-md">
              <h4 className="text-gray-500 text-sm">Revenue Today</h4>
              <p className="text-2xl font-bold text-gray-900 mt-2">₹45,200</p>
            </div>

          </div>

          {/* Table + Right Cards */}
          <div className="grid md:grid-cols-3 gap-8 mt-10">

            {/* Patient Table */}
            <div className="md:col-span-2 bg-white p-6 rounded-2xl shadow-md">
              <h4 className="font-semibold text-gray-900 mb-4">
                Recent Patients
              </h4>

              <div className="space-y-4">

                <div className="flex justify-between items-center border-b pb-2">
                  <p className="text-gray-700">Rahul Sharma</p>
                  <p className="text-gray-500 text-sm">General Checkup</p>
                </div>

                <div className="flex justify-between items-center border-b pb-2">
                  <p className="text-gray-700">Priya Verma</p>
                  <p className="text-gray-500 text-sm">Dental</p>
                </div>

                <div className="flex justify-between items-center border-b pb-2">
                  <p className="text-gray-700">Amit Singh</p>
                  <p className="text-gray-500 text-sm">Cardiology</p>
                </div>

                <div className="flex justify-between items-center">
                  <p className="text-gray-700">Sneha Patel</p>
                  <p className="text-gray-500 text-sm">Eye Specialist</p>
                </div>

              </div>
            </div>

            {/* Right Side Cards */}
            <div className="space-y-6">

              <div className="bg-white p-6 rounded-2xl shadow-md">
                <h4 className="text-gray-500 text-sm">Doctor Available</h4>
                <p className="text-xl font-semibold mt-2">Dr. Ankit Mehta</p>
                <p className="text-gray-500 text-sm">Cardiologist</p>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-md">
                <h4 className="text-gray-500 text-sm">Next Appointment</h4>
                <p className="text-xl font-semibold mt-2">11:30 AM</p>
                <p className="text-gray-500 text-sm">Rahul Sharma</p>
              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
};

export default DashboardPreview;