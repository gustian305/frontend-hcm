import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Logo from "../../../assets/Logo1.svg";
import { Menu } from "lucide-react";

const menuItems = [
  { label: "Home", path: "/" },
  { label: "Resources", path: "/resources" },
  { label: "Pricing", path: "/pricing" },
  { label: "Recruitment", path: "/recruitment" },
]

const NavbarLanding = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 0);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* ===== Navbar ===== */}
      <div
        className={`
          fixed top-0 left-0 w-full z-50 transition-all duration-300 
          backdrop-blur-xl border-b border-black/10
          ${isScrolled ? "py-2 bg-white/80 shadow-md" : "py-4 bg-white/50"}
        `}
      >
        <div className="px-4 md:px-10 flex justify-between items-center">
          {/* Logo */}
          <div className="cursor-pointer" onClick={() => navigate("/")}>
            <img
              alt="logo humadify"
              src={Logo}
              className={`transition-all duration-300 ${
                isScrolled ? "h-7" : "h-9"
              }`}
            />
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex gap-6 items-center">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className="relative font-medium text-gray-700 hover:text-blue-600 transition"
              >
                {item.label}

                {/* underline animated */}
                <span
                  className={`
                    absolute left-0 -bottom-1 h-[2px] bg-blue-600 transition-all duration-300
                    ${
                      location.pathname === item.path
                        ? "w-full"
                        : "w-0 group-hover:w-full"
                    }
                  `}
                />
              </Link>
            ))}
          </div>

          {/* Right Button */}
          <div className="hidden md:flex">
            <button
              onClick={() => navigate("/login")}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
            >
              Login
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden" onClick={() => setMobileOpen(true)}>
            <Menu size={26} />
          </button>
        </div>
      </div>

      {/* ===== Mobile Drawer ===== */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/40"
          onClick={() => setMobileOpen(false)}
        >
          <div
            className="absolute right-0 top-0 h-full w-64 bg-white/90 backdrop-blur-xl p-4 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top: Logo + Close */}
            <div className="flex justify-between items-center mb-4">
              <img alt="logo humadify" src={Logo} className="h-7" />
              <button onClick={() => setMobileOpen(false)}>
                <Menu size={26} />
              </button>
            </div>

            {/* Menu List */}
            <div className="flex flex-col gap-3">
              {menuItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileOpen(false)}
                  className={`px-3 py-2 rounded-lg text-gray-700 font-medium ${
                    location.pathname === item.path ? "bg-blue-100" : ""
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>

            {/* Login Button */}
            <button
              onClick={() => navigate("/login")}
              className="w-full mt-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
            >
              Login
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default NavbarLanding;
