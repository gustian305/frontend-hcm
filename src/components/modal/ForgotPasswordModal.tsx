import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../store";
import { forgotPasswordThunk } from "../../store/slices/authSlice";
import ModalAlert from "./AlertModal";

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (userId: string) => void;
}

type AlertType = "success" | "error" | "warning";

const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error } = useSelector((state: RootState) => state.auth);

  const [email, setEmail] = useState("");

  // ===== ALERT STATE =====
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertType, setAlertType] = useState<AlertType>("success");
  const [alertMessage, setAlertMessage] = useState("");
  const [successUserId, setSuccessUserId] = useState<string | null>(null);
  const [isCancelled, setIsCancelled] = useState(false);

  const showAlert = (type: AlertType, message: string) => {
    setAlertType(type);
    setAlertMessage(message);
    setAlertOpen(true);
  };

  const submitEmail = async () => {
    if (!email) {
      showAlert("warning", "Email wajib diisi");
      return;
    }

    try {
      const res = await dispatch(forgotPasswordThunk({ email })).unwrap();

      setSuccessUserId(res.userId);
      showAlert("success", "Kode OTP berhasil dikirim ke email Anda");
    } catch (err) {
      console.error("[FORGOT PASSWORD]", err);
      showAlert("error", "Gagal mengirim OTP reset password");
    }
  };

  const handleCancel = () => {
    setIsCancelled(true);

    setAlertOpen(false);
    setSuccessUserId(null);
    setEmail("");

    onClose();
  };

  useEffect(() => {
    if (
      isCancelled ||
      !alertOpen ||
      alertType !== "success" ||
      !successUserId
    ) {
      return;
    }

    const timer = setTimeout(() => {
      onClose();
      onSuccess(successUserId);
    }, 1000);

    return () => clearTimeout(timer);
  }, [alertOpen, alertType, successUserId, isCancelled, onClose, onSuccess]);

  if (!isOpen) return null;

  return (
    <>
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
            disabled={loading}
          />

          {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

          <button
            onClick={submitEmail}
            disabled={loading || !email}
            className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 disabled:opacity-60"
          >
            {loading ? "Mengirim..." : "Kirim OTP"}
          </button>

          <button
            onClick={handleCancel}
            disabled={loading}
            className="mt-3 w-full py-1 text-gray-600 hover:text-gray-800 text-sm"
          >
            Tutup
          </button>
        </div>
      </div>

      {/* ALERT */}
      <ModalAlert
        open={alertOpen}
        type={alertType}
        message={alertMessage}
        onClose={() => setAlertOpen(false)}
      />
    </>
  );
};

export default ForgotPasswordModal;
