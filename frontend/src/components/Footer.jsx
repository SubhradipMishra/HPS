import React from "react";

const Footer = () => {
  return (
    <footer className="relative bg-gradient-to-b from-white to-red-50 px-8 md:px-16 py-20 border-t border-red-100 overflow-hidden">

      {/* Soft Glow Background */}
      <div className="absolute w-80 h-80 bg-red-200 rounded-full blur-3xl opacity-30 top-0 left-0"></div>
      <div className="absolute w-80 h-80 bg-pink-200 rounded-full blur-3xl opacity-30 bottom-0 right-0"></div>

      <div className="relative z-10 max-w-6xl mx-auto grid md:grid-cols-4 gap-12">

        {/* Logo + About */}
        <div>
          <h3 className="text-2xl font-bold bg-gradient-to-r from-red-500 to-pink-500 bg-clip-text text-transparent">
            CareSync
          </h3>

          <p className="text-gray-600 mt-4 leading-relaxed">
            A modern hospital management system that helps hospitals manage
            patients, appointments, and billing in one powerful platform.
          </p>

          {/* Social Icons (Pure SVG) */}
          <div className="flex gap-4 mt-6">

            {/* Facebook */}
            <div className="w-11 h-11 flex items-center justify-center rounded-full bg-white shadow-md hover:shadow-xl hover:-translate-y-1 transition cursor-pointer">
              <svg
                className="w-5 h-5 text-red-500"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M22 12.07C22 6.48 17.52 2 12 2S2 6.48 2 12.07c0 5.02 3.66 9.18 8.44 9.93v-7.03H7.9v-2.9h2.54V9.85c0-2.5 1.48-3.88 3.75-3.88 1.08 0 2.21.2 2.21.2v2.44h-1.25c-1.23 0-1.61.77-1.61 1.56v1.88h2.74l-.44 2.9h-2.3V22c4.78-.75 8.44-4.91 8.44-9.93z" />
              </svg>
            </div>

            {/* Twitter */}
            <div className="w-11 h-11 flex items-center justify-center rounded-full bg-white shadow-md hover:shadow-xl hover:-translate-y-1 transition cursor-pointer">
              <svg
                className="w-5 h-5 text-red-500"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M22 5.8c-.8.4-1.6.6-2.5.8.9-.6 1.6-1.4 1.9-2.4-.9.5-1.9.9-3 1.1A4.1 4.1 0 0015.5 4c-2.3 0-4.1 1.9-4.1 4.1 0 .3 0 .7.1 1C7.7 8.9 4.6 7.2 2.5 4.6c-.4.7-.6 1.4-.6 2.2 0 1.5.8 2.9 2 3.7-.7 0-1.4-.2-2-.5v.1c0 2.1 1.5 3.9 3.5 4.3-.4.1-.8.2-1.3.2-.3 0-.6 0-.9-.1.6 1.9 2.4 3.3 4.5 3.3A8.3 8.3 0 012 19.5 11.7 11.7 0 008.3 21c7.5 0 11.6-6.3 11.6-11.7v-.5c.8-.6 1.5-1.4 2.1-2.3z" />
              </svg>
            </div>

            {/* LinkedIn */}
            <div className="w-11 h-11 flex items-center justify-center rounded-full bg-white shadow-md hover:shadow-xl hover:-translate-y-1 transition cursor-pointer">
              <svg
                className="w-5 h-5 text-red-500"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M4.98 3.5C4.98 4.9 3.86 6 2.49 6S0 4.9 0 3.5 1.12 1 2.49 1 4.98 2.1 4.98 3.5zM.5 8h4V24h-4V8zm7.5 0h3.8v2.2h.1c.5-1 1.9-2.2 3.9-2.2 4.2 0 5 2.8 5 6.3V24h-4v-7.5c0-1.8 0-4.1-2.5-4.1s-2.9 2-2.9 4V24h-4V8z" />
              </svg>
            </div>

            {/* Email */}
            <div className="w-11 h-11 flex items-center justify-center rounded-full bg-white shadow-md hover:shadow-xl hover:-translate-y-1 transition cursor-pointer">
              <svg
                className="w-5 h-5 text-red-500"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path d="M4 4h16v16H4z" />
                <path d="M22 6l-10 7L2 6" />
              </svg>
            </div>

          </div>
        </div>

        {/* Product Links */}
        <div>
          <h4 className="font-semibold text-gray-900 mb-5">Product</h4>

          <ul className="space-y-3 text-gray-600">
            {["Features", "How It Works", "Dashboard", "Pricing"].map(
              (item, index) => (
                <li
                  key={index}
                  className="relative w-fit cursor-pointer hover:text-red-500 transition"
                >
                  {item}
                  <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-red-500 transition-all duration-300 hover:w-full"></span>
                </li>
              )
            )}
          </ul>
        </div>

        {/* Company Links */}
        <div>
          <h4 className="font-semibold text-gray-900 mb-5">Company</h4>

          <ul className="space-y-3 text-gray-600">
            {["About", "Contact", "Careers", "Support"].map((item, index) => (
              <li
                key={index}
                className="relative w-fit cursor-pointer hover:text-red-500 transition"
              >
                {item}
                <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-red-500 transition-all duration-300 hover:w-full"></span>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="font-semibold text-gray-900 mb-5">Contact</h4>

          <p className="text-gray-600 hover:text-red-500 transition cursor-pointer">
            support@caresync.com
          </p>

          <p className="text-gray-600 mt-3 hover:text-red-500 transition cursor-pointer">
            +91 98765 43210
          </p>

          <p className="text-gray-600 mt-3">New Delhi, India</p>
        </div>

      </div>

      {/* Bottom Line */}
      <div className="border-t border-red-100 mt-14 pt-6 text-center text-gray-500">
        © 2026 CareSync. All rights reserved.
      </div>

    </footer>
  );
};

export default Footer;