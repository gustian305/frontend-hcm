import React, { useEffect } from "react";
import NavbarLandingPage from "../../components/layout/NavbarLandingPage";
import FooterLandingPage from "../../components/layout/FooterLandingPage";
import HeroSection from "./section/herosection";
import MetricsSection from "./section/MetricsSection";
import ProblemSection from "./section/ProblemSection";
import SolutionSection from "./section/SolutionSection";
import FAQSection from "./section/FAQSection";

const LandingPage: React.FC = () => {

  return (
    <div className="min-h-screen bg-gray-100 text-gray-800">
      {/* NAVBAR */}
      <NavbarLandingPage />

      <HeroSection />

      <MetricsSection />

      <ProblemSection />

      <SolutionSection />

      <FAQSection />

      {/* FOOTER */}
      <FooterLandingPage />
    </div>
  );
};

export default LandingPage;
