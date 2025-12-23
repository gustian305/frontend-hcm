import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../store";
import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { resetPasswordThunk } from "../../store/slices/authSlice";
import HumadifyLogo from "../../assets/HumadifySecondary.svg";
import ModalAlert from "../../components/modal/AlertModal";
import { Eye, EyeOff } from "lucide-react";

type AlertType = "success" | "error" | "warning";

const ResetPasswordPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { token } = useParams<{ token: string }>();
  const [showPassword, setShowPassword] = useState(false);
  const { loading, error } = useSelector((state: RootState) => state.auth);

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // ===== ALERT STATE =====
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertType, setAlertType] = useState<AlertType>("success");
  const [alertMessage, setAlertMessage] = useState("");

  const showAlert = (type: AlertType, message: string) => {
    setAlertType(type);
    setAlertMessage(message);
    setAlertOpen(true);
  };

  const submitNewPassword = async () => {
    if (!token) {
      showAlert("error", "Token reset password tidak valid");
      return;
    }

    if (newPassword !== confirmPassword) {
      showAlert("warning", "Password dan konfirmasi tidak sama");
      return;
    }

    try {
      await dispatch(
        resetPasswordThunk({
          token,
          payload: { newPassword, confirmPassword },
        })
      ).unwrap();

      showAlert("success", "Password berhasil diubah. Silakan login kembali.");
    } catch (err) {
      console.error("[RESET PASSWORD]", err);
      showAlert("error", "Gagal mengubah password");
    }
  };

  // === AUTO REDIRECT SETELAH SUCCESS ===
  useEffect(() => {
    if (!alertOpen || alertType !== "success") return;

    const timer = setTimeout(() => {
      navigate("/login");
    }, 3000);

    return () => clearTimeout(timer);
  }, [alertOpen, alertType, navigate]);

  return (
    <div className="w-full min-h-screen flex bg-gray-100">
      {/* Form Section */}
      <div className="flex-1 flex flex-col justify-center items-center bg-white px-12 py-16 max-w-lg shadow-lg">
        <img
          src={HumadifyLogo}
          alt="logo"
          className="h-16 w-auto transition-all duration-300"
        />

        <h1 className="mt-6 text-2xl font-semibold text-gray-800 text-center">
          Reset Password
        </h1>

        <p className="mt-2 text-gray-600 text-center">
          Buat password baru untuk mengamankan akun Anda.
        </p>

        {/* Password Baru */}
        <div className="w-full mt-6">
          <label className="block text-gray-700 text-sm mb-1">
            Password Baru
          </label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Masukkan password baru"
            disabled={loading}
            className="w-full p-3 border border-gray-300 rounded-full focus:ring-2 focus:ring-blue-400 outline-none"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

        {/* Konfirmasi Password */}
        <div className="w-full mt-4">
          <label className="block text-gray-700 text-sm mb-1">
            Konfirmasi Password
          </label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Ulangi password baru"
            disabled={loading}
            className="w-full p-3 border border-gray-300 rounded-full focus:ring-2 focus:ring-blue-400 outline-none"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

        {error && (
          <p className="mt-3 text-red-500 text-sm text-center">{error}</p>
        )}

        {/* Button */}
        <div className="w-full mt-6">
          <button
            onClick={submitNewPassword}
            disabled={loading || !newPassword || !confirmPassword}
            className="w-full py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition font-semibold disabled:opacity-60"
          >
            {loading ? "Menyimpan..." : "Simpan Password"}
          </button>
        </div>
      </div>

      {/* Illustration Section */}
      <div className="hidden md:flex flex-1 bg-white justify-center items-center relative">
        <img
          src="/src/assets/ilustrasi.svg"
          alt="Reset Password Illustration"
          className="w-1/2 object-contain"
        />
      </div>

      {/* ALERT MODAL */}
      <ModalAlert
        open={alertOpen}
        type={alertType}
        message={alertMessage}
        onClose={() => setAlertOpen(false)}
      />
    </div>
  );
};

export default ResetPasswordPage;
