import React from "react";

const CTASection = () => {
  return (
    <section className="px-8 md:px-16 py-28 bg-gradient-to-b from-white to-red-50">

      <div className="max-w-5xl mx-auto text-center">

        {/* Clean Card */}
        <div className="bg-white p-12 md:p-16 rounded-3xl shadow-lg border border-red-100">

          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 leading-tight">
            Ready to Simplify Your
            <br />
            Hospital Management?
          </h2>

          <p className="text-gray-600 mt-6 text-lg max-w-2xl mx-auto">
            CareSync helps hospitals manage patients, appointments, doctors,
            and billing in one modern and easy-to-use platform.
          </p>

          {/* Buttons */}
          <div className="flex flex-col md:flex-row justify-center gap-5 mt-10">

            <button className="bg-red-500 text-white font-semibold px-8 py-4 rounded-xl shadow-md hover:bg-red-600 transition">
              Get Started Free
            </button>

            <button className="border border-red-500 text-red-500 font-semibold px-8 py-4 rounded-xl hover:bg-red-50 transition">
              Book a Demo
            </button>

          </div>

        </div>

      </div>
    </section>
  );
};

export default CTASection;