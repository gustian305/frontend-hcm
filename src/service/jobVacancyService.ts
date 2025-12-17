import api from "../config/axios";
import { ToISO } from "../utils/date";




export interface JobVacancyRequest {
  location: string;
  position: string;
  jobType: string;
  description: string;
  qualifications: string[];
  publishedDate: string;
  closedDate: string;
}

export interface JobVacancyInfo {
  id: string;
  companyProfileId: string;
  picture?: string;
  companyName: string;
  location: string;
  position: string;
  jobType: string;
  description: string;
  qualification: string[];
  publishedDate: string;
  closedDate: string;
}

export interface DataJobVacancy {
  count: number;
  data: JobVacancyInfo[];
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

export class JobVacancyService {
  static async getAllDataJobVacancyPublic(): Promise<DataJobVacancy> {
    const response = await api.get<DataJobVacancy>(
      "landing-page/data-job-vacancy",
    );
    return response.data;
  }

  static async detailJobVacancyPublic(jobVacancyId: string): Promise<JobVacancyInfo> {
    const response = await api.get<JobVacancyInfo>(
      `landing-page/detail-job-vacancy/${jobVacancyId}`,
    );
    return response.data;
  }

  // GET /job-vacancy/data
  static async getAllData(): Promise<DataJobVacancy> {
    const response = await api.get<DataJobVacancy>(
      "job-vacancy/data",
      authHeader()
    );
    return response.data;
  }

  // GET /job-vacancy/data/:job_vacancy_id
  static async detail(jobVacancyId: string): Promise<JobVacancyInfo> {
    const response = await api.get<JobVacancyInfo>(
      `job-vacancy/data/${jobVacancyId}`,
      authHeader()
    );
    return response.data;
  }

  static async create(payload: JobVacancyRequest): Promise<JobVacancyInfo> {
    const formatted = {
      ...payload,
      publishedDate: payload.publishedDate
        ? ToISO(payload.publishedDate)
        : null,
      closedDate: payload.closedDate ? ToISO(payload.closedDate) : null,
    };

    const response = await api.post<JobVacancyInfo>(
      "job-vacancy/create",
      formatted,
      authHeader()
    );

    return response.data;
  }

  static async update(
    jobVacancyId: string,
    payload: JobVacancyRequest
  ): Promise<JobVacancyInfo> {
    const formatted = {
      ...payload,
      publishedDate: payload.publishedDate
        ? ToISO(payload.publishedDate)
        : null,
      closedDate: payload.closedDate ? ToISO(payload.closedDate) : null,
    };

    const response = await api.put<JobVacancyInfo>(
      `job-vacancy/update/${jobVacancyId}`,
      formatted,
      authHeader()
    );

    return response.data;
  }

  // DELETE /job-vacancy/delete/:job_vacancy_id
  static async delete(jobVacancyId: string): Promise<{ message: string }> {
    const response = await api.delete<{ message: string }>(
      `job-vacancy/delete/${jobVacancyId}`,
      authHeader()
    );
    return response.data;
  }
}
