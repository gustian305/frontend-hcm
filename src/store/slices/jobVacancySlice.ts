import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  DataJobVacancy,
  JobVacancyInfo,
  JobVacancyRequest,
  JobVacancyService,
} from "../../service/jobVacancyService";

interface JobVacancyState {
  list: DataJobVacancy | null;
  detail: JobVacancyInfo | null;
  loading: boolean;
  error: string | null;
}

const initialState: JobVacancyState = {
  list: null,
  detail: null,
  loading: false,
  error: null,
};

// ========== Thunk ==========

export const fetchJobVacanciesPublic = createAsyncThunk(
  "jobVacancy/fetchAllPublic",
  async (_, { rejectWithValue }) => {
    try {
      return await JobVacancyService.getAllDataJobVacancyPublic();
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data || "Failed to load public data"
      );
    }
  }
);

// GET Detail PUBLIC
export const fetchJobVacancyDetailPublic = createAsyncThunk(
  "jobVacancy/fetchDetailPublic",
  async (jobVacancyId: string, { rejectWithValue }) => {
    try {
      return await JobVacancyService.detailJobVacancyPublic(jobVacancyId);
    } catch (err: any) {
      return rejectWithValue(err.response?.data || "Failed to load detail");
    }
  }
);

// GET all
export const fetchJobVacancies = createAsyncThunk(
  "jobVacancy/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      return await JobVacancyService.getAllData();
    } catch (err: any) {
      return rejectWithValue(err.response?.data || "Failed to load data");
    }
  }
);

// GET detail
export const fetchJobVacancyDetail = createAsyncThunk(
  "jobVacancy/fetchDetail",
  async (jobVacancyId: string, { rejectWithValue }) => {
    try {
      return await JobVacancyService.detail(jobVacancyId);
    } catch (err: any) {
      return rejectWithValue(err.response?.data || "Failed to fetch detail");
    }
  }
);

// CREATE
export const createJobVacancy = createAsyncThunk(
  "jobVacancy/create",
  async (payload: JobVacancyRequest, { rejectWithValue }) => {
    try {
      return await JobVacancyService.create(payload);
    } catch (err: any) {
      return rejectWithValue(err.response?.data || "Failed to create job");
    }
  }
);

// UPDATE
export const updateJobVacancy = createAsyncThunk(
  "jobVacancy/update",
  async (
    { id, payload }: { id: string; payload: JobVacancyRequest },
    { rejectWithValue }
  ) => {
    try {
      return await JobVacancyService.update(id, payload);
    } catch (err: any) {
      return rejectWithValue(err.response?.data || "Failed to update job");
    }
  }
);

// DELETE
export const deleteJobVacancy = createAsyncThunk(
  "jobVacancy/delete",
  async (id: string, { rejectWithValue }) => {
    try {
      return await JobVacancyService.delete(id);
    } catch (err: any) {
      return rejectWithValue(err.response?.data || "Failed to delete job");
    }
  }
);

// ========== Slice ==========

const jobVacancySlice = createSlice({
  name: "jobVacancy",
  initialState,
  reducers: {
    resetDetail: (state) => {
      state.detail = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // ========== PUBLIC FETCH ALL ==========
      .addCase(fetchJobVacanciesPublic.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchJobVacanciesPublic.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchJobVacanciesPublic.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // ========== PUBLIC FETCH DETAIL ==========
      .addCase(fetchJobVacancyDetailPublic.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchJobVacancyDetailPublic.fulfilled, (state, action) => {
        state.loading = false;
        state.detail = action.payload;
      })
      .addCase(fetchJobVacancyDetailPublic.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
    builder
      // Fetch All
      .addCase(fetchJobVacancies.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchJobVacancies.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchJobVacancies.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Fetch Detail
      .addCase(fetchJobVacancyDetail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchJobVacancyDetail.fulfilled, (state, action) => {
        state.loading = false;
        state.detail = action.payload;
      })
      .addCase(fetchJobVacancyDetail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Create
      .addCase(createJobVacancy.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createJobVacancy.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(createJobVacancy.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Update
      .addCase(updateJobVacancy.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateJobVacancy.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(updateJobVacancy.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Delete
      .addCase(deleteJobVacancy.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteJobVacancy.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(deleteJobVacancy.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { resetDetail } = jobVacancySlice.actions;
export default jobVacancySlice.reducer;
