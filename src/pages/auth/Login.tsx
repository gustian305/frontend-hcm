import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store";
import {
  loginThunk,
  oauthLoginThunk,
  verifyOTPThunk,
} from "../../store/slices/authSlice";
import { useNavigate } from "react-router-dom";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../../config/firebase";
import OTPModal from "../../components/modal/OtpModal";

const LoginPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const { loading, needsProfile } = useSelector(
    (s: RootState) => s.auth
  );

  const [form, setForm] = useState({ email: "", password: "" });
  const [otpOpen, setOtpOpen] = useState(false);
  const [localOtpUserId, setLocalOtpUserId] = useState<string | null>(null);

  const handleLogin = async () => {
    try {
      const data = await dispatch(loginThunk(form)).unwrap();
      console.log("[LOGIN RESPONSE]", data);

      if (data.otpRequest) {
        setLocalOtpUserId(data.userInfo.id);
        setOtpOpen(true);
        return;
      }
    } catch (err) {
      console.error("Login failed:", err);
      alert("Login gagal");
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
        setOtpOpen(true);
        return;
      }
    } catch (error) {
      console.error("Google login failed:", error);
      alert("Google Login gagal");
    }
  };

  const handleVerifyOTP = async (otp: string) => {
    if (!localOtpUserId) {
      console.error("User ID missing, cannot verify OTP");
      return;
    }

    try {
      const res = await dispatch(
        verifyOTPThunk({ userId: localOtpUserId, otp })
      ).unwrap();

      setOtpOpen(false);

      if (res.needsProfile) {
        navigate(`/complete-profile/${localOtpUserId}`);
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      console.error("OTP verification failed:", err);
      alert("OTP verification failed");
    }
  };

  return (
    <div className="w-full min-h-screen flex bg-gray-100">
      {/* Form */}
      <div className="flex-1 flex flex-col justify-center items-center bg-white px-12 py-16 max-w-lg shadow-lg">
        <img
          src="\src\assets\logo 1.svg"
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
          <input
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            placeholder="Enter your password"
            className="w-full p-3 border border-gray-300 rounded-full focus:ring-2 focus:ring-blue-400 outline-none"
          />
          <div className="mt-2 flex justify-between items-center text-sm text-gray-500">
            <label className="flex items-center gap-2">
              <input type="checkbox" className="form-checkbox" />
              Remember me
            </label>
            <a href="#" className="text-blue-500 hover:underline">
              Lupa Password
            </a>
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
        onClose={() => setOtpOpen(false)}
        onSubmit={handleVerifyOTP}
      />
    </div>
  );
};

export default LoginPage;
