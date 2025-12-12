import api from "../config/axios";

export interface LoginRequest {
    email: string;
    password: string;
}

export interface OAuthLoginRequest {
    token: string;
}

export interface UserData {
    userId: string;
    employeeId: string;
    companyId?: string;
    roleId: string;
    name: string;
    email: string;
    role: string;
    isVerified: boolean;   
}

export interface LoginResponse {
  isNew: boolean;
  requiresOTP: boolean;
  needsProfile: boolean;
  data: UserData;
}


export const login = async (payload: LoginRequest): Promise<LoginResponse> => {
    const res = await api.post<LoginResponse>("/login", payload);
    return res.data;
}

export const oauthLogin = async (payload: OAuthLoginRequest): Promise<LoginResponse> => {
    const res = await api.post<LoginResponse>("/oauth", payload);
    return res.data;
}