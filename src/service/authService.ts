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
  shiftId?: string;
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

export interface ForgotPasswordRequest {
  email: string;
}

export interface ForgotPasswordResponse {
  userId: string;
}

export interface VerifyOTPPasswordResponse {
  resetToken: string;
}

export interface ResetPasswordRequest {
  newPassword: string;
  confirmPassword: string;
}

export interface ResetPasswordResponse {
  message: string;
}

class AuthService {
  async login(payload: LoginRequest): Promise<AuthResponse> {
    const res = await api.post<AuthResponse>("/login", payload, {
      headers: { "X-Public-Request": "true" },
    });
    return res.data;
  }

  async oauthLogin(payload: OAuthLoginRequest): Promise<AuthResponse> {
    const res = await api.post<AuthResponse>("/oauth", payload, {
      headers: { "X-Public-Request": "true" },
    });
    return res.data;
  }

  async verifyOTP(userId: string, otp: string): Promise<AuthResponse> {
    const res = await api.post<AuthResponse>(
      `/verify-otp/${userId}`,
      { otp },
      {
        headers: { "X-Public-Request": "true" },
      }
    );
    return res.data;
  }

  async verifyOTPResetPassword(
    userId: string,
    otp: string
  ): Promise<VerifyOTPPasswordResponse> {
    const res = await api.post<VerifyOTPPasswordResponse>(
      `/verify-otp-forgot-password/${userId}`,
      { otp },
      { headers: { "X-Public-Request": "true" } }
    );
    return res.data;
  }

  async resendOTP(userId: string): Promise<ResendOTPResponse> {
    const res = await api.post<ResendOTPResponse>(
      `/resend-otp/${userId}`,
      {},
      {
        headers: { "X-Public-Request": "true" },
      }
    );
    return res.data;
  }

  async resendOTPResetPassword(userId: string): Promise<ResendOTPResponse> {
    const res = await api.post<ResendOTPResponse>(
      `/resend-otp-forgot-password/${userId}`,
      {},
      {
        headers: { "X-Public-Request": "true" },
      }
    );
    return res.data;
  }

  async forgotPassword(
    payload: ForgotPasswordRequest
  ): Promise<ForgotPasswordResponse> {
    const res = await api.post<ForgotPasswordResponse>(
      "/forgot-password",
      payload,
      { headers: { "X-Public-Request": "true" } }
    );
    return res.data;
  }

  async resetPassword(
    token: string,
    payload: ResetPasswordRequest
  ): Promise<ResetPasswordResponse> {
    const res = await api.post<ResetPasswordResponse>(
      `/reset-password/${token}`,
      payload,
      { headers: { "X-Public-Request": "true" } }
    );
    return res.data;
  }

  async completeProfile(
    userId: string,
    payload: CompleteProfileRequest
  ): Promise<AuthResponse> {
    const res = await api.post<AuthResponse>(
      `/complete-profile/${userId}`,
      payload
    );
    return res.data;
  }

  async logout(): Promise<void> {
    try {
      await api.post("/logout");
    } finally {
      localStorage.removeItem("token");
    }
  }
}

export default new AuthService();
