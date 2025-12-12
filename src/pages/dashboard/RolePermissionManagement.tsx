// src/pages/roles/RolePermissionPage.tsx
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../../store";
import Table, { Column } from "../../components/table/TableData";
import ModalForm from "../../components/modal/FormModal";
import {
  fetchRolePermissions,
  fetchPermissions,
  createRole,
  updateRole,
  deleteRoleAction,
  resetDetail,
} from "../../store/slices/rolePermissionSlice";
import {
  RolePermissionPayload,
  RolePermissionRequest,
  PermissionInfo,
} from "../../service/rolePermissionService";
import ModalDetail from "../../components/modal/DetailModal";
import ModalAlert from "../../components/modal/AlertModal";
import Button from "../../components/button/Button";

const RolePermissionPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { list, permissions, loading } = useSelector(
    (state: RootState) => state.rolePermission
  );

  const [modalOpen, setModalOpen] = useState(false);
  const [modalDetailOpen, setModalDetailOpen] = useState(false);
  const [editRole, setEditRole] = useState<RolePermissionPayload | null>(null);

  // ⭐ ALERT STATE
  const [alert, setAlert] = useState<{
    open: boolean;
    type: "success" | "error" | "confirm";
    message: string;
    onConfirm?: () => void;
  }>({
    open: false,
    type: "success",
    message: "",
  });

  const showAlert = (
    type: "success" | "error" | "confirm",
    message: string,
    onConfirm?: () => void
  ) => {
    setAlert({
      open: true,
      type,
      message,
      onConfirm,
    });
  };

  const closeAlert = () => {
    setAlert((p) => ({ ...p, open: false }));
  };

  // =====================================================
  useEffect(() => {
    dispatch(fetchRolePermissions());
    dispatch(fetchPermissions());
  }, [dispatch]);

  // =====================================================

  const handleCreateOrUpdate = async (values: RolePermissionRequest) => {
    try {
      if (editRole) {
        await dispatch(updateRole({ id: editRole.id, data: values })).unwrap();
        showAlert("success", "Role berhasil diperbarui!");
      } else {
        await dispatch(createRole(values)).unwrap();
        showAlert("success", "Role berhasil dibuat!");
      }

      setModalOpen(false);
      setEditRole(null);
      dispatch(fetchRolePermissions());
    } catch (err: any) {
      showAlert("error", err?.message || "Terjadi kesalahan.");
    }
  };

  const handleDelete = (roleId: string) => {
    showAlert("confirm", "Yakin ingin menghapus role ini?", async () => {
      try {
        await dispatch(deleteRoleAction(roleId)).unwrap();
        showAlert("success", "Role berhasil dihapus!");
        dispatch(fetchRolePermissions());
      } catch (err: any) {
        showAlert("error", err?.message || "Gagal menghapus role.");
      }
    });
  };

  const handleEdit = (role: RolePermissionPayload) => {
    setEditRole(role);
    setModalOpen(true);
  };

  const handleDetail = (role: RolePermissionPayload) => {
    setEditRole(role);
    setModalDetailOpen(true);
  };

  const handleModalClose = () => {
    setEditRole(null);
    setModalOpen(false);
  };

  const handleDetailClose = () => {
    setEditRole(null);
    setModalDetailOpen(false);
    dispatch(resetDetail());
  };

  // =====================================================
  const columns: Column<RolePermissionPayload>[] = [
    { header: "Nama", accessor: "name" },
    { header: "Deskripsi", accessor: "description" },
  ];

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Role & Permission</h1>
      <div className="flex justify-between items-center mb-4">
        <Button
          label="Tambah Role"
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-white hover:opacity-70 transition-all"
          // icon={<Plus size={18} />}
          bgColor="#189AB4"
          onClick={() => setModalOpen(true)}
        />
      </div>

      <Table
        key={list.length}
        columns={columns}
        data={list}
        actions={(row) => (
          <div className="flex justify-center gap-2">
            <Button
              label="Detail"
              className="flex items-center gap-2 px-2 py-1 rounded-sm text-white hover:opacity-70 transition-all"
              // icon={<Plus size={18} />}
              bgColor="#189AB4"
              onClick={() => handleDetail(row)}
            />
            <Button
              label="Edit"
              className="flex items-center gap-2 px-2 py-1 rounded-sm text-white hover:opacity-70 transition-all"
              // icon={<Plus size={18} />}
              bgColor="#eab308"
              onClick={() => handleEdit(row)}
            />
            <Button
              label="Hapus"
              className="flex items-center gap-2 px-2 py-1 rounded-sm text-white hover:opacity-70 transition-all"
              // icon={<Plus size={18} />}
              bgColor="#ef4444"
              onClick={() => handleDelete(row.id)}
            />
          </div>
        )}
        emptyMessage={loading ? "Loading..." : "No roles found"}
      />

      {/* Modal Form */}
      {modalOpen && (
        <ModalForm<RolePermissionRequest>
          title={editRole ? "Edit Role" : "Create Role"}
          initialValues={{
            name: editRole?.name || "",
            description: editRole?.description || "",
            permissionsIDs: editRole
              ? editRole.permissions.map((p) => p.id)
              : [],
          }}
          onSubmit={handleCreateOrUpdate}
          onClose={handleModalClose}
        >
          {(values, setValues) => {
            const groupedPermissions = permissions.reduce<
              Record<string, typeof permissions>
            >((acc, p) => {
              if (!acc[p.resource]) acc[p.resource] = [];
              acc[p.resource].push(p);
              return acc;
            }, {});

            const toggleGroup = (perms: typeof permissions) => {
              const allSelected = perms.every((p) =>
                values.permissionsIDs.includes(p.id)
              );

              if (allSelected) {
                setValues({
                  ...values,
                  permissionsIDs: values.permissionsIDs.filter(
                    (pid) => !perms.some((p) => p.id === pid)
                  ),
                });
              } else {
                setValues({
                  ...values,
                  permissionsIDs: [
                    ...new Set([
                      ...values.permissionsIDs,
                      ...perms.map((p) => p.id),
                    ]),
                  ],
                });
              }
            };

            return (
              <div className="space-y-4">
                <div>
                  <label className="block font-medium mb-1">Name</label>
                  <input
                    type="text"
                    className="w-full border px-3 py-2 rounded"
                    value={values.name}
                    onChange={(e) =>
                      setValues({ ...values, name: e.target.value })
                    }
                    required
                  />
                </div>

                <div>
                  <label className="block font-medium mb-1">Description</label>
                  <textarea
                    className="w-full border px-3 py-2 rounded"
                    value={values.description}
                    onChange={(e) =>
                      setValues({ ...values, description: e.target.value })
                    }
                  />
                </div>

                <div>
                  <label className="block font-medium mb-2">Permissions</label>

                  <div className="space-y-2">
                    {Object.entries(groupedPermissions).map(
                      ([resource, perms]) => {
                        const allSelected = perms.every((p) =>
                          values.permissionsIDs.includes(p.id)
                        );

                        return (
                          <label
                            key={resource}
                            className="flex items-center gap-2 cursor-pointer border p-2 rounded bg-gray-50"
                          >
                            <input
                              type="checkbox"
                              checked={allSelected}
                              onChange={() => toggleGroup(perms)}
                              className="rounded border-gray-300 text-blue-600"
                            />
                            <span className="font-semibold text-gray-700">
                              {resource
                                .split("-")
                                .map((w) => w[0].toUpperCase() + w.slice(1))
                                .join(" ")}
                            </span>
                          </label>
                        );
                      }
                    )}
                  </div>
                </div>
              </div>
            );
          }}
        </ModalForm>
      )}

      {/* Modal Detail */}
      {modalDetailOpen && editRole && (
        <ModalDetail
          open={modalDetailOpen}
          onClose={handleDetailClose}
          title="Detail Role"
          data={editRole}
          fields={[
            // Header Section - Role Icon & Name
            {
              key: "icon",
              label: "",
              type: "custom",
              render: () => (
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg">
                    <svg
                      className="w-8 h-8 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">
                      {editRole.name}
                    </h3>
                  </div>
                </div>
              ),
            },

            // Description
            {
              key: "description",
              label: "Deskripsi",
              type: "custom",
              
              render: (value) => (
                  <p className="text-gray-700 leading-relaxed">
                    {value || "No description provided"}
                  </p>
              ),
            },

            // Permission Groups
            {
              key: "permissions",
              label: "Permission Groups",
              type: "custom",
              
              render: (permissions: PermissionInfo[]) => {
                if (!permissions || permissions.length === 0) {
                  return (
                    <div className="text-center py-6 bg-gray-50 rounded-lg border border-gray-200">
                      <svg
                        className="w-8 h-8 text-gray-400 mx-auto mb-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                        />
                      </svg>
                      <p className="text-gray-500">No permissions assigned</p>
                    </div>
                  );
                }

                // Group permissions by their prefix (e.g., "user-", "role-", etc.)
                const groupedPermissions: Record<string, PermissionInfo[]> = {};

                permissions.forEach((permission) => {
                  const parts = permission.name.split("-");
                  const group = parts[0] || "general";

                  if (!groupedPermissions[group]) {
                    groupedPermissions[group] = [];
                  }
                  groupedPermissions[group].push(permission);
                });

                return (
                  <div className="space-y-4">
                    {Object.entries(groupedPermissions).map(
                      ([group, groupPermissions]) => (
                        <div
                          key={group}
                          className="border border-gray-200 rounded-xl overflow-hidden"
                        >
                          {/* Group Header */}
                          <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-4 py-3 border-b border-gray-200">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-lg bg-white border border-gray-200 flex items-center justify-center">
                                  <svg
                                    className="w-4 h-4 text-gray-600"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                                    />
                                  </svg>
                                </div>
                                <h4 className="font-semibold text-gray-800 capitalize">
                                  {group
                                    .replace(/([a-z])([A-Z])/g, "$1 $2")
                                    .toLowerCase()}
                                </h4>
                              </div>
                              <span className="text-xs font-medium bg-white text-gray-700 px-2.5 py-1 rounded-full">
                                {groupPermissions.length} permissions
                              </span>
                            </div>
                          </div>

                          
                        </div>
                      )
                    )}

                    {/* Summary */}
                    <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-xl p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <svg
                            className="w-5 h-5 text-blue-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                          <span className="font-medium text-blue-800">
                            Permission Summary
                          </span>
                        </div>
                        <div className="text-sm text-blue-700 bg-white px-3 py-1 rounded-full font-semibold">
                          {permissions.length} total permissions
                        </div>
                      </div>
                      <div className="mt-2 grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                        <div className="text-center">
                          <div className="font-bold text-green-600">
                            {
                              permissions.filter((p) => p.name.includes("read"))
                                .length
                            }
                          </div>
                          <div className="text-gray-600">Read</div>
                        </div>
                        <div className="text-center">
                          <div className="font-bold text-blue-600">
                            {
                              permissions.filter((p) =>
                                p.name.includes("create")
                              ).length
                            }
                          </div>
                          <div className="text-gray-600">Create</div>
                        </div>
                        <div className="text-center">
                          <div className="font-bold text-yellow-600">
                            {
                              permissions.filter((p) =>
                                p.name.includes("update")
                              ).length
                            }
                          </div>
                          <div className="text-gray-600">Update</div>
                        </div>
                        <div className="text-center">
                          <div className="font-bold text-red-600">
                            {
                              permissions.filter((p) =>
                                p.name.includes("delete")
                              ).length
                            }
                          </div>
                          <div className="text-gray-600">Delete</div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              },
            },
          ]}
          width="xl"
          maxHeight="max-h-[70vh]"
          headerColor="#189AB4"
          showFooter={true}
        >
          
        </ModalDetail>
      )}

      {/* ⭐ MODAL ALERT */}
      <ModalAlert
        open={alert.open}
        type={alert.type}
        message={alert.message}
        onClose={closeAlert}
        onConfirm={alert.onConfirm}
      />
    </div>
  );
};

export default RolePermissionPage;
