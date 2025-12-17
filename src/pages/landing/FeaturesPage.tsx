import React from "react";
import NavbarLandingPage from "../../components/layout/NavbarLandingPage";
import FooterLandingPage from "../../components/layout/FooterLandingPage";
import HeroSectionFeature from "./feature/HeroSectionFeature";
import FeaturesDetailSection from "./feature/FeaturesDetailSection";
import CTASection from "./feature/CTASection";

const FeaturesPage: React.FC = () => {
  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Navbar */}
      <NavbarLandingPage />

      {/* Hero Section */}
      <HeroSectionFeature />

      {/* Features Detail Section */}
      <FeaturesDetailSection />

      {/* CTA Section */}
      <CTASection />

      {/* Footer */}
      <FooterLandingPage />
    </div>
  );
};

export default FeaturesPage;
