import React from "react";
import { Button } from "antd";

const Hero = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-white via-red-50 to-pink-100 py-24 px-6 md:px-16">

      {/* Background Glow Effects */}
      <div className="absolute w-80 h-80 bg-red-300 rounded-full blur-3xl opacity-30 top-10 left-10"></div>
      <div className="absolute w-[450px] h-[450px] bg-pink-300 rounded-full blur-3xl opacity-30 bottom-0 right-0"></div>

      <div className="grid md:grid-cols-2 gap-16 items-center relative z-10">

        {/* LEFT SIDE */}
        <div>

          {/* Glass Tagline */}
          <div className="inline-block mb-6">
            <span className="bg-white/50 backdrop-blur-xl px-6 py-3 rounded-full border border-white/40 shadow-lg text-red-500 font-semibold tracking-wide text-sm hover:scale-105 transition">
              ✨ Next-Gen Smart Hospital Platform
            </span>
          </div>

          {/* Gradient Heading */}
          <h1 className="text-4xl md:text-6xl font-bold leading-tight">
            <span className="bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              Smart Healthcare
            </span>
            <br />
            <span className="bg-gradient-to-r from-red-500 to-pink-500 bg-clip-text text-transparent">
              Management Platform
            </span>
          </h1>

          {/* Description */}
          <p className="mt-6 text-lg text-gray-600 leading-relaxed max-w-xl">
            CareSync helps hospitals manage patients, appointments, billing,
            doctors, and medical records in one modern cloud platform.
            Faster workflow, better care, and zero paperwork.
          </p>

          {/* Stylish Buttons */}
          <div className="mt-10 flex flex-wrap gap-5">

            {/* Primary Button */}
            <Button
              size="large"
              className="bg-gradient-to-r from-red-500 to-pink-500 border-none text-white rounded-2xl px-10 h-14 font-semibold shadow-lg hover:scale-105 transition"
            >
              Book Free Demo
            </Button>

            {/* Glass Button */}
            <Button
              size="large"
              className="bg-white/60 backdrop-blur-lg border border-white/40 rounded-2xl px-10 h-14 font-semibold text-gray-700 hover:scale-105 transition shadow-md"
            >
              Explore Features
            </Button>

          </div>

          {/* Feature Tags */}
          <div className="mt-10 flex flex-wrap gap-4 text-sm text-gray-600">
            <span className="bg-white shadow-md px-4 py-2 rounded-full">
              ✔ Patient Management
            </span>
            <span className="bg-white shadow-md px-4 py-2 rounded-full">
              ✔ Appointment Scheduling
            </span>
            <span className="bg-white shadow-md px-4 py-2 rounded-full">
              ✔ Smart Billing System
            </span>
          </div>
        </div>

        {/* RIGHT SIDE IMAGE (blended with background) */}
        <div className="relative">

          {/* Glow Behind Image */}
          <div className="absolute -z-10 w-full h-full bg-gradient-to-br from-red-300 to-pink-300 rounded-full blur-3xl opacity-30"></div>

          <img
            src="https://images.unsplash.com/photo-1588776814546-1ffcf47267a5"
            alt="Hospital Management"
            className="w-full h-[450px] object-cover rounded-3xl shadow-2xl"
          />
        </div>

      </div>
    </section>
  );
};

export default Hero;