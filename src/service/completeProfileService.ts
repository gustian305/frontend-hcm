import api from "../config/axios";

export interface CompleteProfileRequest {
  name: string;
  phoneNumber: string;
  companyName: string;
}

export interface CompleteProfilePayload {
  userId: string;
  employeeId: string;
  companyProfileId: string;
  name: string;
  email: string;
  phoneNumber: string;
  companyName: string;
  role: string;
  permission: string[];
  needsProfile: boolean;
  employeeCount: number;
  isActive: boolean;
  trialEnd: string;
}

export interface CompleteProfileResponse {
  message: string;
  accessToken: string;
  data: CompleteProfilePayload;
}

export const CompleteProfile = async (
  userId: string,
  payload: CompleteProfileRequest
): Promise<CompleteProfileResponse> => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Token not found");

  const res = await api.post<CompleteProfileResponse>(
    `/complete-profile/${userId}`, 
    payload,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  return res.data;
};
