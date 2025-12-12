import api from "../config/axios";
import { ToISO } from "../utils/date";
import { DepartmentPayload } from "./departmentService";
import { RolePermissionPayload } from "./rolePermissionService";
import { ShiftInfo } from "./shiftService";

export interface EmployeeRequest {
  idCardNumber: string;
  email: string;
  fullName: string;
  departmentId: string;
  roleId: string;
  employmentStatus: string;
  joinedDate: string;
  status: string;
  isVerified: boolean;
}

export interface EmployeePayload {
  id: string;
  userId: string;
  companyProfileId: string;
  departmentId: string;
  roleId: string;
  email: string;
  passwordDefault: string;
  isVerified: boolean;
  idCardNumber: string;
  fullName: string;
  departmentName: string;
  roleName: string;
  employmentStatus: string;
  joinedDate: string;
  status: string;
  phoneNumber: string;
  picture: string;
  shift: ShiftInfo | null;
}

export interface Certification {
  name: string;
}

export interface Children {
  name: string;
}

export interface DataEmployee {
  count: number;
  data: EmployeePayload[];
}

export interface EmployeeDetailResponse {
  id: string;

  // === INFORMASI PRIBADI ===
  picture: string;
  fullName: string;
  email: string;
  birthPlace: string;
  birthDate: string;
  gender: string;
  ktpNumber: string;
  npwpNumber: string;
  maritalStatus: string;
  citizenship: string;
  religion: string;
  address: string;
  domicileAddress: string;
  bloodType: string;

  // === DATA PEKERJAAN ===
  isVerified: boolean;
  idCardNumber: string;
  joinedDate: string;
  employmentStatus: string;
  resignDate: string;
  status: string;
  role: RolePermissionPayload | null;
  department: DepartmentPayload | null;
  shift: ShiftInfo | null;

  // === INFORMASI KONTAK ===
  phoneNumber: string;
  emergencyPhone: string;

  // === DATA PENDIDIKAN DAN SERTIFIKASI ===
  lastEducation: string;
  educationInstitute: string;
  major: string;
  graduationYear: string;
  certification: Certification[];

  // === DATA KELUARGA ===
  spouseName: string;
  children: Children[];

  // === DATA KESEHATAN ===
  bpjsForHealth: string;
  bpjsForWork: string;
  height: string;
  weight: string;
  diseaseHistory: string;
  lastMedicalCheck: string;

  // === DATA ADMINISTRASI DAN PAYROLL ===
  bankAccountNumber: string;
  bankName: string;
  bankAccountName: string;
  taxStatus: string;
  basicSalary: number;
  allowances: number;
  totalIncome: number;
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

export const dataEmployee = async (): Promise<DataEmployee> => {
  const res = await api.get("/employee-management/data", {
    ...authHeader(),
  });

  const payload = res.data.data;

  return {
    count: res.data.count ?? payload.length,
    data: payload.rows ?? payload,
  };
};

export const detailEmployee = async (
  employeeId: string
): Promise<EmployeeDetailResponse> => {
  const res = await api.get<EmployeeDetailResponse>(
    `/employee-management/detail/${employeeId}`,
    {
      ...authHeader(),
    }
  );
  return res.data;
};
export const createEmployee = async (payload: EmployeeRequest) => {
  const finalPayload = { ...payload, joinedDate: ToISO(payload.joinedDate) };

  const res = await api.post("/employee-management/create", finalPayload, {
    ...authHeader(),
  });

  return res.data;
};

export const updateEmployee = async (
  employeeId: string,
  payload: EmployeeRequest
) => {
  const finalPayload = { ...payload, joinedDate: ToISO(payload.joinedDate) };

  const res = await api.put(
    `/employee-management/update/${employeeId}`,
    finalPayload,
    {
      ...authHeader(),
    }
  );

  return res.data;
};

export const deleteEmployee = async (
  employeeId: string
): Promise<{ message?: string }> => {
  const res = await api.delete(`/employee-management/delete/${employeeId}`, {
    ...authHeader(),
  });
  return res.data;
};

export const employeeTemplateData = async (): Promise<Blob> => {
  const res = await api.get("/employee-management/template", {
    ...authHeader(),
    responseType: "blob",
  });
  return res.data;
};

export const importEmployee = async (file: File): Promise<void> => {
  const formData = new FormData();
  formData.append("file", file);

  await api.post("/employee-management/import", formData, {
    ...authHeader(),
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const exportEmployee = async (): Promise<Blob> => {
  const res = await api.get("/employee-management/export", {
    ...authHeader(),
    responseType: "blob",
  });
  return res.data;
};
