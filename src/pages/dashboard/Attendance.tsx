// src/pages/attendance/AttendancePage.tsx
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store";
import {
  createAttendanceThunk,
  getAttendanceHistoryThunk,
} from "../../store/slices/attendanceSlice";
import AttendanceForm from "../../components/form/AttendanceForm";
import Table, { Column } from "../../components/table/TableData";

const AttendancePage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  const { userInfo } = useSelector((state: RootState) => state.auth);

  const attendanceState = useSelector((state: RootState) => state.attendance);
  const { history, lastCreated, loading, error } = attendanceState;

  const employeeId = userInfo?.employeeId ?? null;
  const employeeName = userInfo?.name ?? "Unknown";
  const shiftId = userInfo?.shiftId ?? null; 

  // Load attendance history
  useEffect(() => {
    if (!employeeId) return;
    dispatch(getAttendanceHistoryThunk(employeeId));
  }, [dispatch, employeeId, lastCreated]);

  // Find today's attendance
  const getTodayAttendance = () => {
    if (!history?.data) return null;
    
    const today = new Date().toISOString().split('T')[0]; // Format YYYY-MM-DD
    
    return history.data.find(att => {
      const attendanceDate = att.date.split('T')[0]; // Adjust based on your date format
      return attendanceDate === today;
    });
  };

  const todayAttendance = getTodayAttendance();
  const lastAttendanceToday = todayAttendance?.status;

  // Handle form submission
  const handleSubmit = async (payload: any) => {
    if (!employeeId) {
      alert("Employee tidak ditemukan");
      return;
    }

    // Tambahkan shiftId jika ada
    const finalPayload = {
      ...payload,
      employeeId,
      shiftId: shiftId || undefined, // Kirim shiftId jika ada
    };

    await dispatch(createAttendanceThunk(finalPayload));
  };

  // Format columns untuk table
  const columns: Column<any>[] = [
    { 
      header: "Tanggal", 
      accessor: "date",
      render: (value) => {
        if (!value) return "-";
        const date = new Date(value);
        return date.toLocaleDateString('id-ID', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });
      }
    },
    { 
      header: "Shift", 
      accessor: "shiftName" 
    },
    { 
      header: "Check In", 
      accessor: "checkInTime",
      render: (value) => value || "-"
    },
    { 
      header: "Check Out", 
      accessor: "checkOutTime",
      render: (value) => value || "-"
    },
    { 
      header: "Status", 
      accessor: "status",
      render: (value) => {
        const statusMap: Record<string, { label: string, color: string }> = {
          "CHECK_IN": { label: "Check In", color: "bg-blue-100 text-blue-800" },
          "CHECK_OUT": { label: "Check Out", color: "bg-green-100 text-green-800" },
          "LATE": { label: "Terlambat", color: "bg-yellow-100 text-yellow-800" },
          "ABSENT": { label: "Absen", color: "bg-red-100 text-red-800" },
          "OVERTIME": { label: "Lembur", color: "bg-purple-100 text-purple-800" },
        };
        
        const status = statusMap[value] || { label: value, color: "bg-gray-100 text-gray-800" };
        
        return (
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${status.color}`}>
            {status.label}
          </span>
        );
      }
    },
    { 
      header: "Keterangan", 
      accessor: "notes",
      render: (value) => value || "-"
    },
  ];

  if (!employeeId) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Attendance</h1>
        <div className="p-4 border rounded bg-red-50 text-red-600">
          Tidak dapat menemukan employeeId dari akun ini.
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Absensi</h1>
        <p className="text-gray-600 mt-1">
          Welcome, <span className="font-semibold">{employeeName}</span>
        </p>
        {shiftId && (
          <p className="text-sm text-gray-500">
            Shift ID: {shiftId}
          </p>
        )}
      </div>

      {/* Attendance Form */}
      <AttendanceForm
        employeeId={employeeId}
        shiftId={shiftId}
        lastAttendanceToday={lastAttendanceToday}
        todayAttendance={todayAttendance}
        onSubmit={handleSubmit}
      />

      {/* Error Message */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
          {error}
        </div>
      )}

      {/* Today's Summary */}
      {todayAttendance && (
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="font-semibold text-blue-900 mb-2">Ringkasan Hari Ini</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-blue-600">Check In</p>
              <p className="font-medium">{todayAttendance.checkInTime || "-"}</p>
            </div>
            <div>
              <p className="text-sm text-blue-600">Check Out</p>
              <p className="font-medium">{todayAttendance.checkOutTime || "-"}</p>
            </div>
            <div>
              <p className="text-sm text-blue-600">Status</p>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                todayAttendance.status === "CHECK_IN" 
                  ? "bg-blue-100 text-blue-800" 
                  : "bg-green-100 text-green-800"
              }`}>
                {todayAttendance.status === "CHECK_IN" ? "Masuk" : "Pulang"}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Attendance History */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">Riwayat Absensi</h2>
          {history?.count && (
            <p className="text-sm text-gray-500">
              Total: {history.count} hari
            </p>
          )}
        </div>
        
        <Table
          columns={columns}
          data={history?.data || []}
          emptyMessage={
            loading 
              ? "Memuat data absensi..." 
              : "Belum ada riwayat absensi"
          }
          // loading={loading}
        />
      </div>
    </div>
  );
};

export default AttendancePage;