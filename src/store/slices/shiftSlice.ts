import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import ShiftService, {
  DataShift,
  ShiftInfo,
  ShiftRequest,
  WorkDayData,
  WorkDaySimple,
} from "../../service/shiftService";

export const fetchWorkDays = createAsyncThunk<WorkDayData>(
  "shift/fetchWorkDays",
  async (_, { rejectWithValue }) => {
    try {
      return await ShiftService.getWorkDay();
    } catch (err: any) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const fetchShifts = createAsyncThunk<DataShift>(
  "shift/fetchShifts",
  async (_, { rejectWithValue }) => {
    try {
      return await ShiftService.getShiftData();
    } catch (err: any) {

      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const createShift = createAsyncThunk<ShiftInfo, ShiftRequest>(
  "shift/createShift",
  async (payload, { rejectWithValue }) => {
    try {
      return await ShiftService.createShift(payload);
    } catch (err: any) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const deleteShift = createAsyncThunk<{ message: string }, string>(
  "shift/deleteShift",
  async (id, { rejectWithValue }) => {
    try {
      return await ShiftService.deleteShift(id);
    } catch (err: any) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

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

const shiftSlice = createSlice({
  name: "shift",
  initialState,
  reducers: {},

  extraReducers: (builder) => {
    builder.addCase(fetchWorkDays.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchWorkDays.fulfilled, (state, action) => {
      state.loading = false;

      state.workDays = action.payload.data;
      state.count = action.payload.count;
    });
    builder.addCase(fetchWorkDays.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

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

    builder.addCase(deleteShift.pending, (state) => {
      state.deleting = true;
      state.error = null;
    });
    builder.addCase(deleteShift.fulfilled, (state, action) => {
      state.deleting = false;

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
