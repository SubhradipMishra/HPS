import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main className="pt-40 pb-20 px-8 md:px-16 max-w-4xl mx-auto">
        <div className="space-y-12">
          <div>
            <p className="text-sky-500 text-[10px] font-black uppercase tracking-[0.3em] mb-4">Data Security Protocol v4.0</p>
            <h1 className="text-5xl md:text-7xl font-black text-slate-900 uppercase tracking-tighter leading-none">
              Privacy <br />
              <span className="text-sky-500">Policy</span>.
            </h1>
            <p className="text-slate-400 text-sm font-bold mt-6">Last updated: April 30, 2026</p>
          </div>

          <div className="space-y-8 text-slate-600 leading-relaxed font-medium">
            <section className="space-y-4">
              <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">1. Data Ingestion & Collection</h2>
              <p>
                CureSync collects clinical data only when voluntarily provided by users or authorized medical nodes. This includes biometric identifiers, medical history, and real-time health telemetry streams.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">2. Encryption & Vaulting</h2>
              <p>
                Your data is stored in high-availability medical vaults, encrypted at rest and in transit using enterprise-grade cryptographic standards. We utilize multi-layer isolation to ensure that data nodes remain private.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">3. Data Distribution Protocol</h2>
              <p>
                Clinical data is only shared with specialist nodes (Doctors/Clinics) that you have explicitly authorized through a live scheduling handshake. We never sell or lease patient identity data to third-party marketing entities.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">4. Compliance & Auditing</h2>
              <p>
                Our architecture undergoes regular compliance audits to maintain HIPAA, GDPR, and SOC2 certifications. Every interaction with a data vault is logged in a secure, immutable audit trail for forensic transparency.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">5. User Identity Rights</h2>
              <p>
                Users retain absolute ownership of their digital health identity. You may request node de-initialization and vault purging at any time through the patient portal security settings.
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
