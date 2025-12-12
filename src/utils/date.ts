export const formatDateInput = (value: string | Date | null): string => {
  if (!value) return "";

  const dateObj = value instanceof Date ? value : new Date(value);
  if (isNaN(dateObj.getTime())) return "";

  return dateObj.toISOString().split("T")[0];
};

export const formatDate = (dateStr: string) => {
  if (!dateStr) return "-";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr; // fallback biar tidak "Invalid date"
  return d.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};


export const toISOTime = (timeStr: string): string => {
  // timeStr format: "HH:mm"
  const [hour, minute] = timeStr.split(":").map(Number);

  const d = new Date();
  d.setHours(hour, minute, 0, 0);

  return d.toISOString();
}

export const ToISO = (dateStr: string | null | undefined) => {
  if (!dateStr) return null;

  const parsed = new Date(dateStr);
  if (isNaN(parsed.getTime())) return null; // ⬅ cegah error

  return parsed.toISOString();
};


export const combineDateAndTimeToISO = (dateStr: string, timeStr: string): string => {
  if (!dateStr || !timeStr) return "";

  const [hour, minute] = timeStr.split(":").map(Number);
  const date = new Date(dateStr);

  // Set jam & menit
  date.setHours(hour, minute, 0, 0);

  return date.toISOString();
};

export const timeToTodayISO = (timeStr: string): string => {
  const [hour, minute] = timeStr.split(":").map(Number);

  const d = new Date(Date.UTC(1970, 0, 1, hour, minute, 0, 0));
  return d.toISOString();
};


export function buildISODateTime(time: string): string {
  const today = new Date();
  const [hour, minute] = time.split(":").map(Number);

  today.setHours(hour);
  today.setMinutes(minute);
  today.setSeconds(0);
  today.setMilliseconds(0);

  return today.toISOString(); 
}

// ========================

// Helper function untuk format tanggal dengan validasi


// Helper function untuk format currency dengan validasi


// Helper function untuk safe parse integer
export const safeParseInt = (value: any): number | null => {
  if (value === null || value === undefined || value === "") {
    return null;
  }
  
  try {
    // Coba parse sebagai integer
    const parsed = parseInt(value, 10);
    return isNaN(parsed) ? null : parsed;
  } catch (error) {
    console.error("Error parsing integer:", error);
    return null;
  }
};