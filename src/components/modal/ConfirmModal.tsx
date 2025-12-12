import { FC } from "react";
import { X } from "lucide-react";

interface ModalConfirmProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
}

const ModalConfirm: FC<ModalConfirmProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Konfirmasi",
  message = "Apakah kamu yakin?",
  confirmText = "Yes",
  cancelText = "Cancel",
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-xl shadow-xl w-80 sm:w-96 p-5 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition"
        >
          <X size={20} />
        </button>

        {/* Title */}
        <h2 className="text-lg font-semibold text-gray-800">{title}</h2>

        {/* Message */}
        <p className="mt-2 text-gray-600">{message}</p>

        {/* Buttons */}
        <div className="mt-5 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalConfirm;
