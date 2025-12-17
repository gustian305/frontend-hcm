// redux/slices/departmentSlice.ts
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import departmentService, { DataDepartment, DepartmentPayload, DepartmentRequest } from "../../service/departmentService";

// === THUNKS ===
export const fetchDepartment = createAsyncThunk(
  "department/fetchDepartment",
  async (_, { rejectWithValue }) => {
    try {
      const data = await departmentService.getDepartmentData();
      return data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const createDepartment = createAsyncThunk(
  "department/createDepartment",
  async (payload: DepartmentRequest, { rejectWithValue }) => {
    try {
      return await departmentService.createDepartment(payload);
    } catch (err: any) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const updateDepartment = createAsyncThunk(
  "department/updateDepartment",
  async (
    {
      departmentId,
      payload,
    }: { departmentId: string; payload: DepartmentRequest },
    { rejectWithValue }
  ) => {
    try {
      return await departmentService.updateDepartment(departmentId, payload);
    } catch (err: any) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const deleteDepartment = createAsyncThunk(
  "department/deleteDepartment",
  async (departmentId: string, { rejectWithValue }) => {
    try {
      return await departmentService.deleteDepartment(departmentId);
    } catch (err: any) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// === STATE ===

interface DepartmentState {
  departmentData: DataDepartment | null;
  loading: boolean;
  error: string | null;
}

const initialState: DepartmentState = {
  departmentData: null,
  loading: false,
  error: null,
};

// === SLICE ===

const departmentSlice = createSlice({
  name: "department",
  initialState,
  reducers: {
    clearDepartmentState: (state) => {
      state.departmentData = null;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch
    builder
      .addCase(fetchDepartment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchDepartment.fulfilled,
        (state, action: PayloadAction<DataDepartment>) => {
          state.loading = false;
          state.departmentData = action.payload;
        }
      )
      .addCase(fetchDepartment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Create
    builder
      .addCase(createDepartment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        createDepartment.fulfilled,
        (state, action: PayloadAction<DepartmentPayload>) => {
          state.loading = false;
          if (state.departmentData) {
            state.departmentData.data.push(action.payload);
            state.departmentData.count += 1;
          }
        }
      )
      .addCase(createDepartment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Update
    builder
      .addCase(updateDepartment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        updateDepartment.fulfilled,
        (state, action: PayloadAction<DepartmentPayload>) => {
          state.loading = false;

          if (state.departmentData) {
            const idx = state.departmentData.data.findIndex(
              (d) => d.id === action.payload.id
            );

            if (idx !== -1) {
              state.departmentData.data[idx] = action.payload;
            }
          }
        }
      )
      .addCase(updateDepartment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Delete
    builder
      .addCase(deleteDepartment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        deleteDepartment.fulfilled,
        (
          state,
          action: PayloadAction<
            { id?: string } | DepartmentPayload | void
          >
        ) => {
          state.loading = false;

          const returnedId =
            (action.payload && (action.payload as any).id) ||
            (action as any).meta?.arg;

          if (state.departmentData && returnedId) {
            state.departmentData.data = state.departmentData.data.filter(
              (d) => d.id !== returnedId
            );
            state.departmentData.count = Math.max(
              0,
              (state.departmentData.count || 0) - 1
            );
          }
        }
      )
      .addCase(deleteDepartment.rejected, (state, action) => {
        state.loading = false;
        state.error =
          typeof action.payload === "string"
            ? action.payload
            : JSON.stringify(action.payload);
      });
  },
});

export const { clearDepartmentState } = departmentSlice.actions;
export default departmentSlice.reducer;
