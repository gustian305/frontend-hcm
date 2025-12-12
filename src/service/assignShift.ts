import { authHeader } from "../api/auth.api";
import api from "../config/axios";

// REQUESTS
export interface AssignShiftRequest {
  employeeIDs: string[]; // min 1
  shiftId: string;
}

export interface SwitchShiftRequest {
  fromShiftID: string;
  toShiftID: string;
  employeeIDs: string[];
}

export interface RemoveShiftRequest {
  employeeIDs: string[]; // min 1
  shiftId: string;
}

// RESPONSE INFO
export interface AssignShiftInfo {
  id: string;
  employeeId: string;
  shiftId: string;

  employeeName: string;
  employeePicture: string;

  shiftName: string;

  isActive: boolean;

  createdAt: string;
  updatedAt: string;
}

// RESPONSE WRAPPER
export interface AssignShiftData {
  count: number;
  data: AssignShiftInfo[];
}

class AssignShift {
  private base = "/shift";

  /**
   * POST /shift/assign-shift
   */
  async assignShift(payload: AssignShiftRequest): Promise<AssignShiftInfo[]> {
    const res = await api.post(`${this.base}/assign-shift`, payload, {
      headers: authHeader(),
    });
    return res.data?.data || [];
  }

  /**
   * POST /shift/switch-shift
   */
  async switchShift(payload: SwitchShiftRequest): Promise<AssignShiftInfo[]> {
    const res = await api.post(`${this.base}/switch-shift`, payload, {
      headers: authHeader(),
    });
    return res.data?.data || [];
  }

  /**
   * POST /shift/remove-employees
   */
  async removeEmployees(
    payload: RemoveShiftRequest
  ): Promise<AssignShiftInfo[]> {
    const res = await api.post(`${this.base}/remove-employees`, payload, {
      headers: authHeader(),
    });
    return res.data?.data || [];
  }

  /**
   * GET /shift/assigments
   */
  async getAssignments(): Promise<AssignShiftData> {
    const res = await api.get(`${this.base}/assigments`, {
      headers: authHeader(),
    });
    return res.data;
  }
}

export default new AssignShift();
