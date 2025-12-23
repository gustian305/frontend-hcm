import { Menu, ChevronDown } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "../../store";
import authService from "../../service/authService";
import { logout } from "../../store/slices/authSlice";
import { useState } from "react";
import ModalAlert from "../modal/AlertModal";

interface NavbarProps {
  toggleSidebar: () => void;
}

const Navbar = ({ toggleSidebar }: NavbarProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const { userInfo, employeeDetail, loading } = useSelector(
    (state: RootState) => state.auth
  );
  const avatarSrc = employeeDetail?.picture || "src/assets/avatar-default.svg";

  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<"success" | "error" | "confirm">(
    "confirm"
  );

  const [modalMessage, setModalMessage] = useState("");

  const toggleDropdown = () => setDropdownOpen((prev) => !prev);

  const handleLogoutClick = () => {
    setModalType("confirm");
    setModalMessage("Apakah kamu yakin ingin logout?");
    setModalOpen(true);
  };

  const handleConfirmLogout = async () => {
    try {
      setModalOpen(false);

      authService.logout(); // hapus token localstorage
      dispatch(logout()); // reset redux

      setModalType("success");
      setModalMessage("Logout berhasil!");
      setModalOpen(true);
    } catch (err) {
      setModalType("error");
      setModalMessage("Logout gagal, coba lagi.");
      setModalOpen(true);
    }
  };

  return (
    <header className="w-full bg-white shadow px-6 py-3 flex items-center justify-between">
      {/* Hamburger */}
      <div className="flex items-center gap-4">
        <button
          className="md:hidden p-2 rounded hover:bg-gray-200"
          onClick={toggleSidebar}
        >
          <Menu size={24} />
        </button>
      </div>

      {/* User Info */}
      <div className="relative flex items-center gap-4">
        <div className="flex flex-col items-start text-gray-700 text-sm">
          <span className="font-medium">{userInfo?.name}</span>
          <span className="text-gray-500 text-xs">{userInfo?.role}</span>
        </div>

        {/* Avatar */}
        <img
          src={avatarSrc}
          alt="User Avatar"
          className="w-10 h-10 rounded-full object-cover border border-gray-300"
        />

        <ChevronDown
          size={16}
          className="text-gray-500 cursor-pointer"
          onClick={toggleDropdown}
        />

        {/* Dropdown */}
        {dropdownOpen && (
          <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-xl z-50 overflow-hidden">
            <ul className="divide-y divide-gray-100">
              <li>
                <button className="w-full text-left px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50">
                  Profile
                </button>
              </li>

              <li>
                <button
                  onClick={handleLogoutClick} // ⬅ buka modal konfirmasi
                  disabled={loading}
                  className="w-full text-left px-4 py-2.5 text-sm font-medium text-red-500 hover:bg-red-50 transition-colors disabled:opacity-50"
                >
                  {loading ? "Logging out..." : "Logout"}
                </button>
              </li>
            </ul>
          </div>
        )}
      </div>

      {/* ModalAlert */}
      <ModalAlert
        open={modalOpen}
        type={modalType}
        message={modalMessage}
        onClose={() => setModalOpen(false)}
        onConfirm={handleConfirmLogout} // hanya terpakai di type="confirm"
        confirmText="Logout"
        cancelText="Batal"
      />
    </header>
  );
};

export default Navbar;
