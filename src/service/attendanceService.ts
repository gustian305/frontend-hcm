import api from "../config/axios";

export interface AttendanceRequest {
  employeeId: string;
  shiftId?: string; 

  latitude?: number | null;
  longitude?: number | null;
}

export interface AttendanceInfo {
  id: string;
  employeeId: string;
  shiftId: string;

  shiftName: string;
  startTime: string; // format HH:MM
  endTime: string; // format HH:MM
  idCardNumber: string;
  employeeName: string;
  date: string;
  checkInTime?: string; // format HH:MM
  checkOutTime?: string; // format HH:MM
  status: string;

  latitude?: number | null;
  longitude?: number | null;
}

export interface DataAttendance {
  count: number;
  data: AttendanceInfo[];
}

const authHeader = () => {
  const token = localStorage.getItem("token");
  if (!token) return { headers: {} };
  return { headers: { Authorization: `Bearer ${token}` } };
};

// ==================== API Calls ====================

export const createAttendance = async (
  payload: AttendanceRequest
): Promise<AttendanceInfo> => {
  const res = await api.post("/attendance/create", payload, authHeader());
  return res.data.data as AttendanceInfo;
};

export const getAttendanceHistory = async (
  employeeId: string
): Promise<DataAttendance> => {
  const res = await api.get(`/attendance/${employeeId}/history`, authHeader());
  const raw = res.data.data;

  return {
    count: res.data.count ?? raw.length,
    data: raw.rows ?? raw,
  };
};

export const getAttendanceData = async (): Promise<DataAttendance> => {
  const res = await api.get("/attendance/data", authHeader());
  const raw = res.data.data;

  return {
    count: res.data.count ?? raw.length,
    data: raw.rows ?? raw,
  };
};
