import React, { useState, ReactNode, useEffect } from "react";
import { X, Save, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";

interface ModalFormProps<T> {
  title: string;
  initialValues: T;
  onSubmit: (values: T) => Promise<void> | void;
  onClose: () => void;
  children: (
    values: T,
    setValues: React.Dispatch<React.SetStateAction<T>>,
    errors: Record<keyof T, string>,
    setErrors: React.Dispatch<React.SetStateAction<Record<keyof T, string>>>
  ) => ReactNode;
  width?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "full";
  maxHeight?: string;
  submitLabel?: string;
  cancelLabel?: string;
  showSuccess?: boolean;
  successMessage?: string;
  validate?: (values: T) => Record<keyof T, string>;
  autoCloseOnSuccess?: boolean;
  autoCloseDelay?: number;
}

const ModalForm = <T extends Record<string, any>>({
  title,
  initialValues,
  onSubmit,
  onClose,
  children,
  width = "3xl",
  maxHeight = "80vh",
  submitLabel = "Save",
  cancelLabel = "Cancel",
  showSuccess = false,
  successMessage = "Saved successfully!",
  validate,
  autoCloseOnSuccess = true,
  autoCloseDelay = 1500,
}: ModalFormProps<T>) => {
  const [values, setValues] = useState<T>(initialValues);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<keyof T, string>>({} as Record<keyof T, string>);

  // Warna biru yang Anda minta
  const primaryColor = "#189AB4";
  const primaryColorHover = "#14829A"; // Sedikit lebih gelap untuk hover

  useEffect(() => {
    setValues(initialValues);
    setErrors({} as Record<keyof T, string>);
    setError(null);
    setSuccess(false);
  }, [initialValues]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (validate) {
      const validationErrors = validate(values);
      const hasErrors = Object.values(validationErrors).some(error => error.trim() !== "");
      
      if (hasErrors) {
        setErrors(validationErrors);
        return;
      }
    }
    
    setSubmitting(true);
    setError(null);
    setSuccess(false);

    try {
      await onSubmit(values);
      
      if (showSuccess) {
        setSuccess(true);
        
        if (autoCloseOnSuccess) {
          setTimeout(() => {
            onClose();
          }, autoCloseDelay);
        }
      } else {
        onClose();
      }
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!submitting) {
      onClose();
    }
  };

  const widthClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
    "2xl": "max-w-2xl",
    "3xl": "max-w-3xl",
    "4xl": "max-w-4xl",
    full: "max-w-full mx-4",
  };

  const modalContent = (
    <form
      onSubmit={handleSubmit}
      className={`
        relative bg-white rounded-2xl shadow-2xl w-full
        overflow-hidden animate-scaleIn
        ${widthClasses[width]}
      `}
      style={{ maxHeight }}
      onClick={(e) => e.stopPropagation()}
    >
      {/* Header dengan background putih dan border */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div 
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: `${primaryColor}20` }} // 20% opacity
            >
              <Save className="w-4 h-4" style={{ color: primaryColor }} />
            </div>
            <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
          </div>
          <button
            type="button"
            onClick={handleClose}
            disabled={submitting}
            className="
              w-8 h-8 rounded-lg flex items-center justify-center
              text-gray-500 hover:text-gray-700 hover:bg-gray-100
              transition-all duration-200 disabled:opacity-50
              focus:outline-none focus:ring-2 focus:ring-gray-200
            "
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="px-6 py-3 bg-red-50 border-b border-red-100">
          <div className="flex items-center gap-2 text-red-600">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <p className="text-sm font-medium">{error}</p>
          </div>
        </div>
      )}

      {/* Success Message */}
      {success && (
        <div className="px-6 py-3 bg-green-50 border-b border-green-100">
          <div className="flex items-center gap-2 text-green-600">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            <p className="text-sm font-medium">{successMessage}</p>
          </div>
        </div>
      )}

      {/* Scrollable Content */}
      <div 
        className="p-6 overflow-y-auto"
        style={{ maxHeight: `calc(${maxHeight} - 180px)` }}
      >
        <div className="space-y-5">
          {children(values, setValues, errors, setErrors)}
        </div>
      </div>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-500">
            {Object.keys(errors).length > 0 && (
              <span className="text-red-500">
                Please fix {Object.keys(errors).length} error(s)
              </span>
            )}
          </div>
          
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleClose}
              disabled={submitting}
              className="
                px-5 py-2.5 rounded-lg border border-gray-300
                text-gray-700 bg-white
                hover:bg-gray-50
                active:scale-[0.98] transition-all duration-200
                disabled:opacity-50 disabled:cursor-not-allowed
                font-medium text-sm
                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500
              "
            >
              {cancelLabel}
            </button>

            <button
              type="submit"
              disabled={submitting}
              className="
                px-5 py-2.5 rounded-lg text-white font-medium text-sm
                active:scale-[0.98] transition-all duration-200
                disabled:opacity-50 disabled:cursor-not-allowed
                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
                flex items-center gap-2
              "
              style={{ 
                backgroundColor: primaryColor
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = primaryColorHover;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = primaryColor;
              }}
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  {submitLabel}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </form>
  );

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="
          absolute inset-0 bg-black/40
          animate-fadeIn cursor-pointer
        "
        onClick={handleClose}
      />
      
      {/* Modal Container */}
      <div className="relative z-10 w-full flex items-center justify-center">
        {modalContent}
      </div>

      {/* Keyboard shortcut hint */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2">
        <div className="
          bg-black/60 text-white text-xs
          px-3 py-1.5 rounded-full opacity-0 animate-fadeIn
          animate-delay-1000
        ">
          Press <kbd className="px-1.5 py-0.5 bg-gray-700 rounded">ESC</kbd> to close
        </div>
      </div>
    </div>
  );
};

export default ModalForm;