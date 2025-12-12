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

export const permissionsData = async (): Promise<PermissionInfo[]> => {
  const res = await api.get("/role-permission/data/permission", authHeader());

  const mapped = res.data.data.flatMap((group: any) => {
    if (!Array.isArray(group.permissions)) return [];
    return group.permissions.map((p: any) => ({
      id: p.id || p.ID,
      name: p.name || p.Name,
      action: p.action || p.Action,
      resource: p.resource || p.Resource,
    }));
  });

  //   console.log("%c[permissionsData] RAW DATA:", "color:#60a5fa;", res.data.data);
  //   console.log("%c[permissionsData] MAPPED:", "color:#34d399;", mapped);

  return mapped;
};

export const roleData = async (): Promise<{
  data: RolePermissionPayload[];
  count: number;
}> => {
  const res = await api.get("/role-permission/data", authHeader());

  const rawData = res.data.data; // pastikan ini array
  const mapped = Array.isArray(rawData) ? rawData.map(mapRole) : [];

  return {
    data: mapped,
    count: mapped.length,
  };
};

export const roleDetail = async (
  roleId: string
): Promise<RolePermissionPayload> => {
  const res = await api.get(`/role-permission/detail/${roleId}`, authHeader());
  console.log("[roleDetail] API response raw:", res.data); 
  return mapRole(res.data);
};

export const createRolePermission = async (
  payload: RolePermissionRequest
): Promise<RolePermissionPayload> => {
  const res = await api.post("/role-permission/create", payload, authHeader());
  return mapRole(res.data.data);
};

export const updateRolePermission = async (
  roleId: string,
  payload: RolePermissionRequest
): Promise<RolePermissionPayload> => {
  const res = await api.put(
    `/role-permission/update/${roleId}`,
    payload,
    authHeader()
  );
  return mapRole(res.data.data);
};

export const deleteRolePermission = async (roleId: string): Promise<{ id: string }> => {
  const res = await api.delete<{ id: string }>(
    `/role-permission/delete/${roleId}`,
    authHeader()
  );
  return res.data;
};
