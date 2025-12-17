import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import RolePermissionService, {
  PermissionInfo,
  RolePermissionPayload,
  RolePermissionRequest,
} from "../../service/rolePermissionService";

// =====================================================
// FETCH ALL PERMISSIONS
// =====================================================
export const fetchPermissions = createAsyncThunk<PermissionInfo[]>(
  "rolePermission/fetchPermissions",
  async () => {
    const data = await RolePermissionService.dataPermissions();
    return data;
  }
);


// =====================================================
// FETCH ALL ROLES
// =====================================================
export const fetchRolePermissions = createAsyncThunk<{
  data: RolePermissionPayload[];
  count: number;
}>("rolePermission/fetchRolePermissions", async () => {
  const response = await RolePermissionService.getAllDataRolePermission();

  return response;
});

// =====================================================
// FETCH DETAIL ROLE
// =====================================================
export const fetchRoleDetail = createAsyncThunk<RolePermissionPayload, string>(
  "rolePermission/fetchRoleDetail",
  async (id) => {
    const detail = await RolePermissionService.detailrolePermission(id);


    detail.permissions.forEach((p) => console.log("DETAIL PERMISSION:", p.id));

    return detail;
  }
);

// =====================================================
// CREATE ROLE
// =====================================================
export const createRole = createAsyncThunk<
  RolePermissionPayload,
  RolePermissionRequest
>("rolePermission/createRole", async (payload) => {
  const res = await RolePermissionService.createRolePermission(payload);


  return res;
});

// =====================================================
// UPDATE ROLE
// =====================================================
export const updateRole = createAsyncThunk<
  RolePermissionPayload,
  { id: string; data: RolePermissionRequest }
>("rolePermission/updateRole", async ({ id, data }) => {
  const updated = await RolePermissionService.updateRolePermission(id, data);

  return updated;
});

// =====================================================
// DELETE ROLE
// =====================================================
export const deleteRoleAction = createAsyncThunk<{ id: string }, string>(
  "rolePermission/deleteRole",
  async (id) => {
    const res = await RolePermissionService.deleteRolePermission(id);
    return res;
  }
);


interface RolePermissionState {
  list: RolePermissionPayload[];
  permissions: PermissionInfo[];
  detail: RolePermissionPayload | null;
  count: number;
  loading: boolean;
  loadingList: boolean;
  error: string | null;
}

const initialState: RolePermissionState = {
  list: [],
  permissions: [],
  detail: null,
  count: 0,
  loading: false,
  loadingList: false,
  error: null,
};

const rolePermissionSlice = createSlice({
  name: "rolePermission",
  initialState,
  reducers: {
    resetDetail(state) {
      state.detail = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPermissions.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPermissions.fulfilled, (state, action) => {
        state.loading = false;

        state.permissions = action.payload;
      })
      .addCase(fetchPermissions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || null;
      });

    builder
      .addCase(fetchRolePermissions.pending, (state) => {
        state.loading = true;
        state.loadingList = true;
      })
      .addCase(fetchRolePermissions.fulfilled, (state, action) => {
        state.loading = false;
        state.loadingList = false;

        state.list = action.payload.data;
        state.count = action.payload.count;
      })
      .addCase(fetchRolePermissions.rejected, (state, action) => {
        state.loading = false;
        state.loadingList = false;
        state.error = action.error.message || null;
      });

    builder
      .addCase(fetchRoleDetail.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchRoleDetail.fulfilled, (state, action) => {
        state.loading = false;
        state.detail = action.payload;
      })
      .addCase(fetchRoleDetail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || null;
      });

    builder
      .addCase(createRole.pending, (state) => {
        state.loading = true;
      })
      .addCase(createRole.fulfilled, (state, action) => {
        state.loading = false;
        state.list = [...state.list, action.payload];
      })
      .addCase(createRole.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || null;
      });

    builder
      .addCase(updateRole.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateRole.fulfilled, (state, action) => {
        state.loading = false;

        const idx = state.list.findIndex((x) => x.id === action.payload.id);
        if (idx !== -1) state.list[idx] = action.payload;

        if (state.detail?.id === action.payload.id) {
          state.detail = action.payload;
        }
      })
      .addCase(updateRole.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || null;
      });

    builder
      .addCase(deleteRoleAction.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteRoleAction.fulfilled, (state, action) => {
        state.loading = false;

        state.list = state.list.filter((e) => e.id !== action.payload.id);

        if (state.detail?.id === action.payload.id) {
          state.detail = null;
        }
      })
      .addCase(deleteRoleAction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || null;
      });
  },
});

export const { resetDetail } = rolePermissionSlice.actions;
export default rolePermissionSlice.reducer;
