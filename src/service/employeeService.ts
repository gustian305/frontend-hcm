import { authHeader } from "../api/auth.api";
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

class EmployeeService {
  private base = "/employee-management";

  /**
   * GET /employee-management/data
   */
  async getEmployeeData(): Promise<DataEmployee> {
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
   * GET /employee-management/detail/:id
   */
  async getEmployeeDetail(
    employeeId: string
  ): Promise<EmployeeDetailResponse> {
    const res = await api.get<EmployeeDetailResponse>(
      `${this.base}/detail/${employeeId}`,
      {
        headers: authHeader(),
      }
    );
    return res.data;
  }

  /**
   * POST /employee-management/create
   */
  async createEmployee(payload: EmployeeRequest) {
    const finalPayload = {
      ...payload,
      joinedDate: ToISO(payload.joinedDate),
    };

    const res = await api.post(`${this.base}/create`, finalPayload, {
      headers: authHeader(),
    });

    return res.data;
  }

  /**
   * PUT /employee-management/update/:id
   */
  async updateEmployee(employeeId: string, payload: EmployeeRequest) {
    const finalPayload = {
      ...payload,
      joinedDate: ToISO(payload.joinedDate),
    };

    const res = await api.put(
      `${this.base}/update/${employeeId}`,
      finalPayload,
      {
        headers: authHeader(),
      }
    );

    return res.data;
  }

  /**
   * DELETE /employee-management/delete/:id
   */
  async deleteEmployee(
    employeeId: string
  ): Promise<{ message?: string }> {
    const res = await api.delete(`${this.base}/delete/${employeeId}`, {
      headers: authHeader(),
    });
    return res.data;
  }

  /**
   * GET /employee-management/template (excel template)
   */
  async getEmployeeTemplate(): Promise<Blob> {
    const res = await api.get(`${this.base}/template`, {
      headers: authHeader(),
      responseType: "blob",
    });
    return res.data;
  }

  /**
   * POST /employee-management/import
   */
  async importEmployee(file: File): Promise<void> {
    const formData = new FormData();
    formData.append("file", file);

    await api.post(`${this.base}/import`, formData, {
      headers: {
        ...authHeader(),
        "Content-Type": "multipart/form-data",
      },
    });
  }

  /**
   * GET /employee-management/export
   */
  async exportEmployee(): Promise<Blob> {
    const res = await api.get(`${this.base}/export`, {
      headers: authHeader(),
      responseType: "blob",
    });
    return res.data;
  }
}

export default new EmployeeService();
