import api from "../config/axios";

export interface RolePermissionRequest {
  name: string;
  description: string;
  permissionsIDs: string[];
}

export interface RolePermissionPayload {
  id: string;
  name: string;
  description: string;
  permissions: PermissionInfo[];
}

export interface PermissionInfo {
  id: string;
  name: string;
  action: string;
  resource: string;
}

export interface DataRoleAndPermission {
  count: number;
  data: RolePermissionPayload[];
}

const authHeader = () => {
  const token = localStorage.getItem("token");
  if (!token) return { headers: {} };

  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

const mapPermission = (p: any): PermissionInfo => ({
  id: String(p?.ID ?? p?.id ?? ""),
  name: p?.Name ?? p?.name ?? "",
  action: p?.Action ?? p?.action ?? "",
  resource: p?.Resource ?? p?.resource ?? "",
});

const mapRole = (d: any): RolePermissionPayload => ({
  id: String(d?.ID ?? d?.id ?? ""),
  name: d?.Name ?? d?.name ?? "",
  description: d?.Description ?? d?.description ?? "",
  permissions: Array.isArray(d?.Permissions ?? d?.permissions)
    ? (d?.Permissions ?? d?.permissions).filter(Boolean).map(mapPermission)
    : [],
});


// Mapper untuk Role
// const mapRole = (raw: any): RolePermissionPayload => ({
//   id: raw.id,
//   name: raw.name,
//   description: raw.description ?? "",
//   permissions: Array.isArray(raw.permissions)
//     ? raw.permissions.map((p: any) => ({
//         id: p.id,
//         name: p.name,
//         action: p.action,
//         resource: p.resource,
//       }))
//     : [],
// });

class RolePermissionService {
  private base = "/role-permission";

  /**
   * GET /role-permission/data/permission
   */
  async dataPermissions(): Promise<PermissionInfo[]> {
    const response = await api.get(
      `${this.base}/data/permission`,
      authHeader()
    );

    const list = response.data.data;

    return list.flatMap((group: any) => {
      if (!Array.isArray(group.permissions)) return [];
      return group.permissions.map((p: any) => ({
        id: p.id,
        name: p.name,
        action: p.action,
        resource: p.resource,
      }));
    });
  }

  /**
   * GET /role-permission/data
   */
  async getAllDataRolePermission(): Promise<{ data: RolePermissionPayload[]; count: number }> {
    const response = await api.get(`${this.base}/data`, authHeader());

    const rawData = response.data.data;
    const mapped = Array.isArray(rawData) ? rawData.map(mapRole) : [];

    return {
      data: mapped,
      count: mapped.length,
    };
  }

  /**
   * GET /role-permission/detail/:id
   */
  async detailrolePermission(roleId: string): Promise<RolePermissionPayload> {
    const response = await api.get(
      `${this.base}/detail/${roleId}`,
      authHeader()
    );

    return mapRole(response.data);
  }

  /**
   * POST /role-permission/create
   */
  async createRolePermission(
    payload: RolePermissionRequest
  ): Promise<RolePermissionPayload> {
    const response = await api.post(
      `${this.base}/create`,
      payload,
      authHeader()
    );

    return mapRole(response.data.data);
  }

  /**
   * PUT /role-permission/update/:id
   */
  async updateRolePermission(
    roleId: string,
    payload: RolePermissionRequest
  ): Promise<RolePermissionPayload> {
    const response = await api.put(
      `${this.base}/update/${roleId}`,
      payload,
      authHeader()
    );

    return mapRole(response.data.data);
  }

  /**
   * DELETE /role-permission/delete/:id
   */
  async deleteRolePermission(
    roleId: string
  ): Promise<{ id: string }> {
    const response = await api.delete(
      `${this.base}/delete/${roleId}`,
      authHeader()
    );
    return response.data;
  }
}

export default new RolePermissionService;
