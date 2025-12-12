import { authHeader } from "../api/auth.api";
import api from "../config/axios";
import { buildShiftRequest } from "../utils/dateTimeHelper";

// shift
export interface ShiftRequest {
  shiftName: string;
  workDayIds: string[];
  dateStart: string; // format: YYYY-MM-DD
  dateEnd: string; // format: YYYY-MM-DD
  shiftStartTime: string; // format: HH:mm
  shiftEndTime: string; // format: HH:mm
  isNightShift: boolean;
  isActive: boolean;
}

export interface WorkDaySimple {
  id: string;
  name: string;
}

export interface ShiftInfo {
  id: string;
  companyProfileId: string;
  shiftName: string;
  workDays: WorkDaySimple[];
  dateStart: string;
  dateEnd: string;
  shiftStartTime: string;
  shiftEndTime: string;

  isNightShift: boolean;
  isActive: boolean;

  createdAt: string;
  updatedAt: string;
}

export interface DataShift {
  count: number;
  data: ShiftInfo[];
}

export interface WorkDayData {
  count: number;
  data: WorkDaySimple[];
}

// =====================================

class ShiftService {
  private base = "/shift";

  /**
   * GET /shift/work-day
   */
    async getWorkDay(): Promise<WorkDayData> {
    const res = await api.get(`${this.base}/work-days`, {
      headers: authHeader(),
    });

    return {
      count: res.data.count ?? res.data.data.length,
      data: res.data.data ?? [],
    };
  }

  /**
   * GET /shift/data
   */
  async getShiftData(): Promise<DataShift> {
    const res = await api.get(`${this.base}/data`, {
      headers: authHeader(),
    });

    const mapped = res.data.data.map((s: any) => ({
      ...s,
      totalTime: s.totalTime || s.shiftTime,
      assignments: s.assignments || [],
    }));

    const finalResult: DataShift = {
      count: res.data.count ?? mapped.length,
      data: mapped,
    };

    return finalResult;
  }

  /**
   * POST /shift/create
   */
  async createShift(payload: ShiftRequest): Promise<ShiftInfo> {
    const body = buildShiftRequest(payload);
    const res = await api.post(`${this.base}/create`, body, {
      headers: authHeader(),
    });
    return res.data;
  }

  /**
   * DELETE /shift/delete/:id
   */
  async deleteShift(id: string): Promise<{ message: string }> {
    const res = await api.delete(`${this.base}/delete/${id}`, {
      headers: authHeader(),
    });
    return res.data;
  }
}

export default new ShiftService();
