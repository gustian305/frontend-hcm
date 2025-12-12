import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store";
import LeaveBalanceComponent from "../../components/LeaveBalanceComponent";
import WorkLeaveForm from "../../components/form/WorkLeaveForm";
import Table, { Column } from "../../components/table/TableData";
import {
  fetchLeaveBalance,
  fetchWorkLeaveHistory,
} from "../../store/slices/workLeaveSlice";
import { WorkLeavePayload } from "../../service/workLeaveService";

const WorkLeavePage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { userInfo } = useSelector((state: RootState) => state.auth);
  const employeeId = userInfo?.employeeId ?? null;

  const { workLeaveHistory, loading, error } = useSelector(
    (state: RootState) => state.workLeave
  );

  useEffect(() => {
    if (!employeeId) return;
    dispatch(fetchLeaveBalance(employeeId));
    dispatch(fetchWorkLeaveHistory(employeeId));
  }, [dispatch, employeeId]);

  if (!employeeId) {
    return (
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Work Leave Balance</h1>
        <div className="p-4 border rounded bg-red-50 text-red-600">
          Tidak dapat menemukan employeeId dari akun ini.
        </div>
      </div>
    );
  }

  // ============================
  // Columns untuk tabel history
  // ============================
  const columns: Column<WorkLeavePayload>[] = [
    { header: "Leave Type", accessor: "leaveType" },
    { header: "Start Date", accessor: "startDate" },
    { header: "End Date", accessor: "endDate" },
    { header: "Total Day", accessor: "totalDay" },
    { header: "Reason", accessor: "reason" },
    { header: "Status", accessor: "status" },
  ];

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">My Leave Balance</h1>
      <LeaveBalanceComponent employeeId={employeeId} />

      <WorkLeaveForm employeeId={employeeId} />

      <div className="pt-6">
        <h2 className="text-xl font-semibold mb-4">Work Leave History</h2>

        {loading && (
          <div className="p-4 border rounded bg-yellow-50 text-yellow-700">
            Loading history...
          </div>
        )}

        {error && (
          <div className="p-4 border rounded bg-red-50 text-red-700">
            {error}
          </div>
        )}

        {(workLeaveHistory?.data ?? []).length > 0 ? (
          <Table columns={columns} data={workLeaveHistory?.data ?? []} />
        ) : (
          !loading &&
          !error && (
            <div className="p-4 border rounded bg-gray-50 text-gray-600 text-center">
              Tidak ada riwayat cuti.
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default WorkLeavePage;
