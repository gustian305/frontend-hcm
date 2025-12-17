import { authHeader } from "../api/auth.api";
import api from "../config/axios";
import { ShiftInfo } from "./shiftService";

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
  endTime: string;   // format HH:MM
  idCardNumber: string;
  employeeName: string;
  date: string;      // format YYYY-MM-DD

  // Check-in
  checkInTime?: string;      // format HH:MM:SS
  statusCheckIn?: string;    // "absen masuk"
  checkInNote?: string;      // "tepat waktu" / "terlambat <menit>"

  // Check-out
  checkOutTime?: string;     // format HH:MM:SS
  statusCheckOut?: string;   // "absen keluar"
  checkOutNote?: string;     // "pulang lebih awal <menit>" / "tepat waktu"
  workDuration?: string;     // format hh:mm:ss

  // Lokasi
  latitude?: number | null;
  longitude?: number | null;
}


export interface DataAttendance {
  count: number;
  data: AttendanceInfo[];
}

export interface GetEmployeeShiftResponse {
  shiftAssigmentId: string;
  employeeId: string;
  shift: ShiftInfo;
}

// ==================== API Calls ====================

class AttendanceService {
  private base = "/attendance";

  /**
   * POST /attendance/check-in
   */
  async attendanceCheckIn(payload: AttendanceRequest): Promise<AttendanceInfo> {
    const res = await api.post(`${this.base}/check-in`, payload, {
      headers: authHeader(),
    });
    return res.data.data as AttendanceInfo;
  }

  /**
   * POST /attendance/check-out
   */
  async attendanceCheckOut(payload: AttendanceRequest): Promise<AttendanceInfo> {
    const res = await api.post(`${this.base}/check-out`, payload, {
      headers: authHeader(),
    });
    return res.data.data as AttendanceInfo;
  }

  /**
   * GET /attendance/shift/active
   */
  async getEmployeeActiveShift(): Promise<GetEmployeeShiftResponse> {
    console.log("[ATTENDANCE] Fetching active shift...");

    const res = await api.get(`${this.base}/shift/active`, {
      headers: authHeader(),
    });

    // console.log("[ATTENDANCE] Raw response:", res.data);

    // if (!res.data || !res.data.shift) {
    //   throw new Error("NO_ACTIVE_SHIFT");
    // }

    return res.data as GetEmployeeShiftResponse;
  }

  /**
   * GET /attendance/:employeeId/history
   */
  async getAttendanceHistory(
    employeeId: string
  ): Promise<DataAttendance> {
    const res = await api.get(`${this.base}/${employeeId}/history`, {
      headers: authHeader(),
    });

    const raw = res.data.data;
    console.log("[AttendanceService] parsed attendance data history:", raw);

    return {
      count: res.data.count ?? raw.rows?.length ?? raw.length,
      data: raw.rows ?? raw,
    };
  }

  /**
   * GET /attendance/data
   */
  async getAttendanceData(): Promise<DataAttendance> {
    const res = await api.get(`${this.base}/data`, {
      headers: authHeader(),
    });

    const raw = res.data.data;

    console.log("[AttendanceService] parsed attendance data management:", raw);

    return {
      count: res.data.count ?? raw.rows?.length ?? raw.length,
      data: raw.rows ?? raw,
    };
  }
}

export default new AttendanceService();
