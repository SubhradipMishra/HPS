import React from "react";

const About = () => {
  return (
    <section
      id="about"
      className="relative px-8 md:px-16 py-24 bg-gradient-to-br from-white via-red-50 to-pink-100 overflow-hidden"
    >
      {/* Background Glow */}
      <div className="absolute w-80 h-80 bg-red-300 rounded-full blur-3xl opacity-30 top-0 left-0"></div>
      <div className="absolute w-96 h-96 bg-pink-300 rounded-full blur-3xl opacity-30 bottom-0 right-0"></div>

      <div className="grid md:grid-cols-2 gap-16 items-center relative z-10">

        {/* LEFT SIDE CONTENT */}
        <div>
          <p className="text-red-500 font-semibold tracking-wide mb-3">
            About CareSync
          </p>

          <h2 className="text-3xl md:text-5xl font-bold leading-tight text-gray-900">
            Built to Make
            <br />
            <span className="bg-gradient-to-r from-red-500 to-pink-500 bg-clip-text text-transparent">
              Hospital Management Simple
            </span>
          </h2>

          <p className="mt-6 text-gray-600 text-lg leading-relaxed max-w-xl">
            CareSync is a smart hospital management platform designed for modern
            healthcare. It helps hospitals manage patients, appointments,
            billing, and medical records in one simple and secure system.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 mt-12">
            <div>
              <h3 className="text-4xl font-bold text-red-500">500+</h3>
              <p className="text-gray-600 mt-2 text-sm">Hospitals Connected</p>
            </div>

            <div>
              <h3 className="text-4xl font-bold text-red-500">1M+</h3>
              <p className="text-gray-600 mt-2 text-sm">Patients Managed</p>
            </div>

            <div>
              <h3 className="text-4xl font-bold text-red-500">24/7</h3>
              <p className="text-gray-600 mt-2 text-sm">System Availability</p>
            </div>
          </div>

          <p className="mt-8 text-gray-500">
            Trusted by doctors, clinics, and hospitals across India.
          </p>
        </div>

        {/* RIGHT SIDE DESIGN ELEMENT (instead of empty space) */}
        <div className="relative flex items-center justify-center">

          {/* Main Glass Card */}
          <div className="bg-white/70 backdrop-blur-xl p-12 rounded-3xl shadow-2xl w-full max-w-md text-center">

            <h3 className="text-2xl font-semibold text-gray-900">
              Modern Healthcare Platform
            </h3>

            <p className="text-gray-600 mt-4">
              A fast, secure, and easy-to-use hospital management system
              designed for modern hospitals and clinics.
            </p>

            {/* Decorative Stats Row */}
            <div className="flex justify-center gap-10 mt-8">
              <div>
                <p className="text-red-500 text-2xl font-bold">99%</p>
                <p className="text-xs text-gray-500">Uptime</p>
              </div>

              <div>
                <p className="text-red-500 text-2xl font-bold">Fast</p>
                <p className="text-xs text-gray-500">Performance</p>
              </div>

              <div>
                <p className="text-red-500 text-2xl font-bold">Secure</p>
                <p className="text-xs text-gray-500">System</p>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};

export default About;