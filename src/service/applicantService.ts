import { authHeader } from "../api/auth.api";
import api from "../config/axios";
import { ToISO } from "../utils/date";

export interface UpdateStatusApplicant {
  status: string;
}

export interface ApplicantRequest {
  fullName: string;
  phoneNumber: string;
  email: string;
  address: string;
  birthPlace: string;
  birthDate: string; // format: DD/MM/YYYY
  gender: string;
  cvFile: File;
  certificateFile: File;
  resume?: string;
}

export interface ApplicantPayload {
  id: string;
  jobVacancyId: string;
  companyProfileId: string;
  positionApplied: string;
  fullName: string;
  phoneNumber: string;
  email: string;
  address: string;
  birthPlace: string;
  birthDate: string;
  gender: string;
  cvFileUrl?: string;
  certificateUrl?: string;
  resume?: string;
  status: string;
  appliedAt: string;
}

export interface DataApplicant {
  count: number;
  data: ApplicantPayload[];
}

class ApplicantService {
  private base = "/landing-page";
  private baseManagement = "/applicant-management";

  async updateStatusApplicant(
    applicantId: string,
    payload: UpdateStatusApplicant
  ): Promise<ApplicantPayload> {
    const response = await api.put<ApplicantPayload>(
      `${this.baseManagement}/approved/${applicantId}`,
      payload,
      {
        headers: authHeader(),
      }
    );

    return response.data;
  }

  async createApplicant(
    companyId: string,
    jobVacancyId: string,
    payload: ApplicantRequest
  ): Promise<ApplicantPayload> {
    const formData = new FormData();
    formData.append("fullName", payload.fullName);
    formData.append("phoneNumber", payload.phoneNumber);
    formData.append("email", payload.email);
    formData.append("address", payload.address);
    formData.append("birthPlace", payload.birthPlace);
    formData.append("birthDate", ToISO(payload.birthDate) || "");
    formData.append("gender", payload.gender);
    formData.append("cvFile", payload.cvFile);
    formData.append("certificateFile", payload.certificateFile);

    if (payload.resume) {
      formData.append("resume", payload.resume);
    }

    const response = await api.post<ApplicantPayload>(
      `${this.base}/create-applicant/${companyId}/${jobVacancyId}`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );

    return response.data;
  }

  async getAllApplicants(): Promise<DataApplicant> {
    const response = await api.get<DataApplicant>(
      `${this.baseManagement}/data`
    );
    console.log("Fetched applicants:", response.data.data); // <-- log data
    return response.data;
  }

  async getApplicantDetail(applicantId: string): Promise<ApplicantPayload> {
    const response = await api.get<ApplicantPayload>(
      `${this.baseManagement}/detail/${applicantId}`
    );
    return response.data;
  }
}

export default new ApplicantService();
