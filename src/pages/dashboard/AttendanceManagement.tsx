import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store";
import { getAttendanceDataThunk } from "../../store/slices/attendanceSlice";
import Table, { Column } from "../../components/table/TableData";

const AttendanceManagementPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { list, loading } = useSelector((s: RootState) => s.attendance);

  useEffect(() => {
    dispatch(getAttendanceDataThunk());
  }, [dispatch]);

  // ================================
  // TABLE COLUMNS
  // ================================
  const columns: Column<any>[] = [
    { header: "Nama Pegawai", accessor: "employeeName" },
    { header: "Tanggal", accessor: "date" },
    { header: "Check In", accessor: "checkInTime" },
    { header: "Check Out", accessor: "checkOutTime" },
    { header: "Status", accessor: "status" },
  ];
  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold">Attendance Management</h1>

      {loading && <p>Loading...</p>}

      <Table
        columns={columns}
        data={list?.data ?? []}
        emptyMessage="No attendance records found"
      />
    </div>
  );
};

export default AttendanceManagementPage;
