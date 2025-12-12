import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../../store";
import Table, { Column } from "../../components/table/TableData";
import ModalForm from "../../components/modal/FormModal";
import ModalAlert from "../../components/modal/AlertModal";

import {
  fetchDepartment,
  createDepartment,
  updateDepartment,
  deleteDepartment,
} from "../../store/slices/departmentSlice";

import {
  DepartmentPayload,
  DepartmentRequest,
} from "../../service/departmentService";
import Button from "../../components/button/Button";
import { Pencil, Plus, Trash2 } from "lucide-react";

const DepartmentPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { departmentData, loading, error } = useSelector(
    (state: RootState) => state.department
  );

  const [modalOpen, setModalOpen] = useState(false);
  const [editDepartment, setEditDepartment] =
    useState<DepartmentPayload | null>(null);

  // ModalAlert states
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertType, setAlertType] = useState<"success" | "error" | "confirm">(
    "success"
  );
  const [alertMessage, setAlertMessage] = useState("");
  const [confirmAction, setConfirmAction] = useState<() => void>(() => {});

  useEffect(() => {
    dispatch(fetchDepartment());
  }, [dispatch]);

  // ==========================
  // CREATE / UPDATE
  // ==========================
  const handleCreateOrUpdate = async (values: DepartmentRequest) => {
    setAlertType("confirm");
    setAlertMessage(
      editDepartment
        ? "Yakin ingin mengubah department ini?"
        : "Yakin ingin membuat department baru?"
    );
    setAlertOpen(true);

    setConfirmAction(() => async () => {
      try {
        if (editDepartment) {
          await dispatch(
            updateDepartment({
              departmentId: editDepartment.id,
              payload: values,
            })
          ).unwrap();
        } else {
          await dispatch(createDepartment(values)).unwrap();
        }

        setModalOpen(false);
        setEditDepartment(null);
        dispatch(fetchDepartment());

        setAlertType("success");
        setAlertMessage(
          editDepartment
            ? "Department berhasil diupdate!"
            : "Department berhasil dibuat!"
        );
        setAlertOpen(true);
      } catch (err: any) {
        setAlertType("error");
        setAlertMessage(
          err?.message || "Terjadi kesalahan. Gagal menyimpan data."
        );
        setAlertOpen(true);
      }
    });
  };

  // ==========================
  // DELETE
  // ==========================
  const handleDelete = (id: string) => {
    setAlertType("confirm");
    setAlertMessage("Apakah kamu yakin ingin menghapus department ini?");
    setAlertOpen(true);

    setConfirmAction(() => async () => {
      try {
        await dispatch(deleteDepartment(id)).unwrap();

        setAlertType("success");
        setAlertMessage("Department berhasil dihapus!");
        setAlertOpen(true);

        dispatch(fetchDepartment());
      } catch (err: any) {
        setAlertType("error");
        setAlertMessage("Gagal menghapus department.");
        setAlertOpen(true);
      }
    });
  };

  // ==========================
  // EDIT
  // ==========================
  const handleEdit = (department: DepartmentPayload) => {
    setEditDepartment(department);
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setEditDepartment(null);
    setModalOpen(false);
  };

  // ==========================
  // TABLE COLUMN
  // ==========================
  const columns: Column<DepartmentPayload>[] = [
    { header: "Nama Deparment", accessor: "name" },
    { header: "Tanggal Dibuat", accessor: "createdAt" },
  ];

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Department</h1>
      <div className="flex justify-between items-center mb-4">
        <Button
          label="Tambah Department"
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-white hover:opacity-70 transition-all"
          // icon={<Plus size={18} />}
          bgColor="#189AB4"
          onClick={() => setModalOpen(true)}
        />
      </div>

      {error && <p className="text-red-500">{error}</p>}

      <Table
        columns={columns}
        data={departmentData?.data || []}
        actions={(row) => (
          <div className="flex justify-center gap-2">
            <Button
              label="Edit"
              // icon={<Pencil size={14} />}
              bgColor="#eab308"
              className="flex items-center gap-1 px-2 py-1 rounded-sm text-white hover:opacity-70 transition-all"
              onClick={() => handleEdit(row)}
            />
            <Button
              label="Hapus"
              // icon={<Trash2 size={14} />}
              bgColor="#ef4444"
              className="flex items-center gap-2 px-1 py-1 rounded-sm text-white hover:opacity-70 transition-all"
              onClick={() => handleDelete(row.id)}
            />
          </div>
        )}
        emptyMessage={loading ? "Loading..." : "No departments found"}
      />

      {/* Modal Form */}
      {modalOpen && (
        <ModalForm<DepartmentRequest>
          title={editDepartment ? "Edit Department" : "Buat Department"}
          initialValues={{
            name: editDepartment?.name || "",
          }}
          onSubmit={handleCreateOrUpdate}
          onClose={handleModalClose}
        >
          {(values, setValues) => (
            <div>
              <label className="block font-medium mb-1">Name</label>
              <input
                type="text"
                className="w-full border px-3 py-2 rounded"
                value={values.name}
                onChange={(e) => setValues({ ...values, name: e.target.value })}
                required
              />
            </div>
          )}
        </ModalForm>
      )}

      {/* Modal Alert */}
      <ModalAlert
        open={alertOpen}
        type={alertType}
        message={alertMessage}
        onClose={() => setAlertOpen(false)}
        onConfirm={confirmAction}
        confirmText="Ya"
        cancelText="Batal"
      />
    </div>
  );
};

export default DepartmentPage;
