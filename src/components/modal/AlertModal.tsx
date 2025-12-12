// src/components/modal/ModalAlert.tsx
import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { CheckCircle, XCircle, AlertCircle } from "lucide-react"; // Optional: install lucide-react jika belum

interface ModalAlertProps {
  open: boolean;
  type: "success" | "error" | "warning" | "confirm";
  title?: string;
  message: string;
  onClose: () => void;
  onConfirm?: () => void;
  confirmText?: string;
  cancelText?: string;
  autoCloseDuration?: number; // Custom duration untuk auto close
}

const ModalAlert: React.FC<ModalAlertProps> = ({
  open,
  type,
  title,
  message,
  onClose,
  onConfirm,
  confirmText = "Ya",
  cancelText = "Batal",
  autoCloseDuration = 3000,
}) => {
  // AUTO CLOSE untuk SUCCESS & ERROR & WARNING
  useEffect(() => {
    if (!open) return;

    if (type === "success" || type === "error" || type === "warning") {
      const timer = setTimeout(() => {
        onClose();
      }, autoCloseDuration);

      return () => clearTimeout(timer);
    }
  }, [open, type, onClose, autoCloseDuration]);

  if (!open) return null;

  // ==== TOAST SUCCESS / ERROR / WARNING ===================================
  if (type === "success" || type === "error" || type === "warning") {
    const bgColor = {
      success: "bg-green-600",
      error: "bg-red-600",
      warning: "bg-yellow-500",
    }[type];

    const icon = {
      success: <CheckCircle size={20} />,
      error: <XCircle size={20} />,
      warning: <AlertCircle size={20} />,
    }[type];

    const defaultTitle = {
      success: "Berhasil!",
      error: "Error!",
      warning: "Peringatan!",
    }[type];

    return (
      <div className="fixed top-6 inset-x-0 flex justify-center z-[9999] pointer-events-none">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -20, opacity: 0 }}
          className={`pointer-events-auto ${bgColor} text-white px-6 py-4 rounded-lg shadow-xl max-w-md w-full mx-4 flex items-start gap-3`}
        >
          <div className="flex-shrink-0 mt-0.5">
            {icon}
          </div>
          <div className="flex-1">
            <h3 className="font-semibold">{title || defaultTitle}</h3>
            <p className="text-sm opacity-90 mt-1">{message}</p>
          </div>
          <button
            onClick={onClose}
            className="flex-shrink-0 opacity-70 hover:opacity-100 transition"
          >
            <XCircle size={18} />
          </button>
        </motion.div>
      </div>
    );
  }

  // ==== MODAL CONFIRM ====================================================
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.85, opacity: 0 }}
        className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden"
      >
        <div className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full flex items-center justify-center text-white bg-yellow-500">
              <span className="text-xl">?</span>
            </div>
            <div>
              <h2 className="text-xl font-semibold">{title || "Konfirmasi"}</h2>
              <p className="text-gray-600 text-sm">Silakan konfirmasi tindakan Anda</p>
            </div>
          </div>

          <p className="text-gray-700 mb-6">{message}</p>

          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition font-medium"
            >
              {cancelText}
            </button>
            <button
              onClick={() => {
                onConfirm?.();
                onClose();
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition font-medium"
            >
              {confirmText}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ModalAlert;