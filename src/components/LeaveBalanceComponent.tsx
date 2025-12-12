import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store";
import { fetchLeaveBalance } from "../store/slices/workLeaveSlice";

const LeaveBalanceComponent = ({ employeeId }: { employeeId: string }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { leaveBalance, loading, error } = useSelector(
    (state: RootState) => state.workLeave
  );

  useEffect(() => {
    if (employeeId) {
      dispatch(fetchLeaveBalance(employeeId));
    }
  }, [dispatch, employeeId]);

  if (loading)
    return (
      <div className="p-4 border rounded bg-yellow-50 text-yellow-700 text-center">
        Loading leave balance...
      </div>
    );

  if (error)
    return (
      <div className="p-4 border rounded bg-red-50 text-red-700 text-center">
        Error: {error}
      </div>
    );

  if (!leaveBalance)
    return (
      <div className="p-4 border rounded bg-gray-50 text-gray-600 text-center">
        Tidak ada data leave balance.
      </div>
    );

  return (
    <div className="grid grid-cols-2 gap-4 p-4 max-w-full">
      {/* Kiri: Max Quantity */}
      <div className="flex flex-col p-8 bg-white border rounded-lg shadow-lg">
        <span className="text-xl text-black mt-1">Tiket cuti tersedia</span>
        <span className="text-xl font-bold text-black">
          {leaveBalance.maxQuantity}
        </span>
      </div>

      {/* Tengah: Used */}
      <div className="flex flex-col p-8 bg-white border rounded-lg shadow-lg">
        <span className="text-xl text-black mt-1">Tiket yang digunakan</span>
        <span className="text-xl font-bold text-black">
          {leaveBalance.used}
        </span>
      </div>
    </div>
  );
};

export default LeaveBalanceComponent;
