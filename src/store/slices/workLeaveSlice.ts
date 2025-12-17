import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import WorkLeaveService, {
  CreateWorkLeaveRequest,
  DataWorkLeave,
  LeaveBalanceInfo,
  WorkLeavePayload,
} from "../../service/workLeaveService";

// ============================
// STATE INTERFACE
// ============================
interface WorkLeaveState {
  leaveBalance: LeaveBalanceInfo | null;
  createLeave: WorkLeavePayload | null;
  workLeaveHistory: DataWorkLeave | null;
  dataWorkLeave: DataWorkLeave | null; // NEW
  approveOrReject: WorkLeavePayload | null; // NEW
  detail: WorkLeavePayload | null; // NEW

  loading: boolean;
  error: string | null;
}

// ============================
// INITIAL STATE
// ============================
const initialState: WorkLeaveState = {
  leaveBalance: null,
  createLeave: null,
  workLeaveHistory: null,
  dataWorkLeave: null,
  approveOrReject: null,
  detail: null,
  loading: false,
  error: null,
};

export const approveOrRejectWorkLeave = createAsyncThunk<
  WorkLeavePayload,
  { workLeaveId: string; status: "approved" | "rejected" },
  { rejectValue: string }
>(
  "workLeave/approveOrRejectWorkLeave",
  async ({ workLeaveId, status }, thunkAPI) => {
    try {
      return await WorkLeaveService.approveOrReject(workLeaveId, status);
    } catch (err: any) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || err.message
      );
    }
  }
);

export const fetchWorkLeaveDetail = createAsyncThunk<
  WorkLeavePayload,
  string,
  { rejectValue: string }
>("workLeave/fetchWorkLeaveDetail", async (workLeaveId, thunkAPI) => {
  try {
    return await WorkLeaveService.detail(workLeaveId);
  } catch (err: any) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
  }
});

export const fetchDataWorkLeave = createAsyncThunk<
  DataWorkLeave,
  void,
  { rejectValue: string }
>("workLeave/fetchDataWorkLeave", async (_, thunkAPI) => {
  try {
    return await WorkLeaveService.dataWorkLeave();
  } catch (err: any) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
  }
});

// Async thunk untuk fetch leave balance
export const fetchLeaveBalance = createAsyncThunk<
  LeaveBalanceInfo,
  string,
  { rejectValue: string }
>("workLeave/fetchLeaveBalance", async (employeeId, thunkAPI) => {
  try {
    const data = await WorkLeaveService.getLeaveBalance(employeeId);
    return data;
  } catch (err: any) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
  }
});

export const createWorkLeave = createAsyncThunk<
  WorkLeavePayload,
  { employeeId: string; payload: CreateWorkLeaveRequest },
  { rejectValue: string }
>("workLeave/createWorkLeave", async ({ employeeId, payload }, thunkAPI) => {
  try {
    const data = await WorkLeaveService.createWorkLeave(employeeId, payload);
    return data;
  } catch (err: any) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
  }
});

export const fetchWorkLeaveHistory = createAsyncThunk<
  DataWorkLeave,
  string,
  { rejectValue: string }
>("workLeave/fetchWorkLeaveHistory", async (employeeId, thunkAPI) => {
  try {
    return await WorkLeaveService.getWorkLeaveHistory(employeeId);
  } catch (err: any) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
  }
});

// Slice
const workLeaveSlice = createSlice({
  name: "workLeave",
  initialState,
  reducers: {
    clearLeaveBalance(state) {
      state.leaveBalance = null;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDataWorkLeave.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchDataWorkLeave.fulfilled,
        (state, action: PayloadAction<DataWorkLeave>) => {
          state.dataWorkLeave = action.payload;
          state.loading = false;
        }
      )
      .addCase(fetchDataWorkLeave.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch data work leave";
      });

    builder
      .addCase(approveOrRejectWorkLeave.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        approveOrRejectWorkLeave.fulfilled,
        (state, action: PayloadAction<WorkLeavePayload>) => {
          state.approveOrReject = action.payload;
          state.loading = false;
        }
      )
      .addCase(approveOrRejectWorkLeave.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to approve/reject work leave";
      });

    builder
      .addCase(fetchWorkLeaveDetail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchWorkLeaveDetail.fulfilled,
        (state, action: PayloadAction<WorkLeavePayload>) => {
          state.detail = action.payload;
          state.loading = false;
        }
      )
      .addCase(fetchWorkLeaveDetail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch work leave detail";
      });

    builder
      .addCase(fetchLeaveBalance.pending, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(
        fetchLeaveBalance.fulfilled,
        (state, action: PayloadAction<LeaveBalanceInfo>) => {
          state.leaveBalance = action.payload;
          state.loading = false;
        }
      )
      .addCase(fetchLeaveBalance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch leave balance";
      });

    // Create work leave
    builder
      .addCase(createWorkLeave.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        createWorkLeave.fulfilled,
        (state, action: PayloadAction<WorkLeavePayload>) => {
          state.createLeave = action.payload;
          state.loading = false;
        }
      )
      .addCase(createWorkLeave.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to create work leave";
      });

    builder
      .addCase(fetchWorkLeaveHistory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchWorkLeaveHistory.fulfilled,
        (state, action: PayloadAction<DataWorkLeave>) => {
          state.workLeaveHistory = action.payload;
          state.loading = false;
        }
      )
      .addCase(fetchWorkLeaveHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch work leave history";
      });
  },
});

// Export actions & reducer
export const { clearLeaveBalance } = workLeaveSlice.actions;
export default workLeaveSlice.reducer;
