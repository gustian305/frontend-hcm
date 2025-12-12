import api from "../config/axios";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface OAuthLoginRequest {
  token: string;
}

export interface VerifyOTPRequest {
  otp: string;
}

export interface CompleteProfileRequest {
  name: string;
  phoneNumber: string;
  companyName: string;
}

export interface PermissionInfo {
  id?: string;
  name: string;
  action: string;
  resource: string;
}

export interface UserInfo {
  id: string;
  employeeId?: string;
  name: string;
  email?: string;
  role?: string;
  permission?: PermissionInfo[];
  verified?: boolean;
}

export interface CompanyInfo {
  id: string;
  isActive: boolean;
  isTrial: boolean;
  companyName: string;
  employeeCount: number;
  startDate?: string;
  endDate?: string;
  packageName?: string;
}

export interface AuthResponse {
  accessToken: string;
  otpRequest: boolean;
  needsProfile: boolean;
  userInfo: UserInfo;
  companyInfo: CompanyInfo;
}

export interface ResendOTPResponse {
  message: string;
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

export const login = async (payload: LoginRequest): Promise<AuthResponse> => {
    const res = await api.post<AuthResponse>("/login", payload);
    return res.data;
}

export const oauthLogin = async (payload: OAuthLoginRequest): Promise<AuthResponse> => {
    const res = await api.post<AuthResponse>("/oauth", payload);
    return res.data;
}

export const VerifyOTPLogin = async (
  userId: string,
  otp: string
): Promise<AuthResponse> => {
  const res = await api.post(`/verify-otp/${userId}`, { otp });
  return res.data;
};

export const ResendOTPLogin = async (
  userId: string
): Promise<ResendOTPResponse> => {
  const res = await api.post(`/resend-otp/${userId}`);
  return res.data;
};

export const CompleteProfile = async (
  userId: string,
  payload: CompleteProfileRequest
): Promise<AuthResponse> => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Token not found");

  const res = await api.post<AuthResponse>(
    `/complete-profile/${userId}`, 
    payload,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  return res.data;
};

export const Logout = async (): Promise<void> => {
  try {
    await api.post("/logout", {}, authHeader());
  } catch (err) {
    console.error("Logout error:", err);
  } finally {
    localStorage.removeItem("token"); 
  }
};