import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  CompleteProfile,
  CompleteProfileRequest,
  CompleteProfileResponse,
} from "../../service/completeProfileService";

export interface CompleteProfileState {
  loading: boolean;
  error: string | null;
  successMessage: string | null;
  profileData: CompleteProfileResponse["data"] | null;
}

const initialState: CompleteProfileState = {
  loading: false,
  error: null,
  successMessage: null,
  profileData: null,
};

// ===============================
//       Async Thunk
// ===============================
export const submitCompleteProfile = createAsyncThunk<
  CompleteProfileResponse,
  { userId: string; data: CompleteProfileRequest },
  { rejectValue: string }
>("completeProfile/submit", async ({ userId, data }, { rejectWithValue }) => {
  try {
    const res = await CompleteProfile(userId, data);
    return res;
  } catch (err: any) {
    const message =
      err?.response?.data?.message || err?.message || "Complete profile failed";
    return rejectWithValue(message);
  }
});

// ===============================
//       Slice
// ===============================
const completeProfileSlice = createSlice({
  name: "completeProfile",
  initialState,
  reducers: {
    clearCompleteProfileError(state) {
      state.error = null;
    },
    resetCompleteProfileState(state) {
      state.loading = false;
      state.error = null;
      state.successMessage = null;
      state.profileData = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(submitCompleteProfile.pending, (state) => {
      state.loading = true;
      state.error = null;
      state.successMessage = null;
    });

    builder.addCase(
      submitCompleteProfile.fulfilled,
      (state, action: PayloadAction<CompleteProfileResponse>) => {
        state.loading = false;
        state.successMessage = action.payload.message;
        state.profileData = action.payload.data;

        // token disimpan DI SINI saja
        localStorage.setItem("token", action.payload.accessToken);
      }
    );

    builder.addCase(
      submitCompleteProfile.rejected,
      (state, action: PayloadAction<string | undefined>) => {
        state.loading = false;
        state.error = action.payload || "Complete profile failed";
      }
    );
  },
});

// ===============================
//       Export
// ===============================
export const { clearCompleteProfileError, resetCompleteProfileState } =
  completeProfileSlice.actions;

export default completeProfileSlice.reducer;
