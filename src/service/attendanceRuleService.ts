import { authHeader } from "../api/auth.api";
import api from "../config/axios";

export interface AttendanceRuleRequest {
  officeLatitude?: number | null;
  officeLongitude?: number | null;
  radiusMeters?: number;
  maxLateMinutes?: number;
  maxLateCheckIn?: number;
  maxLateCheckOut?: number;
}

export interface AttendanceRuleInfo {
  id: string;
  officeLatitude: number ;
  officeLongitude: number ;
  radiusMeters: number;
  maxLateMinutes: number;
  maxLateCheckIn: number;
  maxLateCheckOut: number;
  createdAt: string;
  updatedAt: string;
}

class AttendanceRuleService {
  private base = "/attendance-rule";

  /**
   * GET /attendance-rule/data
   */
  async getRule(): Promise<AttendanceRuleInfo | null> {
    const res = await api.get(`${this.base}/data`, {
      headers: authHeader(),
    });
    return res.data || null;
  }

  /**
   * POST /attendance-rule/create
   */
  async createRule(payload: AttendanceRuleRequest): Promise<AttendanceRuleInfo> {
    const res = await api.post(`${this.base}/create`, payload, {
      headers: authHeader(),
    });
    return res.data.data as AttendanceRuleInfo;
  }

  /**
   * PUT /attendance-rule/update/:id
   */
  async updateRule(ruleId: string, payload: AttendanceRuleRequest): Promise<AttendanceRuleInfo> {
    const res = await api.put(`${this.base}/update/${ruleId}`, payload, {
      headers: authHeader(),
    });
    return res.data.data as AttendanceRuleInfo;
  }

  /**
   * DELETE /attendance-rule/delete/:id
   */
  async deleteRule(ruleId: string): Promise<void> {
    await api.delete(`${this.base}/delete/${ruleId}`, {
      headers: authHeader(),
    });
  }
}

export default new AttendanceRuleService();
