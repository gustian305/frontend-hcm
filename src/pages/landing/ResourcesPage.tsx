import React from "react";
import NavbarLandingPage from "../../components/layout/NavbarLandingPage";
import HeroSection from "./section/herosection";
import ResourceListSection from "./resources/ResourcesListSectio";
import FooterLandingPage from "../../components/layout/FooterLandingPage";

const ResourcesPage: React.FC = () => {
  return (
    <div className="bg-gray-50">
      {/* Navigation Bar */}
      <NavbarLandingPage />

      {/* Hero Section */}
      <HeroSection />

      {/* Resource List Section */}
      <ResourceListSection />

      {/* Footer */}
      <FooterLandingPage />
    </div>
  );
};

export default ResourcesPage;
