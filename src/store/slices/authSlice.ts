import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import authService, {
  LoginRequest,
  OAuthLoginRequest,
  CompleteProfileRequest,
  AuthResponse,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  ForgotPasswordResponse,
  VerifyOTPPasswordResponse,
  UserInfo,
} from "../../service/authService";
import { EmployeeDetailResponse } from "../../service/employeeService";

interface AuthState {
  loading: boolean;
  isAuthenticated: boolean;
  initialized: boolean;
  needsProfile: boolean;
  employeeDetail?: EmployeeDetailResponse | null;
  otpUserId?: string;
  accessToken?: string;
  userInfo?: UserInfo;
  companyInfo?: any;
  forgotPasswordUserId?: string;
  resetPasswordToken?: string;
  resetPasswordSuccess?: string;
  error?: string;
}

const initialState: AuthState = {
  loading: false,
  isAuthenticated: false,
  initialized: false,
  needsProfile: false,
  employeeDetail: null,
  otpUserId: undefined,
  userInfo: undefined,
  companyInfo: undefined,
  accessToken: undefined,
  forgotPasswordUserId: undefined,
  resetPasswordToken: undefined,
  resetPasswordSuccess: undefined,
  error: undefined,
};

/* ============================================================
    ASYNC THUNKS
============================================================ */

// login
export const loginThunk = createAsyncThunk<AuthResponse, LoginRequest>(
  "auth/login",
  async (payload, { rejectWithValue }) => {
    try {
      return await authService.login(payload);
    } catch (err: any) {
      return rejectWithValue(err?.response?.data || "Login failed");
    }
  }
);

// oauth
export const oauthLoginThunk = createAsyncThunk<
  AuthResponse,
  OAuthLoginRequest
>("auth/oauthLogin", async (payload, { rejectWithValue }) => {
  try {
    return await authService.oauthLogin(payload);
  } catch (err: any) {
    return rejectWithValue(err?.response?.data || "OAuth login failed");
  }
});

// verify otp
export const verifyOTPLoginThunk = createAsyncThunk<
  AuthResponse,
  { userId: string; otp: string }
>("auth/verifyOTPLogin", async ({ userId, otp }, { rejectWithValue }) => {
  try {
    return await authService.verifyOTP(userId, otp);
  } catch (err: any) {
    return rejectWithValue(err?.response?.data || "OTP verification failed");
  }
});

export const verifyOTPResetPasswordThunk = createAsyncThunk<
  VerifyOTPPasswordResponse,
  { userId: string; otp: string }
>(
  "auth/verifyOTPResetPassword",
  async ({ userId, otp }, { rejectWithValue }) => {
    try {
      return await authService.verifyOTPResetPassword(userId, otp);
    } catch (err: any) {
      return rejectWithValue(
        err?.response?.data?.message || "OTP reset password gagal"
      );
    }
  }
);

export const resendOTPLoginThunk = createAsyncThunk<string, { userId: string }>(
  "auth/resendOTPLogin",
  async ({ userId }, { rejectWithValue }) => {
    try {
      const res = await authService.resendOTP(userId);
      return res.message;
    } catch (err: any) {
      return rejectWithValue(err?.response?.data || "Resend OTP failed");
    }
  }
);

export const resendOTPResetPasswordThunk = createAsyncThunk<
  string,
  { userId: string }
>("auth/resendOTPResetPassword", async ({ userId }, { rejectWithValue }) => {
  try {
    const res = await authService.resendOTPResetPassword(userId);
    return res.message;
  } catch (err: any) {
    return rejectWithValue(
      err?.response?.data || "Resend OTP reset password failed"
    );
  }
});

export const forgotPasswordThunk = createAsyncThunk<
  ForgotPasswordResponse,
  ForgotPasswordRequest
>("auth/forgotPassword", async (payload, { rejectWithValue }) => {
  try {
    return await authService.forgotPassword(payload);
  } catch (err: any) {
    return rejectWithValue(
      err?.response?.data?.message || "Gagal mengirim email reset password"
    );
  }
});

export const resetPasswordThunk = createAsyncThunk<
  string,
  { token: string; payload: ResetPasswordRequest }
>("auth/resetPassword", async ({ token, payload }, { rejectWithValue }) => {
  try {
    const res = await authService.resetPassword(token, payload);
    return res.message;
  } catch (err: any) {
    return rejectWithValue(
      err?.response?.data?.message || "Gagal reset password"
    );
  }
});

export const completeProfileThunk = createAsyncThunk<
  AuthResponse,
  { userId: string; payload: CompleteProfileRequest }
>("auth/completeProfile", async ({ userId, payload }, { rejectWithValue }) => {
  try {
    return await authService.completeProfile(userId, payload);
  } catch (err: any) {
    return rejectWithValue(err?.response?.data || "Complete profile failed");
  }
});

