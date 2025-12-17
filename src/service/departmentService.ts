// service/departmentService.ts
import { authHeader } from "../api/auth.api";
import api from "../config/axios";

export interface DepartmentRequest {
  name: string;
}

export interface DepartmentPayload {
  id: string;
  name: string;
  createdAt: string;
}

export interface DataDepartment {
  count: number;
  data: DepartmentPayload[];
}

// ====================================

class DepartmentService {
  private base = "/department";

  /**
   * GET /department/data
   */
  async getDepartmentData(): Promise<DataDepartment> {
    const res = await api.get(`${this.base}/data`, {
      headers: authHeader(),
    });

    const raw = res.data.data;

    return {
      count: res.data.count ?? (raw.rows?.length ?? raw.length),
      data: raw.rows ?? raw,
    };
  }

  /**
   * POST /department/create
   */
  async createDepartment(
    payload: DepartmentRequest
  ): Promise<DepartmentPayload> {
    const res = await api.post(`${this.base}/create`, payload, {
      headers: authHeader(),
    });
    return res.data;
  }

  /**
   * PUT /department/update/:id
   */
  async updateDepartment(
    departmentId: string,
    payload: DepartmentRequest
  ): Promise<DepartmentPayload> {
    const res = await api.put(
      `${this.base}/update/${departmentId}`,
      payload,
      {
        headers: authHeader(),
      }
    );
    return res.data;
  }

  /**
   * DELETE /department/delete/:id
   */
  async deleteDepartment(
    departmentId: string
  ): Promise<{ id: string }> {
    const res = await api.delete(
      `${this.base}/delete/${departmentId}`,
      {
        headers: authHeader(),
      }
    );
    return res.data;
  }
}

export default new DepartmentService();
