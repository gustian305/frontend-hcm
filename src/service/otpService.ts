import api from "../config/axios";
import { PermissionInfo } from "./rolePermissionService";

export interface VerifyOTPRequest {
  otp: string;
}

export interface VerifyOTPResponse {
  accessToken: string;
  needsProfile: boolean;
  userId: string;
  employeeId?: string;
  companyId?: string;
  roleId?: string;
  companyName: string;
  name: string;
  email: string;
  role: string;
  permission: PermissionInfo[];
}

export interface VerifyOTPForgotPasswordResponse {
  message: string;
  ressetToken: string;
}

export interface ResendOTPResponse {
  message: string;
}

export const VerifyOTPLogin = async (
  userId: string,
  otp: string
): Promise<VerifyOTPResponse> => {
  const res = await api.post(`/verify-otp/${userId}`, { otp });
  return res.data;
};

export const ResendOTPLogin = async (
  userId: string
): Promise<ResendOTPResponse> => {
  const res = await api.post(`/resend-otp/${userId}`);
  return res.data;
};

export const VerifyOTPForgotPassword = async (
  userId: string,
  otp: string
): Promise<VerifyOTPForgotPasswordResponse> => {
  const res = await api.post(`/verify-otp-forgot-password/${userId}`, { otp });
  return res.data;
};

export const ResendOTPForgotPassword = async (
  userId: string
): Promise<ResendOTPResponse> => {
  const res = await api.post(`/verify-otp-forgot-password/${userId}`);
  return res.data;
};
