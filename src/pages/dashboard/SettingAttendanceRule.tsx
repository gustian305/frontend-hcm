// src/pages/setting/SettingAttendancePage.tsx
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../../store";

import AttendanceRuleForm from "../../components/form/AttendanceRuleForm";
import Button from "../../components/button/Button";
import { AttendanceRuleRequest } from "../../service/attendanceRuleService";
import {
  createAttendanceRuleThunk,
  fetchAttendanceRuleThunk,
  updateAttendanceRuleThunk,
} from "../../store/slices/attendanceRuleSlice";
import ModalAlert from "../../components/modal/AlertModal";

const SettingAttendancePage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { attendanceRule, loading, error } = useSelector(
    (state: RootState) => state.attendanceRule
  );

  const [formValues, setFormValues] = useState<AttendanceRuleRequest>({
    officeLatitude: 0,
    officeLongitude: 0,
    radiusMeters: 0,
    maxLateMinutes: 0,
    maxLateCheckIn: 0,
    maxLateCheckOut: 0,
  });

  const [initialized, setInitialized] = useState(false);
  const [alert, setAlert] = useState({
    open: false,
    type: "success" as "success" | "error" | "confirm",
    message: "",
  });

  useEffect(() => {
    dispatch(fetchAttendanceRuleThunk());
  }, [dispatch]);

  // Hanya set formValues sekali dari data backend
  useEffect(() => {
    if (!attendanceRule || initialized) return;

    setFormValues({
      officeLatitude: attendanceRule.officeLatitude,
      officeLongitude: attendanceRule.officeLongitude,
      radiusMeters: attendanceRule.radiusMeters,
      maxLateMinutes: attendanceRule.maxLateMinutes,
      maxLateCheckIn: attendanceRule.maxLateCheckIn,
      maxLateCheckOut: attendanceRule.maxLateCheckOut,
    });

    setInitialized(true);
  }, [attendanceRule, initialized]);

  // Tampilkan error dari Redux jika ada
  useEffect(() => {
    if (error) {
      setAlert({
        open: true,
        type: "error",
        message: error,
      });
    }
  }, [error]);

  const handleSubmit = async () => {
    try {
      if (attendanceRule) {
        await dispatch(
          updateAttendanceRuleThunk({
            id: attendanceRule.id,
            payload: formValues,
          })
        ).unwrap();
        
        // Tampilkan pesan sukses
        setAlert({
          open: true,
          type: "success",
          message: "Attendance Rule berhasil diperbarui!",
        });
        
        // Refresh data setelah update
        dispatch(fetchAttendanceRuleThunk());
        
      } else {
        await dispatch(createAttendanceRuleThunk(formValues)).unwrap();
        
        // Tampilkan pesan sukses
        setAlert({
          open: true,
          type: "success",
          message: "Attendance Rule berhasil dibuat!",
        });
        
        // Refresh data setelah create
        dispatch(fetchAttendanceRuleThunk());
      }
      
      // Reset initialized flag agar form bisa diisi ulang dengan data baru
      setInitialized(false);
      
    } catch (err: any) {
      // Tampilkan pesan error
      setAlert({
        open: true,
        type: "error",
        message: err?.message || "Gagal menyimpan attendance rule",
      });
    }
  };

  const closeAlert = () => {
    setAlert(prev => ({ ...prev, open: false }));
  };

  return (
    <div className="p-5">
      <h1 className="text-2xl font-bold mb-4">Aturan Absensi</h1>
      
      {/* Modal Alert */}
      <ModalAlert
        open={alert.open}
        type={alert.type}
        message={alert.message}
        onClose={closeAlert}
      />
      
      {loading && <p className="text-gray-500 mb-3">Loading...</p>}

      {attendanceRule ? (
        <div className="bg-green-50 border border-green-300 p-4 rounded mb-4">
          <p className="font-medium text-green-700">Aturan Absensi Telah Dibuat</p>
        </div>
      ) : (
        <div className="bg-red-50 border border-red-300 p-4 rounded mb-4">
          <p className="font-medium text-red-700">Aturan Absensi Belum Dibuat</p>
          <p className="text-sm text-red-600">Silakan buat aturan absensi di bawah ini.</p>
        </div>
      )}

      <div className="bg-white border border-gray-200 p-4 rounded shadow-sm">
        <AttendanceRuleForm values={formValues} setValues={setFormValues} />

        <Button
          className="flex items-center justify-center mt-4 px-6 py-3 rounded-lg text-white hover:opacity-90 transition font-medium w-full sm:w-auto"
          bgColor="#189AB4"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Memproses...
            </span>
          ) : attendanceRule ? (
            "Perbarui Aturan Absensi"
          ) : (
            "Buat Aturan Absensi Baru"
          )}
        </Button>
      </div>
    </div>
  );
};

export default SettingAttendancePage;