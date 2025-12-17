import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store";

import {
  attendanceCheckInThunk,
  attendanceCheckOutThunk,
  getAttendanceHistoryThunk,
  fetchEmployeeActiveShift,
  getAttendanceDataThunk,
} from "../../store/slices/attendanceSlice";

import AttendanceForm from "../../components/form/AttendanceForm";
import Table, { renderDate } from "../../components/table/TableData";
import { AttendanceInfo } from "../../service/attendanceService";
import {
  parseBackendDate,
} from "../../utils/dateTimeHelper";

const AttendancePage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  // ==========================
  // AUTH DATA
  // ==========================
  const { userInfo } = useSelector((state: RootState) => state.auth);
  const employeeId = userInfo?.employeeId ?? null;
  const employeeName = userInfo?.name ?? "Unknown";

  // ==========================
  // ATTENDANCE STATE
  // ==========================
  const { history, lastCreated, loading, error, activeShift } = useSelector(
    (state: RootState) => state.attendance
  );

  const shift = activeShift?.shift ?? null;
  const shiftId = shift?.id ?? null;
  const shiftName = shift?.shiftName ?? "-";

  // ==========================
  // EFFECTS
  // ==========================
  useEffect(() => {
    if (!employeeId) return;
    dispatch(getAttendanceHistoryThunk(employeeId));
  }, [dispatch, employeeId, lastCreated]);

  useEffect(() => {
    if (!employeeId) return;
    dispatch(fetchEmployeeActiveShift());
  }, [dispatch, employeeId]);

  // ==========================
  // TODAY ATTENDANCE
  // ==========================
  const todayAttendance = history?.data?.find((att: AttendanceInfo) => {
    const attDate = parseBackendDate(att.date);
    if (!attDate) return false;

    const today = new Date();
    return (
      attDate.getFullYear() === today.getFullYear() &&
      attDate.getMonth() === today.getMonth() &&
      attDate.getDate() === today.getDate()
    );
  });

  useEffect(() => {
    dispatch(getAttendanceDataThunk());
  }, [dispatch]);

  // ==========================
  // TABLE COLUMNS
  // ==========================
  const columns = [
    {
      header: "Nama Pegawai",
      accessor: "employeeName" as keyof AttendanceInfo,
    },
    {
      header: "Tanggal",
      accessor: "date" as keyof AttendanceInfo,
      render: (value: string) => renderDate(value, "short"),
    },
    {
      header: "Check In",
      accessor: "checkInTime" as keyof AttendanceInfo,
      render: (value?: string) => (value ? value.slice(0, 5) : "-"),
    },
    {
      header: "Status Check In",
      accessor: "checkInNote" as keyof AttendanceInfo,
      render: (value?: string) => value ?? "-",
    },
    {
      header: "Check Out",
      accessor: "checkOutTime" as keyof AttendanceInfo,
      render: (value?: string) => (value ? value.slice(0, 5) : "-"),
    },
    {
      header: "Status Check Out",
      accessor: "checkOutNote" as keyof AttendanceInfo,
      render: (value?: string) => value ?? "-",
    },
    {
      header: "Durasi Kerja",
      accessor: "workDuration" as keyof AttendanceInfo,
      render: (value?: string) => value ?? "-",
    },
  ];

  if (!employeeId) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Attendance</h1>
        <div className="p-4 bg-red-50 border rounded text-red-600">
          Tidak dapat menemukan employeeId dari akun ini.
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-bold">Absensi</h1>
        <p className="text-gray-600">
          Welcome, <span className="font-semibold">{employeeName}</span>
        </p>
        {shiftId ? (
          <p className="text-sm text-gray-500">
            Shift Aktif: <span className="font-medium">{shiftName}</span>
          </p>
        ) : (
          <p className="text-sm text-red-500">Tidak ada shift aktif hari ini</p>
        )}
      </div>

      {/* ATTENDANCE FORM */}
      {shiftId ? (
        <AttendanceForm
          employeeId={employeeId}
          shiftId={shiftId}
          shiftName={shiftName}
          lastAttendanceToday={todayAttendance}
        />
      ) : (
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded text-yellow-700">
          Anda tidak dapat melakukan absensi karena tidak memiliki shift aktif
          hari ini.
        </div>
      )}

      {/* HISTORY */}
      <Table
        columns={columns}
        data={history?.data || []}
        emptyMessage={
          loading ? "Memuat data absensi..." : "Belum ada riwayat absensi"
        }
      />
    </div>
  );
};

export default AttendancePage;
