// service/departmentService.ts
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

const authHeader = () => {
  const token = localStorage.getItem("token");
  if (!token) return { headers: {} };

  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

// FIXED: name function harus lowercase
export const dataDepartment = async (): Promise<DataDepartment> => {
  const res = await api.get("/department/data", {
    ...authHeader(),
  });

  const raw = res.data.data;

  return {
    count: res.data.count ?? raw.length,
    data: raw.rows ?? raw,
  };
};

export const createDepartment = async (
  payload: DepartmentRequest
): Promise<DepartmentPayload> => {
  const res = await api.post<DepartmentPayload>(
    "/department/create",
    payload,
    authHeader()
  );
  return res.data;
};

export const updateDepartment = async (
  departmentId: string,
  payload: DepartmentRequest
): Promise<DepartmentPayload> => {
  const res = await api.put<DepartmentPayload>(
    `/department/update/${departmentId}`,
    payload,
    authHeader()
  );
  return res.data;
};

export const deleteDepartment = async (
  departmentId: string
): Promise<{ id: string }> => {
  const res = await api.delete<{ id: string }>(
    `/department/delete/${departmentId}`,
    authHeader()
  );
  return res.data;
};
