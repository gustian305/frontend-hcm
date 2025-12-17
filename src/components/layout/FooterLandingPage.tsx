import React from "react";
// import logo from "../../../public/logo-humadify.png";

const FooterLandingPage: React.FC = () => {
  const aboutLinks = ["Features", "Solution", "Pricing", "Resource"];
  const legalLinks = ["Privacy Policy", "Terms of use", "License"];
  const socialLinks = [
    { icon: "facebook", href: "#" },
    { icon: "instagram", href: "#" },
    { icon: "twitter", href: "#" },
    { icon: "linkedin", href: "#" },
  ];

  return (
    <footer className="bg-white text-gray-800 border-t border-gray-200 py-12">
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
        {/* Logo & Description */}
        <div>
          <img src={"/logo-humadify.png"} alt="Humadify Logo" className="w-36 mb-2" />
          <p className="text-gray-500 max-w-xs text-sm">
            Your Human Capital Solutions
          </p>
        </div>

        {/* About */}
        <div>
          <h3 className="font-semibold mb-2">About</h3>
          <ul className="flex flex-col gap-1">
            {aboutLinks.map((item, i) => (
              <li key={i}>
                <a
                  href="#"
                  className="text-gray-500 text-sm hover:text-blue-500 transition"
                >
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Legal */}
        <div>
          <h3 className="font-semibold mb-2">Legal</h3>
          <ul className="flex flex-col gap-1">
            {legalLinks.map((item, i) => (
              <li key={i}>
                <a
                  href="#"
                  className="text-gray-500 text-sm hover:text-blue-500 transition"
                >
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Socials */}
        <div className="flex flex-col md:items-end">
          <h3 className="font-semibold mb-2 text-left md:text-right">
            Follow us on our socials
          </h3>
          <div className="flex gap-4">
            {socialLinks.map((social, i) => (
              <a
                key={i}
                href={social.href}
                className="text-gray-500 hover:text-blue-500 transition text-xl"
              >
                {/* Simple placeholder icons */}
                {social.icon === "facebook" && <span>📘</span>}
                {social.icon === "instagram" && <span>📸</span>}
                {social.icon === "twitter" && <span>🐦</span>}
                {social.icon === "linkedin" && <span>💼</span>}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="mt-12 text-center text-gray-500 text-sm">
        © {new Date().getFullYear()} Humadify. All rights reserved.
      </div>
    </footer>
  );
};

export default FooterLandingPage;
