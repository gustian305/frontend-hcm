import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  ForgotPassword,
  ResetPassword,
  type ForgotPasswordRequest,
  type ResetPasswordRequest,
} from "../../service/forgotPasswordService";
import {
  ResendOTPForgotPassword,
  VerifyOTPForgotPassword,
} from "../../service/otpService";

export const forgotPassword = createAsyncThunk(
  "password/forgotPassowrd",
  async (payload: ForgotPasswordRequest, { rejectWithValue }) => {
    try {
      const data = await ForgotPassword(payload);
      return data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const verifyOTPForgotPassword = createAsyncThunk(
  "password/verifyOTPForgotPassword",
  async (
    { userId, otp }: { userId: string; otp: string },
    { rejectWithValue }
  ) => {
    try {
      const data = await VerifyOTPForgotPassword(userId, otp);
      return data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const resendOTPForgotPassword = createAsyncThunk(
  "password/resendOTPForgotPassword",
  async (userId: string, { rejectWithValue }) => {
    try {
      const data = await ResendOTPForgotPassword(userId);
      return data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const resetPassword = createAsyncThunk(
  "password/resetPassword",
  async (
    { token, payload }: { token: string; payload: ResetPasswordRequest },
    { rejectWithValue }
  ) => {
    try {
      const data = await ResetPassword(token, payload);
      return data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

interface ForgotPasswordState {
  loading: boolean;
  error: string | null;
  message: string | null;
  userId: string | null;
  token: string | null;
}

const initialState: ForgotPasswordState = {
  loading: false,
  error: null,
  message: null,
  userId: null,
  token: null,
};

const forgotPasswordSlice = createSlice({
  name: "forgotPassword",
  initialState,
  reducers: {
    clearPasswordState: (state) => {
      state.loading = false;
      state.error = null;
      state.message = null;
      state.userId = null;
      state.token = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(forgotPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(forgotPassword.fulfilled, (state, action: any) => {
        state.loading = false;
        state.message = action.payload.message;
        state.userId = action.payload.userId;
      })
      .addCase(forgotPassword.rejected, (state, action: any) => {
        state.loading = false;
        state.error = action.payload;
      });

    builder
      .addCase(verifyOTPForgotPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyOTPForgotPassword.fulfilled, (state, action: any) => {
        state.loading = false;
        state.message = action.payload.message;
        state.token = action.payload.token;
      })
      .addCase(verifyOTPForgotPassword.rejected, (state, action: any) => {
        state.loading = false;
        state.error = action.payload;
      });

    builder
      .addCase(resendOTPForgotPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(resendOTPForgotPassword.fulfilled, (state, action: any) => {
        state.loading = false;
        state.message = action.payload.message;
      })
      .addCase(resendOTPForgotPassword.rejected, (state, action: any) => {
        state.loading = false;
        state.error = action.payload;
      });

    builder
      .addCase(resetPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(resetPassword.fulfilled, (state, action: any) => {
        state.loading = false;
        state.message = action.payload.message;
      })
      .addCase(resetPassword.rejected, (state, action: any) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearPasswordState } = forgotPasswordSlice.actions;
export default forgotPasswordSlice.reducer;
