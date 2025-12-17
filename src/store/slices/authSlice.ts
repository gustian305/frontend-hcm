import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  login,
  oauthLogin,
  VerifyOTPLogin,
  ResendOTPLogin,
  CompleteProfile,
  LoginRequest,
  OAuthLoginRequest,
  CompleteProfileRequest,
  AuthResponse,
} from "../../service/authService";
import { EmployeeDetailResponse } from "../../service/employeeService";

interface AuthState {
  loading: boolean;
  isAuthenticated: boolean;
  needsProfile: boolean;
  employeeDetail?: EmployeeDetailResponse | null; // TAMBAH INI
  // otpRequested: boolean;
  otpUserId?: string;
  accessToken?: string;
  userInfo?: {
    id: string;
    employeeId?: string;
    shiftId?: string;
    name: string;
    email?: string;
    role?: string;
    permission?: { name: string }[];
    verified?: boolean;
  };
  companyInfo?: any;
  error?: string;
}

const initialState: AuthState = {
  loading: false,
  isAuthenticated: false,
  needsProfile: false,
  employeeDetail: null,
  // otpRequested: false,
  otpUserId: undefined,
  userInfo: undefined,
  companyInfo: undefined,
  accessToken: undefined,
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
      return await login(payload);
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
    return await oauthLogin(payload);
  } catch (err: any) {
    return rejectWithValue(err?.response?.data || "OAuth login failed");
  }
});

// verify otp
export const verifyOTPThunk = createAsyncThunk<
  AuthResponse,
  { userId: string; otp: string }
>("auth/verifyOTP", async ({ userId, otp }, { rejectWithValue }) => {
  try {
    return await VerifyOTPLogin(userId, otp);
  } catch (err: any) {
    return rejectWithValue(err?.response?.data || "OTP verification failed");
  }
});

export const resendOTPThunk = createAsyncThunk<string, { userId: string }>(
  "auth/resendOTP",
  async ({ userId }, { rejectWithValue }) => {
    try {
      const res = await ResendOTPLogin(userId);
      return res.message;
    } catch (err: any) {
      return rejectWithValue(err?.response?.data || "Resend OTP failed");
    }
  }
);

export const completeProfileThunk = createAsyncThunk<
  AuthResponse,
  { userId: string; payload: CompleteProfileRequest }
>("auth/completeProfile", async ({ userId, payload }, { rejectWithValue }) => {
  try {
    return await CompleteProfile(userId, payload);
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

    if (!token || !userInfo) return fulfillWithValue(null);

    return fulfillWithValue({
      token,
      userInfo: JSON.parse(userInfo),
      companyInfo: companyInfo ? JSON.parse(companyInfo) : null,
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
      console.log("[Login Thunk] Response payload:", payload);

      state.loading = false;
      // state.otpRequested = payload.otpRequest;
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

    builder.addCase(verifyOTPThunk.pending, (state) => {
      state.loading = true;
      state.error = undefined;
    });
    builder.addCase(verifyOTPThunk.fulfilled, (state, { payload }) => {
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
      // const existing = state.userInfo || {};

      // const mergedUserInfo = {
      //   ...existing,
      //   ...incoming,
      //   permission:
      //     incoming.permission !== null && incoming.permission !== undefined
      //       ? incoming.permission
      //       : existing.permission ?? [],
      // };

      // state.userInfo = mergedUserInfo;

      localStorage.setItem("token", payload.accessToken);
      localStorage.setItem("userInfo", JSON.stringify(state.userInfo));
      localStorage.setItem("companyInfo", JSON.stringify(payload.companyInfo));
    });

    builder.addCase(verifyOTPThunk.rejected, (state, { payload }) => {
      state.loading = false;
      state.error = payload as string;
    });

    builder.addCase(resendOTPThunk.fulfilled, () => {});
    builder.addCase(resendOTPThunk.rejected, (state, { payload }) => {
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
    });
    builder.addCase(completeProfileThunk.rejected, (state, { payload }) => {
      state.loading = false;
      state.error = payload as string;
    });

    builder.addCase(rehydrateAuth.fulfilled, (state, { payload }) => {
      if (!payload) return;

      state.isAuthenticated = true;
      state.accessToken = payload.token;
      state.userInfo = payload.userInfo;
      state.companyInfo = payload.companyInfo;
    });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
