import React, { useEffect, useRef, useState } from "react";

type OTPMode = "login" | "reset-password";

interface OTPModalProps {
  isOpen: boolean;
  loading?: boolean;
  mode: OTPMode;
  onSubmit: (otp: string) => void;
  onResend: () => void;
  onClose: () => void;
}

const RESEND_DELAY = 30;

const OTPModal: React.FC<OTPModalProps> = ({
  isOpen,
  loading,
  mode,
  onSubmit,
  onResend,
  onClose,
}) => {
  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
  const [resendTimer, setResendTimer] = useState<number>(RESEND_DELAY);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    setOtp(["", "", "", "", "", ""]);
    setResendTimer(RESEND_DELAY);

    setTimeout(() => {
      inputRefs.current[0]?.focus();
    }, 100);

    startResendTimer();
    return () => stopResendTimer();
  }, [isOpen]);

  const startResendTimer = () => {
    stopResendTimer();
    timerRef.current = setInterval(() => {
      setResendTimer((prev) => {
        if (prev <= 1) {
          stopResendTimer();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const stopResendTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const handleChange = (value: string, idx: number) => {
    if (!/^[0-9]?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[idx] = value;
    setOtp(newOtp);

    if (value && idx < 5) {
      inputRefs.current[idx + 1]?.focus();
    }
  };

  const handleSubmit = () => {
    const finalOtp = otp.join("");
    if (finalOtp.length !== 6) return;
    onSubmit(finalOtp);
  };

  const handleResend = () => {
    onResend();
    setResendTimer(RESEND_DELAY);
    startResendTimer();
  };

  const handleCancel = () => {
    stopResendTimer();
    setOtp(["", "", "", "", "", ""]);
    onClose();
  };

  if (!isOpen) return null;

  const title =
    mode === "login" ? "Verifikasi Login" : "Verifikasi Reset Password";

  const description =
    mode === "login"
      ? "Masukkan kode OTP yang telah dikirimkan ke email Anda."
      : "Masukkan kode OTP untuk melanjutkan reset password.";

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-[#189AB4] p-6 rounded-xl w-full max-w-sm shadow-lg">
        <div className="flex flex-col items-center mb-4 text-center">
          <h2 className="text-lg font-semibold mb-2 text-white">{title}</h2>
          <p className="text-sm text-black">{description}</p>
        </div>

        {/* OTP INPUT */}
        <div className="flex justify-between mb-6">
          {otp.map((value, idx) => (
            <input
              key={idx}
              ref={(el) => {
                inputRefs.current[idx] = el;
              }}
              type="text"
              maxLength={1}
              value={value}
              onChange={(e) => handleChange(e.target.value, idx)}
              className="w-10 h-12 text-center border rounded-lg text-lg"
            />
          ))}
        </div>

        {/* SUBMIT */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded-lg disabled:opacity-60"
        >
          {loading ? "Verifying..." : "Verify OTP"}
        </button>

        {/* RESEND */}
        <button
          onClick={handleResend}
          disabled={resendTimer > 0}
          className="mt-3 w-full text-sm text-white disabled:text-gray-300"
        >
          {resendTimer > 0
            ? `Kirim ulang kode dalam ${resendTimer}s`
            : "Kirim ulang kode OTP"}
        </button>

        {/* CANCEL */}
        <button
          onClick={handleCancel}
          className="mt-4 w-full text-center text-sm text-gray-300"
        >
          Batal
        </button>
      </div>
    </div>
  );
};

export default OTPModal;
