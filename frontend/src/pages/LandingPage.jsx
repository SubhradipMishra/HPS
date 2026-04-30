import React from "react";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Features from "../components/Features";
import About from "../components/About";
import Footer from "../components/Footer";
import HowItWorks from "../components/HowItWorks";
import DashboardPreview from "../components/DashboardPreview";
import Testimonials from "../components/Testimonials";
import CTASection from "../components/CTASection";
import FAQSection from "../components/FAQSection";
import Pricing from "../components/Pricing";
import ClientLogos from "../components/ClientLogos";
import FeedbackForm from "../components/FeedbackForm";

const LandingPage = () => {
  return (
    <div>
      <Navbar />
      <Hero />
      <ClientLogos />
      <Features />
      <HowItWorks />
      <DashboardPreview />
      <About />
      <Testimonials />
      <Pricing />
      <FAQSection />
      <FeedbackForm />
      <CTASection />
      <Footer />
    </div>
  );
};

export default LandingPage;