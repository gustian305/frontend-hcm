import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../store";
import { forgotPassword } from "../../store/slices/forgotPasswordSlice";

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({
  isOpen,
  onClose,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error } = useSelector(
    (state: RootState) => state.forgotPassword
  );

  const [email, setEmail] = useState("");

  if (!isOpen) return null;

  const submitEmail = () => {
    dispatch(forgotPassword({ email }));
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl w-[90%] max-w-sm shadow-xl">
        <h2 className="text-lg font-semibold text-gray-700">Lupa Password</h2>
        <p className="text-sm text-gray-500 mb-4">
          Masukkan email untuk menerima OTP reset password.
        </p>

        <input
          type="email"
          placeholder="Masukkan email"
          className="w-full px-3 py-2 border rounded-md mb-3 focus:ring focus:ring-indigo-300"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button
          onClick={submitEmail}
          className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700"
        >
          {loading ? "Mengirim..." : "Kirim OTP"}
        </button>

        <button
          onClick={onClose}
          className="mt-3 w-full py-1 text-gray-600 hover:text-gray-800 text-sm"
        >
          Tutup
        </button>
      </div>
    </div>
  );
};

export default ForgotPasswordModal;
