import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import AttendanceService, {
  AttendanceInfo,
  AttendanceRequest,
  DataAttendance,
  GetEmployeeShiftResponse,
} from "../../service/attendanceService";

// =========================
// Thunks
// =========================

// GET EMPLOYEE ACTIVE SHIFT
export const fetchEmployeeActiveShift = createAsyncThunk<
  GetEmployeeShiftResponse,
  void,
  { rejectValue: string }
>("attendance/fetchEmployeeActiveShift", async (_, { rejectWithValue }) => {
  try {
    const res = await AttendanceService.getEmployeeActiveShift();
    return res;
  } catch (err: any) {
    return rejectWithValue(
      err?.response?.data?.message || "Gagal mengambil active shift"
    );
  }
});

// CREATE ATTENDANCE (check-in / check-out)
export const attendanceCheckInThunk = createAsyncThunk<
  AttendanceInfo,
  AttendanceRequest,
  { rejectValue: string }
>("attendance/check-in", async (payload, { rejectWithValue }) => {
  try {
    return await AttendanceService.attendanceCheckIn(payload);
  } catch (err: any) {
    return rejectWithValue(
      err.response?.data?.message || "Failed to create attendance"
    );
  }
});

// CREATE ATTENDANCE (check-in / check-out)
export const attendanceCheckOutThunk = createAsyncThunk<
  AttendanceInfo,
  AttendanceRequest,
  { rejectValue: string }
>("attendance/check-out", async (payload, { rejectWithValue }) => {
  try {
    return await AttendanceService.attendanceCheckOut(payload);
  } catch (err: any) {
    return rejectWithValue(
      err.response?.data?.message || "Failed to create attendance"
    );
  }
});

export const getAttendanceHistoryThunk = createAsyncThunk<
  DataAttendance,
  string, // <- terima string saja
  { rejectValue: string }
>("attendance/history", async (employeeId, { rejectWithValue }) => {
  try {
    return await AttendanceService.getAttendanceHistory(employeeId);
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
    return await AttendanceService.getAttendanceData();
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
  activeShift: GetEmployeeShiftResponse | null;
  history: DataAttendance | null;
  list: DataAttendance | null; // for management
  lastCreated: AttendanceInfo | null;

  loading: boolean;
  error: string | null;
}

const initialState: AttendanceState = {
  activeShift: null,
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
    builder
      // FETCH ACTIVE SHIFT
      .addCase(fetchEmployeeActiveShift.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchEmployeeActiveShift.fulfilled,
        (state, action: PayloadAction<GetEmployeeShiftResponse>) => {
          state.loading = false;
          state.activeShift = action.payload;
        }
      )
      .addCase(fetchEmployeeActiveShift.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Terjadi kesalahan";
      });

    // Check-IN
    builder
      .addCase(attendanceCheckInThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(attendanceCheckInThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.lastCreated = action.payload;
      })
      .addCase(attendanceCheckInThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to create attendance";
      });

    // Check-OUT
    builder
      .addCase(attendanceCheckOutThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(attendanceCheckOutThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.lastCreated = action.payload;
      })
      .addCase(attendanceCheckOutThunk.rejected, (state, action) => {
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
