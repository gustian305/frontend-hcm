import api from "../config/axios";

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  newPassword: string;
  confirmPassword: string;
}

export interface ResetPasswordRessponse {
  message: string;
}

export const ForgotPassword = async (
  payload: ForgotPasswordRequest
): Promise<ResetPasswordRessponse> => api.post("/forgot-password", payload);

export const ResetPassword = async (
  token: string,
  payload: ResetPasswordRequest
): Promise<ResetPasswordRessponse> => {
  const res = await api.post(`/reset-password/${token}`, payload);
  return res.data;
};
