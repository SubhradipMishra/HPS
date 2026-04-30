import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const TermsAndConditions = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main className="pt-40 pb-20 px-8 md:px-16 max-w-4xl mx-auto">
        <div className="space-y-12">
          <div>
            <p className="text-sky-500 text-[10px] font-black uppercase tracking-[0.3em] mb-4">Legal Framework v4.0</p>
            <h1 className="text-5xl md:text-7xl font-black text-slate-900 uppercase tracking-tighter leading-none">
              Terms & <br />
              <span className="text-sky-500">Conditions</span>.
            </h1>
            <p className="text-slate-400 text-sm font-bold mt-6">Last updated: April 30, 2026</p>
          </div>

          <div className="space-y-8 text-slate-600 leading-relaxed font-medium">
            <section className="space-y-4">
              <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">1. Acceptance of Architecture</h2>
              <p>
                By accessing the CureSync clinical orchestration platform, you agree to be bound by these Terms and Conditions. These terms govern your interaction with our clinical nodes, data vaults, and scheduling systems.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">2. Node Access and Identity</h2>
              <p>
                Users must establish a verified identity through our biometric-grade authentication layer. You are responsible for maintaining the confidentiality of your security keys and for all activities that occur under your established node.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">3. Clinical Data Governance</h2>
              <p>
                All medical data stored within CureSync vaults is subject to international healthcare compliance standards (HIPAA, GDPR). We provide the infrastructure for data orchestration; however, clinical accuracy remains the responsibility of the registered specialist nodes.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">4. System Uptime and Latency</h2>
              <p>
                While we strive for 99.9% network uptime, CureSync is not liable for clinical delays caused by external network latency or local ISP failure. Our high-throughput architecture is designed for peak performance but requires stable connectivity.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">5. Limitation of Liability</h2>
              <p>
                CureSync is a technology layer. We do not provide medical advice or direct healthcare services. Our platform facilitates the orchestration of care between patients and certified medical providers.
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TermsAndConditions;
