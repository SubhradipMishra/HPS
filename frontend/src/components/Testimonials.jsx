import React from "react";

const testimonials = [
  {
    name: "Dr. Rahul Sharma",
    role: "Cardiologist",
    review:
      "CareSync has completely changed how we manage patient records. Everything is faster and much easier to handle now.",
  },
  {
    name: "Dr. Priya Verma",
    role: "Dental Specialist",
    review:
      "Appointment booking is now super smooth. Our staff saves a lot of time every single day.",
  },
  {
    name: "Dr. Amit Singh",
    role: "General Physician",
    review:
      "The billing and patient management system works perfectly. It feels like a real enterprise software.",
  },
  {
    name: "Dr. Sneha Patel",
    role: "Eye Specialist",
    review:
      "The dashboard is very clean and easy to use. Even new staff members learn it in just a few minutes.",
  },
  {
    name: "Dr. Arjun Mehta",
    role: "Orthopedic Doctor",
    review:
      "We replaced our old hospital software with CareSync and the difference is huge. Very modern and fast.",
  },
  {
    name: "Dr. Neha Kapoor",
    role: "Gynecologist",
    review:
      "Patient history tracking is amazing. Everything is organized in one place.",
  },
];

const Testimonials = () => {
  return (
    <section className="px-8 md:px-16 py-28 bg-gradient-to-b from-white via-red-50 to-pink-100 overflow-hidden">

      {/* Heading */}
      <div className="text-center max-w-3xl mx-auto">
        <p className="text-red-500 font-semibold tracking-wide mb-3">
          Testimonials
        </p>

        <h2 className="text-3xl md:text-5xl font-bold leading-tight text-gray-900">
          Doctors Trust
          <br />
          <span className="bg-gradient-to-r from-red-500 to-pink-500 bg-clip-text text-transparent">
            CareSync Every Day
          </span>
        </h2>

        <p className="text-gray-600 mt-6 text-lg">
          Hospitals and clinics are already using CareSync to manage patients,
          appointments, and billing.
        </p>
      </div>

      {/* Scroll Section */}
      <div className="mt-16 overflow-x-auto no-scrollbar">
        <div className="flex gap-8 min-w-max">

          {testimonials.map((item, index) => (
            <div
              key={index}
              className="w-72 h-72 bg-white/80 backdrop-blur-lg p-8 rounded-2xl shadow-lg hover:shadow-2xl transition transform hover:-translate-y-2 flex flex-col justify-between"
            >
              <p className="text-gray-700 leading-relaxed text-sm">
                {item.review}
              </p>

              <div className="flex items-center gap-4 mt-6">
                <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-pink-500 rounded-full"></div>

                <div>
                  <h4 className="font-semibold text-gray-900 text-sm">
                    {item.name}
                  </h4>
                  <p className="text-xs text-gray-500">{item.role}</p>
                </div>
              </div>
            </div>
          ))}

        </div>
      </div>
    </section>
  );
};

export default Testimonials;