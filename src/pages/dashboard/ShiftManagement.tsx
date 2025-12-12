// src/pages/shift/ShiftPage.tsx
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../../store";

import ModalForm from "../../components/modal/FormModal";
import ShiftForm from "../../components/form/ShiftForm";
import ShiftSection from "../../components/table/ShiftSection";
import Button from "../../components/button/Button";

import {
  fetchShifts,
  createShift,
  deleteShift,
} from "../../store/slices/shiftSlice";
import { fetchEmployee } from "../../store/slices/employeeSlice";
import {
  ShiftRequest,
  ShiftInfo,
  WorkDayData,
} from "../../service/shiftService";
import { useNavigate } from "react-router-dom";
import attendanceRuleService, {
  AttendanceRuleInfo,
} from "../../service/attendanceRuleService";

import {
  AssignShiftRequest,
  SwitchShiftRequest,
} from "../../service/assignShift";

import AssignForm from "../../components/form/AssignShiftForm";
import {
  fetchAssignmentsThunk,
  removeEmployeesThunk,
  switchShiftThunk,
} from "../../store/slices/assignShiftSlice";
import ModalAlert from "../../components/modal/AlertModal";

const ShiftPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const { data: shifts, error: shiftError } = useSelector(
    (state: RootState) => state.shift
  );
  const { employeeData } = useSelector((state: RootState) => state.employee);
  const { assignments, error: assignError } = useSelector(
    (state: RootState) => state.assignShift
  );

  const [modalOpen, setModalOpen] = useState(false);
  const [editingShift, setEditingShift] = useState<ShiftInfo | null>(null);

  const [workDaysList, setWorkDaysList] = useState<WorkDayData | undefined>();
  const [attendanceRule, setAttendanceRule] =
    useState<AttendanceRuleInfo | null>(null);

  const [assignOpen, setAssignOpen] = useState(false);

  // State untuk ModalAlert
  const [alert, setAlert] = useState({
    open: false,
    type: "success" as "success" | "error" | "confirm",
    message: "",
    title: "",
    onConfirm: (() => {}) as (() => void) | undefined,
  });

  // Tampilkan error dari Redux jika ada
  useEffect(() => {
    if (shiftError) {
      setAlert({
        open: true,
        type: "error",
        title: "Error Shift",
        message: shiftError,
        onConfirm: undefined,
      });
    }
  }, [shiftError]);

  useEffect(() => {
    if (assignError) {
      setAlert({
        open: true,
        type: "error",
        title: "Error Assignment",
        message: assignError,
        onConfirm: undefined,
      });
    }
  }, [assignError]);

  // Fetch workdays
  useEffect(() => {
    const fetchWorkDays = async () => {
      try {
        const response = await (
          await import("../../service/shiftService")
        ).default.getWorkDay();
        setWorkDaysList(response);
      } catch (error: any) {
        setWorkDaysList({ count: 0, data: [] });
        showAlert("error", "Gagal Memuat Hari Kerja", error.message);
      }
    };
    fetchWorkDays();
  }, []);

  // Fetch attendance rule
  useEffect(() => {
    const fetchRule = async () => {
      try {
        const rule = await attendanceRuleService.getRule();
        setAttendanceRule(rule);
      } catch (error: any) {
        setAttendanceRule(null);
        showAlert("error", "Gagal Memuat Aturan Absensi", error.message);
      }
    };
    fetchRule();
  }, []);

  // Fetch assignments
  useEffect(() => {
    dispatch(fetchAssignmentsThunk());
  }, [dispatch]);

  // Fetch shifts + employees
  useEffect(() => {
    dispatch(fetchShifts());
    dispatch(fetchEmployee());
  }, [dispatch]);

  const shiftInitialValues: ShiftRequest = editingShift
    ? {
        shiftName: editingShift.shiftName,
        workDayIds: editingShift.workDays.map((d) => d.id),
        dateStart: editingShift.dateStart,
        dateEnd: editingShift.dateEnd,
        shiftStartTime: editingShift.shiftStartTime,
        shiftEndTime: editingShift.shiftEndTime,
        isNightShift: editingShift.isNightShift,
        isActive: editingShift.isActive,
      }
    : {
        shiftName: "",
        workDayIds: [],
        dateStart: "",
        dateEnd: "",
        shiftStartTime: "",
        shiftEndTime: "",
        isNightShift: false,
        isActive: true,
      };

  /**
   * Helper function untuk menampilkan alert
   */
  const showAlert = (
    type: "success" | "error" | "confirm",
    title: string,
    message: string,
    onConfirm?: () => void
  ) => {
    setAlert({
      open: true,
      type,
      title,
      message,
      onConfirm,
    });
  };

  const closeAlert = () => {
    setAlert((prev) => ({ ...prev, open: false }));
  };

  /**
   * ==========================================
   * HANDLE CREATE / UPDATE SHIFT
   * ==========================================
   */
  const handleSubmitShift = async (values: ShiftRequest) => {
    const payload = {
      ...values,
      shiftName: values.shiftName.trim(),
      shiftStartTime: values.shiftStartTime.trim(),
      shiftEndTime: values.shiftEndTime.trim(),
      dateStart: values.dateStart.trim(),
      dateEnd: values.dateEnd.trim(),
    };

    try {
      await dispatch(createShift(payload)).unwrap();
      await dispatch(fetchShifts()).unwrap();

      setModalOpen(false);
      setEditingShift(null);

      showAlert(
        "success",
        "Berhasil!",
        editingShift
          ? "Shift berhasil diperbarui!"
          : "Shift baru berhasil dibuat!"
      );
    } catch (err: any) {
      showAlert("error", "Gagal!", err?.message || "Gagal menyimpan shift");
    }
  };

  /**
   * ==========================================
   * HANDLE DELETE SHIFT
   * ==========================================
   */
  const handleDelete = async (id: string) => {
    showAlert(
      "confirm",
      "Hapus Shift",
      "Apakah Anda yakin ingin menghapus shift ini?",
      async () => {
        try {
          await dispatch(deleteShift(id)).unwrap();
          await dispatch(fetchShifts()).unwrap();

          showAlert("success", "Berhasil!", "Shift berhasil dihapus!");
        } catch (err: any) {
          showAlert("error", "Gagal!", err?.message || "Gagal menghapus shift");
        }
      }
    );
  };

  const handleSwitch = async (payload: SwitchShiftRequest) => {
    try {
      await dispatch(switchShiftThunk(payload)).unwrap();
      await dispatch(fetchAssignmentsThunk()).unwrap();

      showAlert("success", "Berhasil!", "Shift berhasil di-switch!");
    } catch (err: any) {
      showAlert(
        "error",
        "Gagal!",
        err?.message || "Gagal melakukan switch shift"
      );
    }
  };

  /**
   * ==========================================
   * HANDLE REMOVE EMPLOYEE FROM SHIFT
   * ==========================================
   */
  const handleRemoveEmployee = async (shiftId: string, employeeId: string) => {
    showAlert(
      "confirm",
      "Hapus Karyawan dari Shift",
      "Apakah Anda yakin ingin menghapus karyawan ini dari shift?",
      async () => {
        try {
          await dispatch(
            removeEmployeesThunk({ shiftId, employeeIDs: [employeeId] })
          ).unwrap();
          await dispatch(fetchAssignmentsThunk()).unwrap();

          showAlert(
            "success",
            "Berhasil!",
            "Karyawan berhasil dihapus dari shift!"
          );
        } catch (err: any) {
          showAlert(
            "error",
            "Gagal!",
            err?.message || "Gagal menghapus karyawan dari shift"
          );
        }
      }
    );
  };

  /**
   * ==========================================
   * DEFAULT INITIAL VALUES FOR ASSIGNFORM
   * ==========================================
   */
  const assignInitialValues: AssignShiftRequest = {
    shiftId: "",
    employeeIDs: [],
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Manajemen Shift</h1>
      {/* Modal Alert */}
      <ModalAlert
        open={alert.open}
        type={alert.type}
        title={alert.title}
        message={alert.message}
        onClose={closeAlert}
        onConfirm={alert.onConfirm}
        confirmText="Ya"
        cancelText="Batal"
      />
      {/* Action Buttons */}
      <div className="flex items-center gap-3 mb-6">
        <Button
          label="Pengaturan"
          bgColor="#eab308"
          onClick={() => navigate("/settings")}
        />
        <Button
          label="Buat Shift"
          bgColor="#189AB4"
          onClick={() => {
            setEditingShift(null);
            setModalOpen(true);
          }}
        />
      </div>
      {/* Attendance Rule Info */}
      {attendanceRule ? (
        <div className="bg-green-50 border border-green-300 p-4 rounded mb-4">
          <p className="font-medium text-green-700">Aturan Absensi Saat Ini</p>
          <div className="mt-2 grid grid-cols-2 md:grid-cols-5 gap-2 text-sm">
            <div>
              <span className="text-gray-600">Lokasi:</span>
              <p
                className="font-medium truncate"
                title={`${attendanceRule.officeLatitude.toFixed(
                  6
                )}, ${attendanceRule.officeLongitude.toFixed(6)}`}
              >
                {attendanceRule.officeLatitude.toFixed(6)},{" "}
                {attendanceRule.officeLongitude.toFixed(6)}
              </p>
            </div>
            <div>
              <span className="text-gray-600">Radius:</span>
              <p className="font-medium">{attendanceRule.radiusMeters} m</p>
            </div>
            <div>
              <span className="text-gray-600">Maks. Terlambat:</span>
              <p className="font-medium">{attendanceRule.maxLateMinutes} mnt</p>
            </div>
            <div>
              <span className="text-gray-600">Maks. Check-in:</span>
              <p className="font-medium">{attendanceRule.maxLateCheckIn} mnt</p>
            </div>
            <div>
              <span className="text-gray-600">Maks. Check-out:</span>
              <p className="font-medium">
                {attendanceRule.maxLateCheckOut} mnt
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-red-50 border border-red-300 p-4 rounded mb-4">
          <p className="font-medium text-red-700">
            Aturan Absensi Belum Dibuat
          </p>
          <p className="text-sm text-red-600">
            Silakan buat aturan absensi di Pengaturan.
          </p>
        </div>
      )}
      {/* Button Assign */}
      <div className="mt-4 mb-4">
        <Button
          className="w-full sm:w-auto"
          label="Assign Karyawan ke Shift"
          bgColor="#10b981"
          onClick={() => setAssignOpen(true)}
        />
      </div>
      {/* Modal Create / Edit Shift */}
      {modalOpen && (
        <ModalForm<ShiftRequest>
          title={editingShift ? "Edit Shift" : "Buat Shift Baru"}
          initialValues={shiftInitialValues}
          onSubmit={handleSubmitShift}
          onClose={() => {
            setModalOpen(false);
            setEditingShift(null);
          }}
        >
          {(values, setValues) => (
            <ShiftForm
              values={values}
              setValues={setValues}
              workDays={workDaysList?.data ?? []}
            />
          )}
        </ModalForm>
      )}
      
      {assignOpen && (
        <AssignForm
          open={assignOpen}
          onClose={() => setAssignOpen(false)}
          shifts={{
            count: shifts.length,
            data: shifts,
          }}
          employeesWithShift={
            employeeData?.data
              ?.filter((emp) => emp.status === "active" || "Active") // Hanya karyawan aktif
              .map((emp) => {
                // Cari assignment untuk employee ini
                const assignment = assignments.find(
                  (a) => a.employeeId === emp.id && a.isActive
                );

                return {
                  id: emp.id,
                  fullName: emp.fullName,
                  shift: assignment
                    ? {
                        id: assignment.id,
                        employeeId: assignment.employeeId,
                        shiftId: assignment.shiftId,
                        employeeName: assignment.employeeName,
                        employeePicture: assignment.employeePicture,
                        shiftName: assignment.shiftName,
                        isActive: assignment.isActive,
                        createdAt: assignment.createdAt,
                        updatedAt: assignment.updatedAt,
                      }
                    : null,
                  active: emp.status === "active",
                };
              }) ?? []
          }
          initialValues={assignInitialValues}
          onSuccess={() => {
            setAssignOpen(false);
            showAlert(
              "success",
              "Berhasil!",
              "Karyawan berhasil di-assign ke shift!"
            );
            dispatch(fetchAssignmentsThunk());
            dispatch(fetchEmployee()); // Refresh employee data juga
          }}
          onError={(message) => {
            showAlert("error", "Gagal!", message);
          }}
        />
      )}
      {/* Shift Table */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Daftar Shift</h2>
          <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
            {shifts.length} Shift
          </span>
        </div>

        <ShiftSection
          shifts={shifts}
          assignments={assignments}
          onDeleteShift={handleDelete}
          onRemoveEmployee={handleRemoveEmployee}
          onSwitchShift={handleSwitch}
        />
      </div>
    </div>
  );
};

export default ShiftPage;
