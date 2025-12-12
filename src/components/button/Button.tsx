import React from "react";

type ButtonProps = {
  label?: string;
  children?: React.ReactNode;
  onClick?: () => void;
  icon?: React.ReactNode;
  loading?: boolean;
  disabled?: boolean;
  bgColor?: string;
  textColor?: string;
  className?: string;
};

const Button: React.FC<ButtonProps> = ({
  label,
  children,
  onClick,
  icon,
  loading = false,
  disabled = false,
  bgColor = "#189AB4",
  textColor = "#FFFFFF",
  className = "",
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200
        ${disabled ? "opacity-50 cursor-not-allowed" : "hover:opacity-80"}
        ${className}
      `}
      style={{
        backgroundColor: bgColor,
        color: textColor,
      }}
    >
      {loading ? (
        <svg
          className="animate-spin h-5 w-5"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v8H4z"
          ></path>
        </svg>
      ) : (
        <>
          {icon && <span className="flex items-center">{icon}</span>}
          {label || children}
        </>
      )}
    </button>
  );
};

export default Button;
