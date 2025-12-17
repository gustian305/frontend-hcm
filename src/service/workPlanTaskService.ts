import api from "../config/axios";
import { ToISO } from "../utils/date";

// ===============================
// WORK PLAN REQUEST DTO
// ===============================
export interface WorkPlanRequest {
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  status: string;
  department?: string[]; // optional
}

// ===============================
// WORK TASK REQUEST DTO
// ===============================
export interface WorkTaskRequest {
  name?: string;
  startDate?: string;
  endDate?: string;
  status?: string;
  priority?: string;
  assignedTo?: string[];
}

// ===============================
// WORK PLAN PAYLOAD DTO
// ===============================
export interface DepartmentList {
  id: string;
  name: string;
}

export interface WorkPlanPayload {
  id: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  status: string;
  department?: DepartmentList[];
  createdBy: string;
}

export interface DataWorkPlan {
  count: number;
  data: WorkPlanPayload[];
}

// ===============================
// WORK TASK PAYLOAD DTO
// ===============================
export interface AssignedEmployees {
  id: string;
  fullName: string;
}

export interface WorkTaskPayload {
  id: string;
  workPlanId: string;
  name: string;
  description: string;
  status: string;
  priority: string;
  startDate: string;
  endDate: string;
  assignedTo?: AssignedEmployees[];
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface DataWorkTask {
  count: number;
  data: WorkTaskPayload[];
}

const authHeader = () => {
  const token = localStorage.getItem("token");
  if (!token) return { headers: {} };

  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

class WorkPlanTaskService {
  // ============================================
  // WORK PLAN SERVICE
  // ============================================
  private base = "/work-plan";
  private taskBase = "/task";

  // GET /work-plan/data
  async getAllWorkPlans(): Promise<DataWorkPlan> {
    const res = await api.get(`${this.base}/data`, authHeader());

    // mapping sekaligus fallback
    const mapped = res.data.data.map((wp: any) => ({
      ...wp,
      department: wp.department || null,
      position: wp.position || null,
      tasks: wp.tasks || [],
      periodStart: wp.periodStart || wp.startDate,
      periodEnd: wp.periodEnd || wp.endDate,
    }));

    const finalResult: DataWorkPlan = {
      count: res.data.count ?? mapped.length,
      data: mapped,
    };

    return finalResult;
  }

  // GET /work-plan/details/:work_plan_id
  async detailWorkPlan(workPlanId: string): Promise<WorkPlanPayload> {
    const response = await api.get<WorkPlanPayload>(
      `${this.base}/details/${workPlanId}`,
      authHeader()
    );
    return response.data;
  }

  // POST /work-plan/create
  async createWorkPlan(payload: WorkPlanRequest): Promise<WorkPlanPayload> {
    const formatted = {
      ...payload,
      startDate: payload.startDate ? ToISO(payload.startDate) : null,
      endDate: payload.endDate ? ToISO(payload.endDate) : null,
    };

    const response = await api.post<WorkPlanPayload>(
      `${this.base}/create`,
      formatted,
      authHeader()
    );

    return response.data;
  }

  // PUT /work-plan/update/:work_plan_id
  async updateWorkPlan(
    workPlanId: string,
    payload: WorkPlanRequest
  ): Promise<WorkPlanPayload> {
    const formatted = {
      ...payload,
      startDate: payload.startDate ? ToISO(payload.startDate) : null,
      endDate: payload.endDate ? ToISO(payload.endDate) : null,
    };

    const response = await api.put<WorkPlanPayload>(
      `${this.base}/update/${workPlanId}`,
      formatted,
      authHeader()
    );

    return response.data;
  }

  // DELETE /work-plan/delete/:work_plan_id
  async deleteWorkPlan(workPlanId: string): Promise<{ message: string }> {
    const response = await api.delete<{ message: string }>(
      `${this.base}/delete/${workPlanId}`,
      authHeader()
    );
    return response.data;
  }

  // ============================================
  // WORK TASK SERVICE
  // ============================================

  // GET /task/data/:work_plan_id
  async getTasks(workPlanId: string): Promise<DataWorkTask> {
    const response = await api.get<DataWorkTask>(
      `${this.taskBase}/data/${workPlanId}`,
      authHeader()
    );
    return response.data;
  }

  // GET /task/details/:work_plan_id/:task_id
  async detailTask(
    workPlanId: string,
    taskId: string
  ): Promise<WorkTaskPayload> {
    const response = await api.get<WorkTaskPayload>(
      `${this.taskBase}/details/${workPlanId}/${taskId}`,
      authHeader()
    );
    return response.data;
  }

  // POST /task/create/:work_plan_id
  async createTask(
    workPlanId: string,
    payload: WorkTaskRequest
  ): Promise<WorkTaskPayload> {
    const formatted = {
      ...payload,
      startDate: payload.startDate ? ToISO(payload.startDate) : null,
      endDate: payload.endDate ? ToISO(payload.endDate) : null,
    };

    const response = await api.post<WorkTaskPayload>(
      `${this.taskBase}/create/${workPlanId}`,
      formatted,
      authHeader()
    );

    return response.data;
  }

  // PUT /task/update/:work_plan_id/:task_id
  async updateTask(
    workPlanId: string,
    taskId: string,
    payload: WorkTaskRequest
  ): Promise<WorkTaskPayload> {
    const formatted = {
      ...payload,
      startDate: payload.startDate ? ToISO(payload.startDate) : null,
      endDate: payload.endDate ? ToISO(payload.endDate) : null,
    };

    const response = await api.put<WorkTaskPayload>(
      `${this.taskBase}/update/${workPlanId}/${taskId}`,
      formatted,
      authHeader()
    );

    return response.data;
  }

  // DELETE /task/delete/:work_plan_id/:task_id
  async deleteTask(
    workPlanId: string,
    taskId: string
  ): Promise<{ message: string }> {
    const response = await api.delete<{ message: string }>(
      `${this.taskBase}/delete/${workPlanId}/${taskId}`,
      authHeader()
    );
    return response.data;
  }
}

export default new WorkPlanTaskService();