export const rehydrateAuth = createAsyncThunk(
  "auth/rehydrate",
  async (_, { fulfillWithValue }) => {
    const token = localStorage.getItem("token");
    const userInfo = localStorage.getItem("userInfo");
    const companyInfo = localStorage.getItem("companyInfo");
    const needsProfile = localStorage.getItem("needsProfile") === "true";

    if (!token || !userInfo) return fulfillWithValue(null);

    return fulfillWithValue({
      token,
      userInfo: JSON.parse(userInfo),
      companyInfo: companyInfo ? JSON.parse(companyInfo) : null,
      needsProfile,
    });
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },

    setUserInfo: (state, action) => {
      state.userInfo = action.payload;
    },

    setCompanyInfo: (state, action) => {
      state.companyInfo = action.payload;
    },

    setEmployeeDetail: (state, action) => {
      state.employeeDetail = action.payload;
    },
    logout(state) {
      localStorage.removeItem("token");
      localStorage.removeItem("userInfo");
      localStorage.removeItem("companyInfo");

      state.isAuthenticated = false;
      state.accessToken = undefined;
      state.userInfo = undefined;
      state.companyInfo = undefined;
    },
  },

  extraReducers: (builder) => {
    builder.addCase(loginThunk.pending, (state) => {
      state.loading = true;
      state.error = undefined;
    });
    builder.addCase(loginThunk.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.userInfo = payload.userInfo;
      state.companyInfo = payload.companyInfo;

      if (payload.otpRequest) {
        state.otpUserId = payload.userInfo?.id || "";
      } else {
        state.isAuthenticated = true;
        state.accessToken = payload.accessToken;

        localStorage.setItem("userInfo", JSON.stringify(payload.userInfo));
      }
    });
    builder.addCase(loginThunk.rejected, (state, { payload }) => {
      state.loading = false;
      state.error = payload as string;
    });

    builder.addCase(verifyOTPLoginThunk.pending, (state) => {
      state.loading = true;
      state.error = undefined;
    });
    builder.addCase(verifyOTPLoginThunk.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.needsProfile = payload.needsProfile;
      state.accessToken = payload.accessToken;
      state.companyInfo = payload.companyInfo;

      const incoming = payload.userInfo || {};
      state.userInfo = {
        ...incoming,
        permission:
          incoming.permission !== null && incoming.permission !== undefined
            ? incoming.permission
            : [],
      };

      localStorage.setItem("token", payload.accessToken);
      localStorage.setItem("userInfo", JSON.stringify(state.userInfo));
      localStorage.setItem("companyInfo", JSON.stringify(payload.companyInfo));
      localStorage.setItem(
        "needsProfile",
        JSON.stringify(payload.needsProfile)
      );
    });

    builder.addCase(verifyOTPLoginThunk.rejected, (state, { payload }) => {
      state.loading = false;
      state.error = payload as string;
    });

    builder.addCase(resendOTPLoginThunk.fulfilled, () => {});
    builder.addCase(resendOTPLoginThunk.rejected, (state, { payload }) => {
      state.error = payload as string;
    });

    builder.addCase(resendOTPResetPasswordThunk.fulfilled, () => {});
    builder.addCase(
      resendOTPResetPasswordThunk.rejected,
      (state, { payload }) => {
        state.error = payload as string;
      }
    );

    builder.addCase(forgotPasswordThunk.pending, (state) => {
      state.loading = true;
      state.error = undefined;
    });

    builder.addCase(forgotPasswordThunk.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.forgotPasswordUserId = payload.userId;
    });

    builder.addCase(forgotPasswordThunk.rejected, (state, { payload }) => {
      state.loading = false;
      state.error = payload as string;
    });

    builder.addCase(verifyOTPResetPasswordThunk.pending, (state) => {
      state.loading = true;
      state.error = undefined;
    });

    builder.addCase(
      verifyOTPResetPasswordThunk.fulfilled,
      (state, { payload }) => {
        state.loading = false;
        state.resetPasswordToken = payload.resetToken;
      }
    );

    builder.addCase(
      verifyOTPResetPasswordThunk.rejected,
      (state, { payload }) => {
        state.loading = false;
        state.error = payload as string;
      }
    );

    builder.addCase(resetPasswordThunk.pending, (state) => {
      state.loading = true;
      state.error = undefined;
    });

    builder.addCase(resetPasswordThunk.fulfilled, (state) => {
      state.loading = false;
    });

    builder.addCase(resetPasswordThunk.rejected, (state, { payload }) => {
      state.loading = false;
      state.error = payload as string;
    });

    builder.addCase(completeProfileThunk.pending, (state) => {
      state.loading = true;
      state.error = undefined;
    });
    builder.addCase(completeProfileThunk.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.needsProfile = false;

      state.accessToken = payload.accessToken;
      state.userInfo = payload.userInfo;
      state.companyInfo = payload.companyInfo;

      localStorage.setItem("token", payload.accessToken);
      localStorage.setItem("userInfo", JSON.stringify(payload.userInfo));
      localStorage.setItem("companyInfo", JSON.stringify(payload.companyInfo));

      localStorage.setItem("needsProfile", "false");
    });
    builder.addCase(completeProfileThunk.rejected, (state, { payload }) => {
      state.loading = false;
      state.error = payload as string;
    });

    builder.addCase(rehydrateAuth.fulfilled, (state, { payload }) => {
      state.initialized = true;
      if (!payload) return;

      state.isAuthenticated = true;
      state.accessToken = payload.token;
      state.userInfo = payload.userInfo;
      state.companyInfo = payload.companyInfo;
      state.needsProfile = payload.needsProfile; 
    });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
