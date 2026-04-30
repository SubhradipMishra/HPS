import React, { useState } from "react";
import { Plus, Minus, HelpCircle } from "lucide-react";

const faqs = [
  {
    question: "What is CureSync Architecture?",
    answer: "CureSync is a cloud-native orchestration platform designed to unify hospital operations, patient records, and scheduling into a single, secure digital ecosystem."
  },
  {
    question: "How does the Personal Medical Vault work?",
    answer: "The vault uses enterprise-grade encryption to store patient records. Only the patient and authorized medical personnel can access or link these records during consultations."
  },
  {
    question: "Can it integrate with existing hospital hardware?",
    answer: "Yes. Our open API architecture allows for seamless integration with most modern lab equipment and imaging systems for automated report synchronization."
  },
  {
    question: "Is the platform HIPAA compliant?",
    answer: "Absolutely. Security is our priority. We maintain full compliance with international healthcare data standards including HIPAA and GDPR."
  }
];

const FAQSection = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  return (
    <section id="faq" className="px-8 md:px-16 py-32 bg-slate-50 relative overflow-hidden border-b border-slate-100">
      <div className="container mx-auto relative z-10">

        {/* Heading */}
        <div className="text-center max-w-3xl mx-auto mb-24">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-sky-600 mb-4">Support Center</p>
          <h2 className="text-5xl md:text-8xl font-black tracking-tight text-slate-900 leading-[0.9] uppercase">
            Common <br />
            <span className="text-sky-500">Inquiries</span>.
          </h2>
        </div>

        {/* FAQ Items */}
        <div className="max-w-4xl mx-auto space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = activeIndex === index;
            return (
              <div key={index} className={`bg-white/40 backdrop-blur-md border transition-all duration-300 rounded-[2rem] overflow-hidden ${isOpen ? "border-sky-500 z-10 shadow-2xl" : "border-white/50 shadow-sm"}`}>
                <button
                  onClick={() => setActiveIndex(isOpen ? null : index)}
                  className="w-full flex justify-between items-center px-10 py-10 text-left group"
                >
                  <div className="flex items-center gap-6">
                    <p className={`text-xs font-black transition-colors ${isOpen ? "text-sky-500" : "text-slate-300"}`}>0{index + 1}.</p>
                    <h3 className={`text-sm font-black uppercase tracking-tight transition-colors ${isOpen ? "text-slate-900" : "text-slate-600 group-hover:text-slate-900"}`}>
                      {faq.question}
                    </h3>
                  </div>
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${isOpen ? "bg-slate-900 text-white rotate-180" : "bg-slate-50 text-slate-400 group-hover:bg-slate-100"}`}>
                    {isOpen ? <Minus size={14} /> : <Plus size={14} />}
                  </div>
                </button>

                <div className={`overflow-hidden transition-all duration-500 ${isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}`}>
                  <div className="px-10 pb-10 pt-2 ml-12">
                    <p className="text-slate-500 text-xs font-bold leading-relaxed border-l-2 border-sky-500 pl-8 max-w-2xl">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;





