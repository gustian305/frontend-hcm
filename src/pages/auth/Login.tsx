import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store";
import {
  loginThunk,
  oauthLoginThunk,
  resendOTPLoginThunk,
  resendOTPResetPasswordThunk,
  verifyOTPLoginThunk,
  verifyOTPResetPasswordThunk,
} from "../../store/slices/authSlice";
import { useNavigate } from "react-router-dom";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../../config/firebase";
import OTPModal from "../../components/modal/OtpModal";
import HumadifyLogo from "../../assets/HumadifySecondary.svg";
import ModalAlert from "../../components/modal/AlertModal";
import ForgotPasswordModal from "../../components/modal/ForgotPasswordModal";
import { Eye, EyeOff } from "lucide-react";

type AlertType = "success" | "error" | "warning" | "confirm";
type OTPMode = "login" | "reset-password";

const LoginPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { loading } = useSelector((s: RootState) => s.auth);
  const [form, setForm] = useState({ email: "", password: "" });
  const [otpOpen, setOtpOpen] = useState(false);
  const [localOtpUserId, setLocalOtpUserId] = useState<string | null>(null);
  const [otpMode, setOtpMode] = useState<OTPMode>("login");
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertType, setAlertType] = useState<AlertType>("success");
  const [alertMessage, setAlertMessage] = useState("");
  const [alertTitle, setAlertTitle] = useState<string | undefined>(undefined);
  const [showPassword, setShowPassword] = useState(false);
  const [forgotOpen, setForgotOpen] = useState(false);

  const showAlert = (type: AlertType, message: string, title?: string) => {
    setAlertType(type);
    setAlertMessage(message);
    setAlertTitle(title);
    setAlertOpen(true);
  };

  const handleLogin = async () => {
    try {
      const data = await dispatch(loginThunk(form)).unwrap();

      if (data.otpRequest) {
        setLocalOtpUserId(data.userInfo.id);
        setOtpMode("login");
        setOtpOpen(true);

        showAlert("success", "Kode OTP telah dikirim ke email Anda");
        return;
      }
    } catch (err) {
      console.error("Login failed:", err);
      showAlert("error", "Login gagal, periksa email & password Anda!");
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const idToken = await result.user.getIdToken();

      const data = await dispatch(oauthLoginThunk({ token: idToken })).unwrap();
      console.log("[GOOGLE LOGIN RESPONSE]", data);

      if (data.otpRequest) {
        setLocalOtpUserId(data.userInfo.id);
        setOtpMode("login");
        setOtpOpen(true);

        showAlert("success", "Kode OTP telah dikirim ke email Anda");
        return;
      }
    } catch (error) {
      console.error("Google login failed:", error);
      showAlert("error", "Google Login gagal, periksa koneksi internet Anda!");
    }
  };

  const handleVerifyOTP = async (otp: string) => {
    if (!localOtpUserId) return;

    try {
      if (otpMode === "login") {
        const res = await dispatch(
          verifyOTPLoginThunk({
            userId: localOtpUserId,
            otp,
          })
        ).unwrap();

        setOtpOpen(false);

        if (res.needsProfile) {
          navigate(`/complete-profile/${localOtpUserId}`);
        } else {
          navigate("/dashboard");
        }
      }

      if (otpMode === "reset-password") {
        const res = await dispatch(
          verifyOTPResetPasswordThunk({
            userId: localOtpUserId,
            otp,
          })
        ).unwrap();

        setOtpOpen(false);

        navigate(`/reset-password/${res.resetToken}`);
      }
    } catch (err) {
      console.error("OTP failed:", err);
      showAlert("error", "Verifikasi OTP gagal");
    }
  };

  const handleResend = async () => {
    if (!localOtpUserId) {
      showAlert("error", "User tidak valid untuk resend OTP");
      return;
    }

    try {
      if (otpMode === "login") {
        await dispatch(
          resendOTPLoginThunk({ userId: localOtpUserId })
        ).unwrap();

        showAlert("success", "Kode OTP login berhasil dikirim ulang");
      }

      if (otpMode === "reset-password") {
        await dispatch(
          resendOTPResetPasswordThunk({ userId: localOtpUserId })
        ).unwrap();

        showAlert(
          "success",
          "Kode OTP reset password berhasil dikirim ke email"
        );
      }
    } catch (err) {
      console.error("Failed to resend OTP:", err);
      showAlert("error", "Gagal mengirim ulang OTP");
    }
  };

  const handleForgotSuccess = (userId: string) => {
    setLocalOtpUserId(userId);
    setOtpMode("reset-password");
    setForgotOpen(false);
    setOtpOpen(true);
  };

  return (
    <div className="w-full min-h-screen flex bg-gray-100">
      {/* Form */}
      <div className="flex-1 flex flex-col justify-center items-center bg-white px-12 py-16 max-w-lg shadow-lg">
        <img
          src={HumadifyLogo}
          alt="logo"
          className="h-18 w-auto transition-all duration-300"
        />
        <h1 className="mt-6 text-2xl font-semibold text-gray-800 text-center">
          Masuk ke akun Anda
        </h1>
        <p className="mt-2 text-gray-600 text-center">
          Masuk untuk mengelola data karyawan, absensi, kinerja, dan semua
          kebutuhan HR dalam satu sistem terpadu.
        </p>
        {/* Input Email */}
        <div className="w-full mt-6">
          <label className="block text-gray-700 text-sm mb-1">Email</label>
          <input
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            placeholder="Enter your email"
            className="w-full p-3 border border-gray-300 rounded-full focus:ring-2 focus:ring-blue-400 outline-none"
          />
        </div>
  
        {/* Input Password */}
        <div className="w-full mt-4">
          <label className="block text-gray-700 text-sm mb-1">Password</label>

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="Enter your password"
              className="w-full p-3 pr-12 border border-gray-300 rounded-full focus:ring-2 focus:ring-blue-400 outline-none"
            />

            {/* Icon Mata */}
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <div className="mt-2 flex justify-between items-center text-sm text-gray-500">
            <label className="flex items-center gap-2">
              <input type="checkbox" className="form-checkbox" />
              Remember me
            </label>

            <button
              type="button"
              onClick={() => setForgotOpen(true)}
              className="text-blue-500 hover:underline"
            >
              Lupa Password
            </button>
          </div>
        </div>
        
        {/* Buttons */}
        <div className="w-full mt-6 flex flex-col gap-3">
          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition font-semibold"
          >
            {loading ? "Signing in..." : "Masuk"}
          </button>

          <button
            onClick={handleGoogleLogin}
            className="w-full py-3 border border-gray-300 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-100 transition"
          >
            <img
              src="\src\assets\google.svg"
              alt="Google"
              className="w-5 h-5"
            />
            Daftar / Masuk dengan Google
          </button>
        </div>
      </div>

      {/* Illustration */}
      <div className="hidden md:flex flex-1 bg-white justify-center items-center relative">
        <img
          src="\src\assets\ilustrasi.svg"
          alt="Login Illustration"
          className="w-1/2 object-contain"
        />
      </div>

      <OTPModal
        isOpen={otpOpen}
        loading={loading}
        mode={otpMode}
        onClose={() => setOtpOpen(false)}
        onSubmit={handleVerifyOTP}
        onResend={handleResend}
      />

      <ForgotPasswordModal
        isOpen={forgotOpen}
        onClose={() => setForgotOpen(false)}
        onSuccess={handleForgotSuccess}
      />

      <ModalAlert
        open={alertOpen}
        type={alertType}
        title={alertTitle}
        message={alertMessage}
        onClose={() => setAlertOpen(false)}
      />
    </div>
  );
};

export default LoginPage;
