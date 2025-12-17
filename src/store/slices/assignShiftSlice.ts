// src/store/slices/assignShiftSlice.ts
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import assignShift, {
  AssignShiftData,
  AssignShiftInfo,
  AssignShiftRequest,
  RemoveShiftRequest,
  SwitchShiftRequest,
} from "../../service/assignShiftService";

// =======================
// Thunks
// =======================

// Fetch semua assignments
export const fetchAssignmentsThunk = createAsyncThunk<AssignShiftData>(
  "assignShift/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      return await assignShift.getAssignments();
    } catch (err: any) {
      return rejectWithValue(
        err?.response?.data || "Failed to fetch assignments"
      );
    }
  }
);

// Assign employee ke shift
export const assignShiftThunk = createAsyncThunk<
  AssignShiftInfo[],
  AssignShiftRequest
>("assignShift/assign", async (payload, { rejectWithValue }) => {
  try {
    return await assignShift.assignShift(payload);
  } catch (err: any) {
    return rejectWithValue(err?.response?.data || "Failed to assign shift");
  }
});

export const switchShiftThunk = createAsyncThunk<
  AssignShiftInfo[],
  SwitchShiftRequest
>("assignShift/switch", async (payload, { rejectWithValue }) => {
  try {
    return await assignShift.switchShift(payload);
  } catch (err: any) {
    return rejectWithValue(err?.response?.data || "Failed to switch shift");
  }
});

// Remove employee dari shift
export const removeEmployeesThunk = createAsyncThunk<
  AssignShiftInfo[],
  RemoveShiftRequest
>("assignShift/remove", async (payload, { rejectWithValue }) => {
  try {
    return await assignShift.removeEmployees(payload);
  } catch (err: any) {
    return rejectWithValue(err?.response?.data || "Failed to remove employees");
  }
});

// =======================
// State Interface
// =======================
interface AssignShiftState {
  loading: boolean;
  error?: string;
  assignments: AssignShiftInfo[];
}

const initialState: AssignShiftState = {
  loading: false,
  error: undefined,
  assignments: [],
};

// =======================
// Slice
// =======================
const assignShiftSlice = createSlice({
  name: "assignShift",
  initialState,
  reducers: {
    // optional: bisa tambah reducer local kalau perlu
    clearError(state) {
      state.error = undefined;
    },
  },
  extraReducers: (builder) => {
    // fetchAssignments
    builder.addCase(fetchAssignmentsThunk.pending, (state) => {
      state.loading = true;
      state.error = undefined;
    });
    builder.addCase(
      fetchAssignmentsThunk.fulfilled,
      (state, action: PayloadAction<AssignShiftData>) => {
        state.loading = false;
        state.assignments = action.payload.data;
      }
    );
    builder.addCase(fetchAssignmentsThunk.rejected, (state, { payload }) => {
      state.loading = false;
      state.error = payload as string;
    });

    // assignShift
    builder.addCase(assignShiftThunk.pending, (state) => {
      state.loading = true;
      state.error = undefined;
    });
    builder.addCase(
      assignShiftThunk.fulfilled,
      (state, { payload }: PayloadAction<AssignShiftInfo[]>) => {
        state.loading = false;
        // append atau replace existing assignments
        payload.forEach((p) => {
          const index = state.assignments.findIndex((a) => a.id === p.id);
          if (index !== -1) {
            state.assignments[index] = p;
          } else {
            state.assignments.push(p);
          }
        });
      }
    );
    builder.addCase(assignShiftThunk.rejected, (state, { payload }) => {
      state.loading = false;
      state.error = payload as string;
    });

    // switchShift
    builder.addCase(switchShiftThunk.pending, (state) => {
      state.loading = true;
      state.error = undefined;
    });

    builder.addCase(
      switchShiftThunk.fulfilled,
      (state, { payload }: PayloadAction<AssignShiftInfo[]>) => {
        state.loading = false;

        payload.forEach((p) => {
          const idx = state.assignments.findIndex(
            (a) => a.employeeId === p.employeeId
          );

          if (idx !== -1) {
            state.assignments[idx] = p;
          } else {
            state.assignments.push(p);
          }
        });
      }
    );

    builder.addCase(switchShiftThunk.rejected, (state, { payload }) => {
      state.loading = false;
      state.error = payload as string;
    });

    // removeEmployees
    builder.addCase(removeEmployeesThunk.pending, (state) => {
      state.loading = true;
      state.error = undefined;
    });
    builder.addCase(
      removeEmployeesThunk.fulfilled,
      (state, { payload }: PayloadAction<AssignShiftInfo[]>) => {
        state.loading = false;
        // hapus assignment yang sudah di remove
        const removedIds = payload.map((p) => p.id);
        state.assignments = state.assignments.filter(
          (a) => !removedIds.includes(a.id)
        );
      }
    );
    builder.addCase(removeEmployeesThunk.rejected, (state, { payload }) => {
      state.loading = false;
      state.error = payload as string;
    });
  },
});

export const { clearError } = assignShiftSlice.actions;
export default assignShiftSlice.reducer;
