import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { AttendanceInfo, AttendanceRequest, createAttendance, DataAttendance, getAttendanceData, getAttendanceHistory } from "../../service/attendanceService";

// =========================
// Thunks
// =========================


// CREATE ATTENDANCE (check-in / check-out)
export const createAttendanceThunk = createAsyncThunk<
  AttendanceInfo,
  AttendanceRequest,
  { rejectValue: string }
>("attendance/create", async (payload, { rejectWithValue }) => {
  try {
    return await createAttendance(payload);
  } catch (err: any) {
    return rejectWithValue(
      err.response?.data?.message || "Failed to create attendance"
    );
  }
});

// GET HISTORY PER EMPLOYEE
export const getAttendanceHistoryThunk = createAsyncThunk<
  DataAttendance,
  string,
  { rejectValue: string }
>("attendance/history", async (employeeId, { rejectWithValue }) => {
  try {
    return await getAttendanceHistory(employeeId);
  } catch (err: any) {
    return rejectWithValue(
      err.response?.data?.message || "Failed to load history"
    );
  }
});

// GET ALL ATTENDANCE (MANAGEMENT)
export const getAttendanceDataThunk = createAsyncThunk<
  DataAttendance,
  void,
  { rejectValue: string }
>("attendance/data", async (_, { rejectWithValue }) => {
  try {
    return await getAttendanceData();
  } catch (err: any) {
    return rejectWithValue(
      err.response?.data?.message || "Failed to load attendance data"
    );
  }
});

// =========================
// Slice State
// =========================
interface AttendanceState {
  history: DataAttendance | null;
  list: DataAttendance | null; // for management
  lastCreated: AttendanceInfo | null;

  loading: boolean;
  error: string | null;
}

const initialState: AttendanceState = {
  history: null,
  list: null,
  lastCreated: null,
  loading: false,
  error: null,
};

// =========================
// Slice
// =========================
export const attendanceSlice = createSlice({
  name: "attendance",
  initialState,
  reducers: {
    clearAttendanceError(state) {
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    // CREATE
    builder
      .addCase(createAttendanceThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createAttendanceThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.lastCreated = action.payload;
      })
      .addCase(createAttendanceThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to create attendance";
      });

    // HISTORY
    builder
      .addCase(getAttendanceHistoryThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAttendanceHistoryThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.history = action.payload;
      })
      .addCase(getAttendanceHistoryThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to load attendance history";
      });

    // MANAGEMENT LIST
    builder
      .addCase(getAttendanceDataThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAttendanceDataThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(getAttendanceDataThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to load attendance data";
      });
  },
});

export const { clearAttendanceError } = attendanceSlice.actions;
export default attendanceSlice.reducer;
