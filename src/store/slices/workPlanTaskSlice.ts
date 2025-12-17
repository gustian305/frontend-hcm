import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import WorkPlanTaskService, {
  DataWorkPlan,
  DataWorkTask,
  WorkPlanPayload,
  WorkPlanRequest,
  WorkTaskPayload,
  WorkTaskRequest,
} from "../../service/workPlanTaskService";

// ======================================================
// ASYNC THUNKS
// ======================================================

// 🔹 WORK PLAN
export const getAllWorkPlans = createAsyncThunk<DataWorkPlan>(
  "workPlan/getAll",
  async (_, { rejectWithValue }) => {
    try {
      return await WorkPlanTaskService.getAllWorkPlans();
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const detailWorkPlan = createAsyncThunk<WorkPlanPayload, string>(
  "workPlan/detail",
  async (id, { rejectWithValue }) => {
    try {
      return await WorkPlanTaskService.detailWorkPlan(id);
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const createWorkPlan = createAsyncThunk<
  WorkPlanPayload,
  WorkPlanRequest
>("workPlan/create", async (payload, { rejectWithValue }) => {
  try {
    return await WorkPlanTaskService.createWorkPlan(payload);
  } catch (error: any) {
    return rejectWithValue(error.response?.data || error.message);
  }
});

export const updateWorkPlan = createAsyncThunk<
  WorkPlanPayload,
  { id: string; payload: WorkPlanRequest }
>("workPlan/update", async ({ id, payload }, { rejectWithValue }) => {
  try {
    return await WorkPlanTaskService.updateWorkPlan(id, payload);
  } catch (error: any) {
    return rejectWithValue(error.response?.data || error.message);
  }
});

export const deleteWorkPlan = createAsyncThunk<
  { message: string; id: string },
  string
>("workPlan/delete", async (id, { rejectWithValue }) => {
  try {
    await WorkPlanTaskService.deleteWorkPlan(id);
    return { message: "success", id }; // passing id supaya reducer bisa hapus
  } catch (error: any) {
    return rejectWithValue(error.response?.data || error.message);
  }
});

// 🔹 WORK TASK
export const getTasks = createAsyncThunk<DataWorkTask, string>(
  "workTask/getAll",
  async (workPlanId, { rejectWithValue }) => {
    try {
      return await WorkPlanTaskService.getTasks(workPlanId);
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const detailTask = createAsyncThunk<
  WorkTaskPayload,
  { workPlanId: string; taskId: string }
>("workTask/detail", async ({ workPlanId, taskId }, { rejectWithValue }) => {
  try {
    return await WorkPlanTaskService.detailTask(workPlanId, taskId);
  } catch (error: any) {
    return rejectWithValue(error.response?.data || error.message);
  }
});

export const createTask = createAsyncThunk<
  WorkTaskPayload,
  { workPlanId: string; payload: WorkTaskRequest }
>("workTask/create", async ({ workPlanId, payload }, { rejectWithValue }) => {
  try {
    return await WorkPlanTaskService.createTask(workPlanId, payload);
  } catch (error: any) {
    return rejectWithValue(error.response?.data || error.message);
  }
});

export const updateTask = createAsyncThunk<
  WorkTaskPayload,
  { workPlanId: string; taskId: string; payload: WorkTaskRequest }
>(
  "workTask/update",
  async ({ workPlanId, taskId, payload }, { rejectWithValue }) => {
    try {
      return await WorkPlanTaskService.updateTask(workPlanId, taskId, payload);
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const deleteTask = createAsyncThunk<
  { message: string; id: string },
  { workPlanId: string; taskId: string }
>("workTask/delete", async ({ workPlanId, taskId }, { rejectWithValue }) => {
  try {
    await WorkPlanTaskService.deleteTask(workPlanId, taskId);
    return { message: "success", id: taskId };
  } catch (error: any) {
    return rejectWithValue(error.response?.data || error.message);
  }
});

// ======================================================
// INITIAL STATE
// ======================================================

interface WorkPlanTaskState {
  workPlans: DataWorkPlan | null;
  workPlanDetail: WorkPlanPayload | null;

  tasks: DataWorkTask | null;
  taskDetail: WorkTaskPayload | null;

  loading: boolean;
  error: any;
}

const initialState: WorkPlanTaskState = {
  workPlans: null,
  workPlanDetail: null,

  tasks: null,
  taskDetail: null,

  loading: false,
  error: null,
};

// ======================================================
// SLICE
// ======================================================

const workPlanTaskSlice = createSlice({
  name: "workPlanTask",
  initialState,
  reducers: {
    resetError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // ======================================================
      // 🔹 WORK PLAN
      // ======================================================
      .addCase(getAllWorkPlans.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllWorkPlans.fulfilled, (state, action) => {
        state.loading = false;
        state.workPlans = action.payload;
      })
      .addCase(getAllWorkPlans.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(detailWorkPlan.fulfilled, (state, action) => {
        state.loading = false;
        state.workPlanDetail = action.payload;
      })

      .addCase(createWorkPlan.fulfilled, (state, action) => {
        if (!state.workPlans) {
          state.workPlans = { count: 1, data: [action.payload] };
        } else {
          state.workPlans.data.push(action.payload);
          state.workPlans.count += 1;
        }
      })

      .addCase(updateWorkPlan.fulfilled, (state, action) => {
        if (state.workPlans) {
          const idx = state.workPlans.data.findIndex(
            (w) => w.id === action.payload.id
          );
          if (idx !== -1) state.workPlans.data[idx] = action.payload;
        }
      })

      .addCase(deleteWorkPlan.fulfilled, (state, action) => {
        if (state.workPlans) {
          state.workPlans.data = state.workPlans.data.filter(
            (w) => w.id !== action.payload.id
          );
          state.workPlans.count -= 1;
        }
      });

    // ======================================================
    // 🔹 WORK TASK
    // ======================================================
    builder
      .addCase(getTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = action.payload;
      })

      .addCase(detailTask.fulfilled, (state, action) => {
        state.loading = false;
        state.taskDetail = action.payload;
      })

      .addCase(createTask.fulfilled, (state, action) => {
        if (!state.tasks) {
          state.tasks = { count: 1, data: [action.payload] };
        } else {
          state.tasks.data.push(action.payload);
          state.tasks.count += 1;
        }
      })

      .addCase(updateTask.fulfilled, (state, action) => {
        if (state.tasks) {
          const idx = state.tasks.data.findIndex(
            (t) => t.id === action.payload.id
          );
          if (idx !== -1) state.tasks.data[idx] = action.payload;
        }
      })

      .addCase(deleteTask.fulfilled, (state, action) => {
        if (state.tasks) {
          state.tasks.data = state.tasks.data.filter(
            (t) => t.id !== action.payload.id
          );
          state.tasks.count -= 1;
        }
      });
  },
});

export const { resetError } = workPlanTaskSlice.actions;
export default workPlanTaskSlice.reducer;
