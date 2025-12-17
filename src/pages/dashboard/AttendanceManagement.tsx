import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store";
import { getAttendanceDataThunk } from "../../store/slices/attendanceSlice";
import Table, { renderDate } from "../../components/table/TableData";
import { AttendanceInfo } from "../../service/attendanceService";

const AttendanceManagementPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { list, loading } = useSelector((s: RootState) => s.attendance);

  useEffect(() => {
    dispatch(getAttendanceDataThunk());
  }, [dispatch]);

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

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold">Attendance Management</h1>

      {loading && <p>Loading...</p>}

      <Table
        columns={columns}
        data={list?.data ?? []}
        emptyMessage="No attendance records found"
        loading={loading}
      />
    </div>
  );
};

export default AttendanceManagementPage;
