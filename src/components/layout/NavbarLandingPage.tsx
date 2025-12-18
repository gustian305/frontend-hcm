import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import HumadifyLogo from "../../assets/HumadifySecondary.svg"

interface MenuItem {
  label: string;
  path: string;
}

const menuItems: MenuItem[] = [
  { label: "Features", path: "/features" },
  { label: "Resources", path: "/resources" },
  { label: "Pricing", path: "/pricing" },
  { label: "Recruitment", path: "/recruitment" },
];

const NavbarLandingPage: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const [mobileOpen, setMobileOpen] = useState<boolean>(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleDrawer = () => setMobileOpen(!mobileOpen);

  return (
    <>
      <header
        className={`fixed w-full z-50 transition-all border-b ${
          isScrolled ? "bg-white/90 backdrop-blur shadow" : "bg-white/90 backdrop-blur"
        }`}
      >
        <div className="flex justify-between items-center px-6 py-2">
          {/* Logo */}
          <div
            className="cursor-pointer"
            onClick={() => navigate("/")}
          >
            <img
              src={HumadifyLogo}
              alt="Logo"
              className={`transition-all ${isScrolled ? "h-7" : "h-9"}`}
            />
          </div>

          {/* Desktop Menu */}
          <nav className="hidden md:flex gap-8 items-center">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`relative font-medium text-sm transition-all ${
                  location.pathname === item.path ? "after:w-full" : "after:w-0"
                } after:absolute after:left-0 after:bottom-0 after:h-[2px] after:bg-blue-500 after:transition-all hover:after:w-full`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Desktop Login */}
          <button
            className="hidden md:flex bg-blue-500 text-white font-medium px-6 py-2 rounded-lg transition hover:opacity-80"
            onClick={() => navigate("/login")}
          >
            Login
          </button>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={toggleDrawer}
          >
            <span className="block w-6 h-0.5 bg-black mb-1"></span>
            <span className="block w-6 h-0.5 bg-black mb-1"></span>
            <span className="block w-6 h-0.5 bg-black"></span>
          </button>
        </div>
      </header>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-black/30" onClick={toggleDrawer}>
          <div
            className="fixed right-0 top-0 w-64 h-full bg-white/90 backdrop-blur p-4 transition-transform"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <img
                src="/src/assets/images/HumadifySecondary.svg"
                alt="Logo"
                className="h-7"
              />
              <button onClick={toggleDrawer} className="text-black font-bold text-xl">
                &times;
              </button>
            </div>
            <nav className="flex flex-col gap-3">
              {menuItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={toggleDrawer}
                  className={`font-medium text-base ${
                    location.pathname === item.path ? "text-blue-500" : "text-black"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
            <button
              className="mt-4 w-full bg-blue-500 text-white font-medium py-2 rounded-lg"
              onClick={() => {
                navigate("/login");
                toggleDrawer();
              }}
            >
              Login
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default NavbarLandingPage;
