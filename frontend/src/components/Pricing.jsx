import React from "react";
import { Button } from "antd";
import { CheckOutlined, CloseOutlined } from "@ant-design/icons";

const Pricing = () => {
  return (
    <section id="pricing" className="py-28 px-6 md:px-12 bg-gradient-to-b from-white to-red-50">

      {/* Heading */}
      <div className="text-center max-w-3xl mx-auto mb-20">
        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
          Pricing that scales with your hospital
        </h2>
        <p className="text-gray-600 text-lg">
          Start small and upgrade anytime. Perfect for clinics, startups, and enterprise hospitals.
        </p>
      </div>

      {/* Pricing Cards */}
      <div className="grid md:grid-cols-3 gap-10 max-w-6xl mx-auto">

        {/* BASIC */}
        <div className="bg-white p-10 border border-gray-200 transition hover:-translate-y-2">

          <h3 className="text-xl font-semibold mb-6 text-gray-800">Basic Plan</h3>

          <p className="text-5xl font-bold mb-10 text-gray-900">
            ₹999
            <span className="text-lg font-medium text-gray-500"> /month</span>
          </p>

          <ul className="space-y-4 mb-12 text-gray-700">

            <li className="flex items-center gap-3">
              <CheckOutlined className="text-green-500" /> Patient Registration
            </li>

            <li className="flex items-center gap-3">
              <CheckOutlined className="text-green-500" /> Appointment Booking
            </li>

            <li className="flex items-center gap-3">
              <CheckOutlined className="text-green-500" /> Basic Dashboard
            </li>

            <li className="flex items-center gap-3">
              <CheckOutlined className="text-green-500" /> Email Support
            </li>

            <li className="flex items-center gap-3 text-gray-400">
              <CloseOutlined className="text-red-400" /> Advanced Reports
            </li>

            <li className="flex items-center gap-3 text-gray-400">
              <CloseOutlined className="text-red-400" /> Doctor Panel
            </li>

            <li className="flex items-center gap-3 text-gray-400">
              <CloseOutlined className="text-red-400" /> Multi Branch Support
            </li>

          </ul>

          <Button className="w-full h-12 border border-gray-300 text-gray-800 font-medium">
            Get Started
          </Button>
        </div>


        {/* PRO */}
        <div className="bg-gradient-to-b from-red-500 to-pink-500 text-white p-10 relative transition hover:-translate-y-2">

          <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-white text-red-500 px-5 py-1 text-sm font-semibold">
            MOST POPULAR
          </div>

          <h3 className="text-xl font-semibold mb-6">Pro Plan</h3>

          <p className="text-5xl font-bold mb-10">
            ₹1999
            <span className="text-lg font-medium opacity-80"> /month</span>
          </p>

          <ul className="space-y-4 mb-12">

            <li className="flex items-center gap-3">
              <CheckOutlined /> Full Patient Management
            </li>

            <li className="flex items-center gap-3">
              <CheckOutlined /> Doctor Panel
            </li>

            <li className="flex items-center gap-3">
              <CheckOutlined /> Advanced Reports
            </li>

            <li className="flex items-center gap-3">
              <CheckOutlined /> Analytics Dashboard
            </li>

            <li className="flex items-center gap-3">
              <CheckOutlined /> Priority Support
            </li>

            <li className="flex items-center gap-3 text-white/60">
              <CloseOutlined /> Multi Hospital Support
            </li>

          </ul>

          <Button className="w-full h-12 bg-white text-red-500 border-none font-semibold">
            Choose Plan
          </Button>
        </div>


        {/* ENTERPRISE */}
        <div className="bg-white p-10 border border-gray-200 transition hover:-translate-y-2">

          <h3 className="text-xl font-semibold mb-6 text-gray-800">Enterprise</h3>

          <p className="text-5xl font-bold mb-10 text-gray-900">
            Custom
          </p>

          <ul className="space-y-4 mb-12 text-gray-700">

            <li className="flex items-center gap-3">
              <CheckOutlined className="text-green-500" /> Multi Hospital Support
            </li>

            <li className="flex items-center gap-3">
              <CheckOutlined className="text-green-500" /> AI Reports
            </li>

            <li className="flex items-center gap-3">
              <CheckOutlined className="text-green-500" /> Dedicated Manager
            </li>

            <li className="flex items-center gap-3">
              <CheckOutlined className="text-green-500" /> 24/7 Support
            </li>

            <li className="flex items-center gap-3">
              <CheckOutlined className="text-green-500" /> Custom Integrations
            </li>

          </ul>

          <Button className="w-full h-12 border border-gray-300 text-gray-800 font-medium">
            Contact Sales
          </Button>
        </div>

      </div>
    </section>
  );
};

export default Pricing;