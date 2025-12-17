import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import applicantService, {
  ApplicantPayload,
  ApplicantRequest,
  DataApplicant,
  UpdateStatusApplicant,
} from "../../service/applicantService";

// ==============================
// THUNKS
// ==============================

export const submitApplicant = createAsyncThunk<
  ApplicantPayload, // return type
  { companyId: string; jobVacancyId: string; payload: ApplicantRequest }, // argument type
  { rejectValue: string }
>(
  "applicant/submit",
  async ({ companyId, jobVacancyId, payload }, { rejectWithValue }) => {
    try {
      const data = await applicantService.createApplicant(
        companyId,
        jobVacancyId,
        payload
      );
      return data;
    } catch (err: any) {
      return rejectWithValue(err?.message || "Failed to submit applicant");
    }
  }
);

// Fetch all applicants (management)
export const fetchAllApplicants = createAsyncThunk<
  DataApplicant,
  void,
  { rejectValue: string }
>("applicant/fetchAll", async (_, { rejectWithValue }) => {
  try {
    return await applicantService.getAllApplicants();
  } catch (err: any) {
    return rejectWithValue(err?.message || "Failed to fetch applicants");
  }
});

// Fetch applicant detail (management)
export const fetchApplicantDetail = createAsyncThunk<
  ApplicantPayload,
  string,
  { rejectValue: string }
>("applicant/fetchDetail", async (applicantId, { rejectWithValue }) => {
  try {
    return await applicantService.getApplicantDetail(applicantId);
  } catch (err: any) {
    return rejectWithValue(err?.message || "Failed to fetch applicant detail");
  }
});

export const updateStatusApplicant = createAsyncThunk<
  ApplicantPayload, // return type
  { applicantId: string; payload: UpdateStatusApplicant }, // argument type
  { rejectValue: string }
>(
  "applicant/updateStatus",
  async ({ applicantId, payload }, { rejectWithValue }) => {
    try {
      const data = await applicantService.updateStatusApplicant(
        applicantId,
        payload
      );
      return data;
    } catch (err: any) {
      return rejectWithValue(
        err?.message || "Failed to update applicant status"
      );
    }
  }
);

// ==============================
// SLICE
// ==============================

interface ApplicantState {
  data: DataApplicant | null;
  detail: ApplicantPayload | null;
  loading: boolean;
  error: string | null;
  lastSubmitted: ApplicantPayload | null;
}

const initialState: ApplicantState = {
  data: null,
  detail: null,
  loading: false,
  error: null,
  lastSubmitted: null,
};

const applicantSlice = createSlice({
  name: "applicant",
  initialState,
  reducers: {
    resetApplicantState: (state) => {
      state.loading = false;
      state.error = null;
      state.lastSubmitted = null;
      state.detail = null;
    },
  },
  extraReducers: (builder) => {
    // Submit Applicant
    builder
      .addCase(submitApplicant.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        submitApplicant.fulfilled,
        (state, action: PayloadAction<ApplicantPayload>) => {
          state.loading = false;
          state.error = null;
          state.lastSubmitted = action.payload;

          if (state.data) {
            state.data.data.push(action.payload);
            state.data.count += 1;
          } else {
            state.data = {
              count: 1,
              data: [action.payload],
            };
          }
        }
      )
      .addCase(submitApplicant.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to submit applicant";
      });

    // Fetch All Applicants
    builder
      .addCase(fetchAllApplicants.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchAllApplicants.fulfilled,
        (state, action: PayloadAction<DataApplicant>) => {
          state.loading = false;
          state.error = null;
          state.data = action.payload;
        }
      )
      .addCase(fetchAllApplicants.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch applicants";
      });

    // fetchApplicantDetail
    builder
      .addCase(fetchApplicantDetail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchApplicantDetail.fulfilled,
        (state, action: PayloadAction<ApplicantPayload>) => {
          state.loading = false;
          state.error = null;
          state.detail = action.payload;
        }
      )
      .addCase(fetchApplicantDetail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch applicant detail";
      });

    builder
      .addCase(updateStatusApplicant.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        updateStatusApplicant.fulfilled,
        (state, action: PayloadAction<ApplicantPayload>) => {
          state.loading = false;
          state.error = null;
          state.detail = action.payload;

          // Update state.data jika sudah ada list applicants
          if (state.data) {
            const index = state.data.data.findIndex(
              (a) => a.id === action.payload.id
            );
            if (index !== -1) {
              state.data.data[index] = action.payload;
            }
          }
        }
      )
      .addCase(updateStatusApplicant.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to update applicant status";
      });
  },
});

export const { resetApplicantState } = applicantSlice.actions;
export default applicantSlice.reducer;
