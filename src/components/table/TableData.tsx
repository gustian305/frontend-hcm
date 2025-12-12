import React from "react";

export type Column<T> = {
  header: string;
  accessor: keyof T | ((row: T) => React.ReactNode);
  width?: string | number;
  render?: (value: any, row: T) => React.ReactNode; // ✅ Added render prop
  className?: string;
};

type Props<T> = {
  columns: Column<T>[];
  data?: T[] | null;
  actions?: (row: T) => React.ReactNode;
  emptyMessage?: string;
  loading?: boolean;
  loadingMessage?: string;
  onRowClick?: (row: T) => void;
};

function safeGet<T, K extends keyof T>(row: T, key: K) {
  try {
    // @ts-ignore - dynamic indexing
    return row[key];
  } catch {
    return undefined;
  }
}

// Capitalize first letter
const capitalizeFirst = (text: string) =>
  text.charAt(0).toUpperCase() + text.slice(1);

const Table = <T,>({
  columns,
  data = [],
  actions,
  emptyMessage = "No data",
  loading = false,
  loadingMessage = "Loading...",
  onRowClick,
}: Props<T>) => {
  const rows = data || [];

  if (loading) {
    return (
      <div className="relative overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
        <table className="w-full text-sm text-left text-gray-700">
          <thead
            className="border-b border-gray-300 sticky top-0 z-10"
            style={{ backgroundColor: "#D4F1F4" }}
          >
            <tr>
              {columns.map((col, idx) => (
                <th
                  key={idx}
                  className="px-6 py-3 font-semibold text-gray-800 text-center"
                  style={{ width: col.width }}
                >
                  {capitalizeFirst(col.header)}
                </th>
              ))}
              {actions && (
                <th className="px-6 py-3 font-semibold text-gray-800 text-center">
                  Aksi
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td
                colSpan={columns.length + (actions ? 1 : 0)}
                className="text-center py-12"
              >
                <div className="flex flex-col items-center justify-center">
                  <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin mb-3"></div>
                  <p className="text-gray-500">{loadingMessage}</p>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <div className="relative overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
      <table className="w-full text-sm text-left text-gray-700">
        <thead
          className="border-b border-gray-300 sticky top-0 z-10"
          style={{ backgroundColor: "#D4F1F4" }}
        >
          <tr>
            {columns.map((col, idx) => (
              <th
                key={idx}
                className="px-6 py-3 font-semibold text-gray-800 text-center"
                style={{ width: col.width }}
              >
                {capitalizeFirst(col.header)}
              </th>
            ))}
            {actions && (
              <th className="px-6 py-3 font-semibold text-gray-800 text-center">
                Aksi
              </th>
            )}
          </tr>
        </thead>

        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length + (actions ? 1 : 0)}
                className="text-center py-12 text-gray-400"
              >
                <div className="flex flex-col items-center justify-center">
                  <svg
                    className="w-16 h-16 text-gray-300 mb-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    ></path>
                  </svg>
                  <p className="text-lg font-medium text-gray-500">
                    {emptyMessage}
                  </p>
                </div>
              </td>
            </tr>
          ) : (
            rows.map((row, rowIndex) => {
              const rowKey =
                (row as any)?.id !== undefined
                  ? (row as any).id
                  : `row-${rowIndex}`;

              return (
                <tr
                  key={String(rowKey)}
                  className={`transition-colors duration-200 ${
                    rowIndex % 2 === 0
                      ? "bg-white hover:bg-gray-50"
                      : "bg-gray-50 hover:bg-gray-100"
                  } ${onRowClick ? "cursor-pointer hover:bg-blue-50" : ""}`}
                  onClick={() => onRowClick && onRowClick(row)}
                >
                  {columns.map((col, colIndex) => {
                    let cell: React.ReactNode = null;
                    let rawValue: any = null;

                    // Get the raw value
                    if (typeof col.accessor === "function") {
                      try {
                        rawValue = col.accessor(row);
                      } catch {
                        rawValue = null;
                      }
                    } else {
                      rawValue = safeGet(row, col.accessor);
                    }

                    // Apply render function if provided
                    if (col.render) {
                      try {
                        cell = col.render(rawValue, row);
                      } catch (error) {
                        console.error("Error rendering cell:", error);
                        cell = <span className="text-red-500">Error</span>;
                      }
                    } else {
                      // Default rendering
                      if (rawValue === null || rawValue === undefined || rawValue === "") {
                        cell = (
                          <span className="text-gray-400 italic">-</span>
                        );
                      } else if (React.isValidElement(rawValue)) {
                        cell = rawValue;
                      } else if (typeof rawValue === "object") {
                        cell = (
                          <span className="text-gray-600">
                            {JSON.stringify(rawValue)}
                          </span>
                        );
                      } else if (typeof rawValue === "boolean") {
                        cell = (
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              rawValue
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {rawValue ? "Yes" : "No"}
                          </span>
                        );
                      } else {
                        cell = (
                          <span className="text-gray-900">
                            {String(rawValue)}
                          </span>
                        );
                      }
                    }

                    return (
                      <td
                        key={colIndex}
                        className={`px-6 py-4 align-middle ${col.className || ""}`}
                      >
                        {cell}
                      </td>
                    );
                  })}

                  {actions && (
                    <td className="px-6 py-4">
                      <div className="flex gap-2 justify-center">
                        {actions(row)}
                      </div>
                    </td>
                  )}
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
};

// Helper functions for common render scenarios
export const renderCurrency = (value: number, currency: string = "IDR") => {
  if (value === null || value === undefined) return "-";
  
  const formatter = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 0,
  });
  
  return (
    <span className="font-medium text-emerald-600">
      {formatter.format(value)}
    </span>
  );
};

export const renderDate = (value: string | Date, format: "long" | "short" | "time" = "long") => {
  if (!value) return "-";
  
  const date = new Date(value);
  if (isNaN(date.getTime())) return String(value);
  
  const options: Intl.DateTimeFormatOptions = 
    format === "short"
      ? { year: "numeric", month: "short", day: "numeric" }
      : format === "time"
      ? { hour: "2-digit", minute: "2-digit" }
      : {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        };
  
  return date.toLocaleDateString("id-ID", options);
};

export const renderStatus = (value: string, statusMap?: Record<string, { label: string; color: string }>) => {
  const defaultMap: Record<string, { label: string; color: string }> = {
    active: { label: "Active", color: "bg-green-100 text-green-800" },
    inactive: { label: "Inactive", color: "bg-red-100 text-red-800" },
    pending: { label: "Pending", color: "bg-yellow-100 text-yellow-800" },
    approved: { label: "Approved", color: "bg-blue-100 text-blue-800" },
    rejected: { label: "Rejected", color: "bg-red-100 text-red-800" },
    draft: { label: "Draft", color: "bg-gray-100 text-gray-800" },
  };
  
  const map = statusMap || defaultMap;
  const status = map[value.toLowerCase()] || {
    label: value,
    color: "bg-gray-100 text-gray-800",
  };
  
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium ${status.color}`}>
      {status.label}
    </span>
  );
};

export const renderAvatar = (name: string, imageUrl?: string) => {
  const initials = name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
  
  if (imageUrl) {
    return (
      <div className="flex items-center gap-3">
        <img
          src={imageUrl}
          alt={name}
          className="w-8 h-8 rounded-full object-cover"
        />
        <span className="font-medium">{name}</span>
      </div>
    );
  }
  
  return (
    <div className="flex items-center gap-3">
      <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-medium">
        {initials}
      </div>
      <span className="font-medium">{name}</span>
    </div>
  );
};

export default Table;