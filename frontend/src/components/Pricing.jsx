import React from "react";
import { Button } from "antd";
import { Check, X, Zap, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const Pricing = () => {
  const plans = [
    {
      name: "Starter Clinic",
      price: "1,299",
      features: ["Up to 100 Patients", "Basic Scheduling", "Email Support", "Digital Prescription"],
      no: ["Advanced Analytics", "Medical Vault", "Multi-Doctor Panel"]
    },
    {
      name: "Professional Hub",
      price: "2,499",
      featured: true,
      features: ["Unlimited Patients", "Medical Vault Access", "Full Analytics", "Multi-Doctor Panel", "Priority Support"],
      no: ["Enterprise API Integration"]
    },
    {
      name: "Enterprise Architecture",
      price: "Custom",
      features: ["Custom Integrations", "Full API Access", "Dedicated Manager", "White Label Options", "On-Premise Deployment"],
      no: []
    }
  ];

  return (
    <section id="pricing" className="py-32 px-6 md:px-12 bg-white relative overflow-hidden border-b border-slate-100">
      <div className="container mx-auto relative z-10">

        {/* Heading */}
        <div className="flex flex-col md:flex-row justify-between items-end gap-10 mb-24">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-3 px-4 py-2 bg-slate-900 rounded-full text-[10px] font-black uppercase tracking-[0.2em] text-white mb-6">
              <Zap size={12} className="text-sky-400 fill-sky-400" />
              Economics
            </div>
            <h2 className="text-5xl md:text-8xl font-black tracking-tight text-slate-900 leading-[0.9] uppercase">
              Flexible <br />
              <span className="text-sky-500">Licensing</span>.
            </h2>
          </div>
          <p className="text-slate-500 text-lg font-bold max-w-sm mb-2">
            Transparent pricing models engineered for healthcare facilities of all throughput levels.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          {plans.map((plan, idx) => (
            <div key={idx} className={`relative p-12 border transition-all duration-500 group rounded-[3rem] ${plan.featured ? "bg-slate-900 border-slate-800 z-10 shadow-2xl" : "bg-white/40 backdrop-blur-xl border-white/50 hover:bg-white/60 shadow-sm hover:shadow-2xl"}`}>

              <div className="flex justify-between items-start mb-12">
                <h3 className={`text-xs font-black uppercase tracking-[0.2em] ${plan.featured ? "text-sky-500" : "text-slate-400"}`}>{plan.name}</h3>
                {plan.featured && <span className="bg-sky-500 text-white text-[8px] font-black uppercase tracking-widest px-3 py-1 rounded-full">Featured</span>}
              </div>

              <div className="mb-12">
                <p className={`text-6xl font-black tracking-tighter ${plan.featured ? "text-white" : "text-slate-900"}`}>
                  {plan.price !== "Custom" && <span className="text-xl align-top mr-1">₹</span>}
                  {plan.price}
                </p>
                {plan.price !== "Custom" && <p className={`text-[10px] font-black uppercase tracking-widest mt-4 ${plan.featured ? "text-slate-500" : "text-slate-400"}`}>per month / unlimited nodes</p>}
              </div>

              <ul className="space-y-5 mb-16">
                {plan.features.map(f => (
                  <li key={f} className="flex items-center gap-4">
                    <Check size={14} className="text-sky-500" strokeWidth={4} />
                    <span className={`text-xs font-bold uppercase tracking-tight ${plan.featured ? "text-slate-300" : "text-slate-600"}`}>{f}</span>
                  </li>
                ))}
                {plan.no && plan.no.map(f => (
                  <li key={f} className="flex items-center gap-4 opacity-20">
                    <X size={14} className={plan.featured ? "text-white" : "text-slate-900"} strokeWidth={4} />
                    <span className={`text-xs font-bold uppercase tracking-tight ${plan.featured ? "text-white" : "text-slate-900"}`}>{f}</span>
                  </li>
                ))}
              </ul>

              <Link to="/patient/signup">
                <Button className={`w-full h-16 rounded-2xl border-none font-black text-[10px] uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 ${plan.featured ? "bg-sky-500 text-white hover:!bg-white hover:!text-slate-900" : "bg-slate-900 text-white hover:!bg-sky-500"}`}>
                  Initialize <ArrowRight size={14} />
                </Button>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pricing;



