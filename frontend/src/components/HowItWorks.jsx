import React from "react";

const HowItWorks = () => {
  return (
    <section
      id="how-it-works"
      className="relative px-8 md:px-16 py-24 bg-gradient-to-b from-white to-red-50 overflow-hidden"
    >
      {/* Background Glow */}
      <div className="absolute w-80 h-80 bg-red-200 rounded-full blur-3xl opacity-30 top-10 left-10"></div>
      <div className="absolute w-96 h-96 bg-pink-200 rounded-full blur-3xl opacity-30 bottom-10 right-10"></div>

      <div className="relative z-10">

        {/* Heading */}
        <div className="text-center max-w-3xl mx-auto">
          <p className="text-red-500 font-semibold tracking-wide mb-3">
            How CareSync Works
          </p>

          <h2 className="text-3xl md:text-5xl font-bold leading-tight text-gray-900">
            Manage Your Hospital in
            <br />
            <span className="bg-gradient-to-r from-red-500 to-pink-500 bg-clip-text text-transparent">
              4 Simple Steps
            </span>
          </h2>

          <p className="text-gray-600 mt-6 text-lg">
            From patient registration to billing, everything is fast,
            simple, and fully digital.
          </p>
        </div>

        {/* Steps */}
        <div className="grid md:grid-cols-4 gap-8 mt-16">

          {/* Step 1 */}
          <div className="bg-white/70 backdrop-blur-lg p-8 rounded-3xl shadow-lg hover:shadow-2xl transition transform hover:-translate-y-2 text-center">
            <div className="w-14 h-14 mx-auto flex items-center justify-center rounded-full bg-gradient-to-r from-red-500 to-pink-500 text-white text-xl font-bold">
              1
            </div>

            <h3 className="text-xl font-semibold mt-6">Add Patients</h3>

            <p className="text-gray-600 mt-3">
              Register patient details quickly and store medical history
              securely in one place.
            </p>
          </div>

          {/* Step 2 */}
          <div className="bg-white/70 backdrop-blur-lg p-8 rounded-3xl shadow-lg hover:shadow-2xl transition transform hover:-translate-y-2 text-center">
            <div className="w-14 h-14 mx-auto flex items-center justify-center rounded-full bg-gradient-to-r from-red-500 to-pink-500 text-white text-xl font-bold">
              2
            </div>

            <h3 className="text-xl font-semibold mt-6">Book Appointments</h3>

            <p className="text-gray-600 mt-3">
              Schedule appointments easily with doctors using a fast and
              smart booking system.
            </p>
          </div>

          {/* Step 3 */}
          <div className="bg-white/70 backdrop-blur-lg p-8 rounded-3xl shadow-lg hover:shadow-2xl transition transform hover:-translate-y-2 text-center">
            <div className="w-14 h-14 mx-auto flex items-center justify-center rounded-full bg-gradient-to-r from-red-500 to-pink-500 text-white text-xl font-bold">
              3
            </div>

            <h3 className="text-xl font-semibold mt-6">Manage Records</h3>

            <p className="text-gray-600 mt-3">
              Store prescriptions, reports, and medical records digitally
              for quick and secure access.
            </p>
          </div>

          {/* Step 4 */}
          <div className="bg-white/70 backdrop-blur-lg p-8 rounded-3xl shadow-lg hover:shadow-2xl transition transform hover:-translate-y-2 text-center">
            <div className="w-14 h-14 mx-auto flex items-center justify-center rounded-full bg-gradient-to-r from-red-500 to-pink-500 text-white text-xl font-bold">
              4
            </div>

            <h3 className="text-xl font-semibold mt-6">Generate Billing</h3>

            <p className="text-gray-600 mt-3">
              Automatically create invoices and track payments with smart
              analytics and reports.
            </p>
          </div>

        </div>

      </div>
    </section>
  );
};

export default HowItWorks;