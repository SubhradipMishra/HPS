
import React, { useState } from "react";

const faqs = [
  {
    question: "What is CareSync?",
    answer:
      "CareSync is a modern hospital management system that helps hospitals manage patients, appointments, doctors, and billing in one easy-to-use platform.",
  },
  {
    question: "Is CareSync suitable for small clinics?",
    answer:
      "Yes. CareSync is designed for both small clinics and large hospitals. It is simple to use and does not require technical knowledge.",
  },
  {
    question: "Can I manage patient records digitally?",
    answer:
      "Yes. You can store prescriptions, reports, medical history, and patient information securely in one place.",
  },
  {
    question: "Does CareSync support appointment booking?",
    answer:
      "Yes. You can easily book, update, and manage appointments using the smart appointment system.",
  },
  {
    question: "Is the platform secure?",
    answer:
      "Yes. CareSync stores all data securely and ensures patient information is protected at all times.",
  },
];

const FAQSection = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section className="px-8 md:px-16 py-28 bg-gradient-to-b from-white to-red-50">

      {/* Heading */}
      <div className="text-center max-w-3xl mx-auto">
        <p className="text-red-500 font-semibold tracking-wide mb-3">
          FAQ
        </p>

        <h2 className="text-3xl md:text-5xl font-bold leading-tight text-gray-900">
          Frequently Asked
          <br />
          <span className="bg-gradient-to-r from-red-500 to-pink-500 bg-clip-text text-transparent">
            Questions
          </span>
        </h2>

        <p className="text-gray-600 mt-6 text-lg">
          Everything you need to know about CareSync before getting started.
        </p>
      </div>

      {/* FAQ Items */}
      <div className="max-w-4xl mx-auto mt-16 space-y-6">

        {faqs.map((faq, index) => (
          <div
            key={index}
            className="bg-white p-6 md:p-8 rounded-2xl shadow-md border border-red-100"
          >
            <button
              onClick={() => toggleFAQ(index)}
              className="w-full flex justify-between items-center text-left"
            >
              <h3 className="text-lg font-semibold text-gray-900">
                {faq.question}
              </h3>

              <span className="text-red-500 text-xl font-bold">
                {activeIndex === index ? "-" : "+"}
              </span>
            </button>

            {activeIndex === index && (
              <p className="text-gray-600 mt-4 leading-relaxed">
                {faq.answer}
              </p>
            )}
          </div>
        ))}

      </div>
    </section>
  );
};

export default FAQSection;