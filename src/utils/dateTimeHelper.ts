// utils/dateTimeHelper.ts
export const formatDateInput = (dateString: string | undefined): string => {
  if (!dateString) return "";

  try {
    // Jika sudah format YYYY-MM-DD, return langsung
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
      return dateString;
    }

    // Coba parse dengan new Date
    const date = new Date(dateString);

    // Jika valid, format ke YYYY-MM-DD
    if (!isNaN(date.getTime())) {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    }

    // Jika new Date gagal, coba parse format Indonesia
    // Contoh: "7 September 2025"
    const dateParts = dateString.split(" ");
    if (dateParts.length === 3) {
      const day = dateParts[0];
      const month = dateParts[1];
      const year = dateParts[2];

      const monthMap: { [key: string]: string } = {
        Januari: "01",
        Februari: "02",
        Maret: "03",
        April: "04",
        Mei: "05",
        Juni: "06",
        Juli: "07",
        Agustus: "08",
        September: "09",
        Oktober: "10",
        November: "11",
        Desember: "12",
      };

      const monthNumber = monthMap[month] || "01";
      const formattedDay = day.padStart(2, "0");

      return `${year}-${monthNumber}-${formattedDay}`;
    }

    return dateString;
  } catch (error) {
    console.error("Error formatting date:", error, dateString);
    return "";
  }
};

export function formatDateForDisplay(date: Date | string | null): string {
  if (!date) return "-";
  const d = typeof date === "string" ? new Date(date) : date;
  if (isNaN(d.getTime())) return "-";

  return d.toLocaleDateString("id-ID", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

// utils/dateTimeHelper.ts
export const formatCurrency = (value: number | string): string => {
  if (value === undefined || value === null) return "Rp 0";
  
  let numericValue = 0;
  
  if (typeof value === 'string') {
    // Extract number from currency string
    const numericString = value.replace(/[^0-9.-]+/g, "");
    numericValue = parseFloat(numericString) || 0;
  } else {
    numericValue = value;
  }
  
  // Format dengan separator ribuan
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(numericValue);
};

export function formatDateToYMD(date: Date | string | null): string {
  if (!date) return "";
  const d = typeof date === "string" ? new Date(date) : date;
  if (isNaN(d.getTime())) return "";
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
    2,
    "0"
  )}-${String(d.getDate()).padStart(2, "0")}`;
}

export function formatTimeToHM(date: Date | string | null): string {
  if (!date) return "";
  const d = typeof date === "string" ? new Date(date) : date;
  if (isNaN(d.getTime())) return "";
  return `${String(d.getHours()).padStart(2, "0")}:${String(
    d.getMinutes()
  ).padStart(2, "0")}`;
}

export function parseDateFromString(dateStr: string): Date | null {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  return isNaN(d.getTime()) ? null : d;
}

export function parseTimeFromHM(timeStr: string): Date | null {
  if (!timeStr) return null;
  const [hour, minute] = timeStr.split(":").map(Number);
  const d = new Date();
  d.setHours(hour);
  d.setMinutes(minute);
  d.setSeconds(0);
  return isNaN(d.getTime()) ? null : d;
}

export function buildShiftRequest(data: {
  shiftName: string;
  workDayIds: string[];
  dateStart: Date | string;
  dateEnd: Date | string;
  shiftStartTime: string; // string HH:mm langsung
  shiftEndTime: string;
  isNightShift: boolean;
  isActive: boolean;
}) {
  return {
    shiftName: data.shiftName,
    workDayIds: data.workDayIds,
    dateStart: formatDateToYMD(data.dateStart),
    dateEnd: formatDateToYMD(data.dateEnd),
    shiftStartTime: data.shiftStartTime, // jangan pakai formatTimeToHM
    shiftEndTime: data.shiftEndTime, // jangan pakai formatTimeToHM
    isNightShift: data.isNightShift,
    isActive: data.isActive,
  };
}
