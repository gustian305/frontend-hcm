import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import shiftService, {
  DataShift,
  ShiftInfo,
  ShiftRequest,
  WorkDayData,
  WorkDaySimple,
} from "../../service/shiftService";

// ==============================
// THUNKS
// ==============================
export const fetchWorkDays = createAsyncThunk<WorkDayData>(
  "shift/fetchWorkDays",
  async (_, { rejectWithValue }) => {
    try {
      return await shiftService.getWorkDay();
    } catch (err: any) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const fetchShifts = createAsyncThunk<DataShift>(
  "shift/fetchShifts",
  async (_, { rejectWithValue }) => {
    try {
      return await shiftService.getShiftData();
    } catch (err: any) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const createShift = createAsyncThunk<ShiftInfo, ShiftRequest>(
  "shift/createShift",
  async (payload, { rejectWithValue }) => {
    try {
      return await shiftService.createShift(payload);
    } catch (err: any) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const deleteShift = createAsyncThunk<{ message: string }, string>(
  "shift/deleteShift",
  async (id, { rejectWithValue }) => {
    try {
      return await shiftService.deleteShift(id);
    } catch (err: any) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// ==============================
// STATE INTERFACE
// ==============================

export interface ShiftState {
  data: ShiftInfo[];
  count: number;
  workDays: WorkDaySimple[];

  loading: boolean;
  creating: boolean;
  deleting: boolean;

  error: string | null;
}

const initialState: ShiftState = {
  data: [],
  count: 0,
  workDays: [],

  loading: false,
  creating: false,
  deleting: false,

  error: null,
};

// ==============================
// SLICE
// ==============================

const shiftSlice = createSlice({
  name: "shift",
  initialState,
  reducers: {},

  extraReducers: (builder) => {
    // FETCH WORK DAYS
    builder.addCase(fetchWorkDays.pending, (state) => {
      state.loading = true;
      state.error = null;
    });

    builder.addCase(fetchWorkDays.fulfilled, (state, action) => {
            state.loading = false;

      // action.payload = WorkDayData
      state.workDays = action.payload.data; // array WorkDaySimple
      state.count = action.payload.count;   // jumlah workDays
    });


    builder.addCase(fetchWorkDays.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // FETCH
    builder.addCase(fetchShifts.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchShifts.fulfilled, (state, action) => {
      state.loading = false;
      state.data = action.payload.data;
      state.count = action.payload.count;
    });
    builder.addCase(fetchShifts.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // CREATE
    builder.addCase(createShift.pending, (state) => {
      state.creating = true;
      state.error = null;
    });
    builder.addCase(createShift.fulfilled, (state, action) => {
      state.creating = false;
      state.data.push(action.payload);
      state.count += 1;
    });
    builder.addCase(createShift.rejected, (state, action) => {
      state.creating = false;
      state.error = action.payload as string;
    });

    // DELETE
    builder.addCase(deleteShift.pending, (state) => {
      state.deleting = true;
      state.error = null;
    });
    builder.addCase(deleteShift.fulfilled, (state, action) => {
      state.deleting = false;

      // delete shift by id (state update)
      const deletedId = action.meta.arg;
      state.data = state.data.filter((s) => s.id !== deletedId);
      state.count = state.data.length;
    });
    builder.addCase(deleteShift.rejected, (state, action) => {
      state.deleting = false;
      state.error = action.payload as string;
    });
  },
});

export default shiftSlice.reducer;
