import React from "react";
import NavbarLandingPage from "../../components/layout/NavbarLandingPage";
import HeroSectionPricing from "./pricing/HeroSectionPricing";
import PlanListSection from "./pricing/PlanListSection";
import ComparisonSection from "./pricing/ComparationSection";
import FAQSection from "./pricing/FAQSection";
import FooterLandingPage from "../../components/layout/FooterLandingPage";

const PricingPage: React.FC = () => {
  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      {/* Navigation Bar */}
      <NavbarLandingPage />

      {/* Hero Section */}
      <HeroSectionPricing />

      {/* Plan List Section */}
      <PlanListSection />

      {/* Comparison Section */}
      <ComparisonSection />

      {/* FAQ Section */}
      <FAQSection />

      {/* Footer */}
      <FooterLandingPage />
    </div>
  );
};

export default PricingPage;
