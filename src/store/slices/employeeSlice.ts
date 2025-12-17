import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import employeeService, {
  DataEmployee,
  EmployeeDetailResponse,
  EmployeePayload,
  EmployeeRequest,
} from "../../service/employeeService";

// === THUNKS ===
export const fetchEmployee = createAsyncThunk(
  "employee/fetchEmployee",
  async (_, { rejectWithValue }) => {
    try {
      const data = await employeeService.getEmployeeData();
      return data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const fetchEmployeeDetail = createAsyncThunk(
  "employee/fetchEmployeeDetail",
  async (employeeId: string, { rejectWithValue }) => {
    try {
      const data = await employeeService.getEmployeeDetail(employeeId);
      return data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const createEmployee = createAsyncThunk(
  "employee/createEmployee",
  async (payload: EmployeeRequest, { rejectWithValue }) => {
    try {
      const data = await employeeService.createEmployee(payload);
      return data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const updateEmployee = createAsyncThunk(
  "employee/updateEmployee",
  async (
    { employeeId, payload }: { employeeId: string; payload: EmployeeRequest },
    { rejectWithValue }
  ) => {
    try {
      const data = await employeeService.updateEmployee(employeeId, payload);
      return data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const deleteEmployee = createAsyncThunk(
  "employee/deleteEmployee",
  async (employeeId: string, { rejectWithValue }) => {
    try {
      const data = await employeeService.deleteEmployee(employeeId);
      return data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// === STATE ===
interface EmployeeState {
  employeeData: DataEmployee | null;
  employeeDetail: EmployeeDetailResponse | null;
  loading: boolean;
  detailLoading: boolean;
  createLoading: boolean;
  updateLoading: boolean;
  deleteLoading: boolean;
  error: string | null;
}

const initialState: EmployeeState = {
  employeeData: null,
  employeeDetail: null,
  loading: false, // Untuk fetch list
  detailLoading: false, // Untuk fetch detail
  createLoading: false, // Untuk create
  updateLoading: false, // Untuk update
  deleteLoading: false, // Untuk delete
  error: null,
};

// === SLICE ===
const employeeSlice = createSlice({
  name: "employee",
  initialState,
  reducers: {
    clearEmployeeDetail: (state) => {
      state.employeeDetail = null;
    },
    clearEmployeeError: (state) => {
      state.error = null;
    },
    clearEmployeeState: () => initialState,

    // Set employee detail langsung (untuk setelah create)
    setEmployeeDetail: (
      state,
      action: PayloadAction<EmployeeDetailResponse>
    ) => {
      state.employeeDetail = action.payload;
    },
  },
  extraReducers: (builder) => {
    // fetchEmployee (LIST)
    builder
      .addCase(fetchEmployee.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEmployee.fulfilled, (state, action) => {
        state.loading = false;
        state.employeeData = action.payload;
      })
      .addCase(fetchEmployee.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // fetchEmployeeDetail (DETAIL)
    builder
      .addCase(fetchEmployeeDetail.pending, (state) => {
        state.detailLoading = true;
        state.error = null;
      })
      .addCase(
        fetchEmployeeDetail.fulfilled,
        (
          state,
          action: PayloadAction<EmployeeDetailResponse>
        ) => {
          state.detailLoading = false;
          state.employeeDetail = action.payload;
        }
      )
      .addCase(fetchEmployeeDetail.rejected, (state, action) => {
        state.detailLoading = false;
        state.error = action.payload as string;
      });

    // createEmployee
    builder
      .addCase(createEmployee.pending, (state) => {
        state.createLoading = true;
        state.error = null;
      })
      .addCase(
        createEmployee.fulfilled,
        (state, action: PayloadAction<EmployeePayload>) => {
          state.createLoading = false;

          // Update list data
          if (state.employeeData) {
            state.employeeData.data.push(action.payload);
            state.employeeData.count++;
          }
        }
      )
      .addCase(createEmployee.rejected, (state, action) => {
        state.createLoading = false;
        state.error = action.payload as string;
      });

    // updateEmployee
    builder
      .addCase(updateEmployee.pending, (state) => {
        state.updateLoading = true;
        state.error = null;
      })
      .addCase(
        updateEmployee.fulfilled,
        (state, action: PayloadAction<EmployeePayload>) => {
          state.updateLoading = false;

          // Update list data
          if (state.employeeData) {
            const index = state.employeeData.data.findIndex(
              (emp) => emp.id === action.payload.id
            );
            if (index !== -1) {
              state.employeeData.data[index] = action.payload;
            }
          }

          // Update detail jika sedang dilihat
          if (state.employeeDetail?.id === action.payload.id) {
            // Kita perlu fetch detail lagi untuk mendapatkan data relations yang update
            console.log(
              "Employee updated, need to refetch detail for relations"
            );
          }
        }
      )
      .addCase(updateEmployee.rejected, (state, action) => {
        state.updateLoading = false;
        state.error = action.payload as string;
      });

    // deleteEmployee
    builder
      .addCase(deleteEmployee.pending, (state) => {
        state.deleteLoading = true;
        state.error = null;
      })
      .addCase(deleteEmployee.fulfilled, (state, action) => {
        state.deleteLoading = false;

        // Hapus dari list
        if (state.employeeData) {
          state.employeeData.data = state.employeeData.data.filter(
            (emp) => emp.id !== action.meta.arg
          );
          state.employeeData.count = Math.max(
            0,
            (state.employeeData.count || 0) - 1
          );
        }

        // Clear detail jika yang dihapus sedang dilihat
        if (state.employeeDetail?.id === action.meta.arg) {
          state.employeeDetail = null;
        }
      })
      .addCase(deleteEmployee.rejected, (state, action) => {
        state.deleteLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  clearEmployeeDetail,
  clearEmployeeError,
  clearEmployeeState,
  setEmployeeDetail,
} = employeeSlice.actions;

export default employeeSlice.reducer;
