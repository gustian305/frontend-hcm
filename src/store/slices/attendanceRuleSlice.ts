import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  AttendanceRuleInfo,
  AttendanceRuleRequest,
} from "../../service/attendanceRuleService";
import attendanceRuleService from "../../service/attendanceRuleService"; // import class instance


export const fetchAttendanceRuleThunk = createAsyncThunk<
  AttendanceRuleInfo | null
>("attendanceRule/fetch", async (_, { rejectWithValue }) => {
  try {
    return await attendanceRuleService.getRule();
  } catch (err: any) {
    return rejectWithValue(
      err?.response?.data || "Failed to fetch attendance rule"
    );
  }
});

export const createAttendanceRuleThunk = createAsyncThunk<
  AttendanceRuleInfo,
  AttendanceRuleRequest
>("attendanceRule/create", async (payload, { rejectWithValue }) => {
  try {
    return await attendanceRuleService.createRule(payload);
  } catch (err: any) {
    return rejectWithValue(
      err?.response?.data || "Failed to create attendance rule"
    );
  }
});

export const updateAttendanceRuleThunk = createAsyncThunk<
  AttendanceRuleInfo,
  { id: string; payload: AttendanceRuleRequest }
>("attendanceRule/update", async ({ id, payload }, { rejectWithValue }) => {
  try {
    return await attendanceRuleService.updateRule(id, payload);
  } catch (err: any) {
    return rejectWithValue(
      err?.response?.data || "Failed to update attendance rule"
    );
  }
});

export const deleteAttendanceRuleThunk = createAsyncThunk<string, string>(
  "attendanceRule/delete",
  async (id, { rejectWithValue }) => {
    try {
      await attendanceRuleService.deleteRule(id);
      return id;
    } catch (err: any) {
      return rejectWithValue(
        err?.response?.data || "Failed to delete attendance rule"
      );
    }
  }
);

// ==========================
// SLICE
// ==========================
interface AttendanceRuleState {
  loading: boolean;
  error?: string;
  attendanceRule?: AttendanceRuleInfo | null;
}

const initialState: AttendanceRuleState = {
  loading: false,
  error: undefined,
  attendanceRule: null,
};

const attendanceRuleSlice = createSlice({
  name: "attendanceRule",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // fetch
      .addCase(fetchAttendanceRuleThunk.pending, (state) => {
        state.loading = true;
        state.error = undefined;
      })
      .addCase(fetchAttendanceRuleThunk.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.attendanceRule = payload ?? null;
      })
      .addCase(fetchAttendanceRuleThunk.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload as string;
      })

      // create
      .addCase(createAttendanceRuleThunk.pending, (state) => {
        state.loading = true;
        state.error = undefined;
      })
      .addCase(createAttendanceRuleThunk.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.attendanceRule = payload;
      })
      .addCase(createAttendanceRuleThunk.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload as string;
      })

      // update
      .addCase(updateAttendanceRuleThunk.pending, (state) => {
        state.loading = true;
        state.error = undefined;
      })
      .addCase(updateAttendanceRuleThunk.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.attendanceRule = payload;
      })
      .addCase(updateAttendanceRuleThunk.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload as string;
      })

      // delete
      .addCase(deleteAttendanceRuleThunk.pending, (state) => {
        state.loading = true;
        state.error = undefined;
      })
      .addCase(deleteAttendanceRuleThunk.fulfilled, (state) => {
        state.loading = false;
        state.attendanceRule = null;
      })
      .addCase(deleteAttendanceRuleThunk.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload as string;
      });
  },
});

export const {} = attendanceRuleSlice.actions;
export default attendanceRuleSlice.reducer;
