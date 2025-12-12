import React, { useEffect, useRef, useState } from "react";

interface OTPModalProps {
  isOpen: boolean;
  loading?: boolean;
  onSubmit: (otp: string) => void;
  onClose: () => void;
}

const OTPModal: React.FC<OTPModalProps> = ({
  isOpen,
  loading,
  onSubmit,
  onClose,
}) => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (isOpen) {
      setOtp(["", "", "", "", "", ""]);
      setTimeout(() => {
        inputRefs.current[0]?.focus();
      }, 100);
    }
  }, [isOpen]);

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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-[#189AB4] p-6 rounded-xl w-full max-w-sm shadow-lg">
        <div className="flex flex-col items-center mb-4 text-center">
          <h2 className="text-lg font-semibold mb-2 text-white">
            Verifikasi OTP
          </h2>
          <p className="text-sm text-black">
            Masukkan kode OTP yang telah dikirimkan ke email Anda.
          </p>
        </div>

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

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded-lg"
        >
          {loading ? "Verifying..." : "Verify OTP"}
        </button>

        <button
          onClick={onClose}
          className="mt-4 w-full text-center text-sm text-gray-500"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default OTPModal;
