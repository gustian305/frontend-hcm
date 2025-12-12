// src/pages/workLeave/WorkLeaveManagementPage.tsx
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store";

import Table, { Column } from "../../components/table/TableData";
import ModalDetail from "../../components/modal/DetailModal";

import {
  fetchDataWorkLeave,
  fetchWorkLeaveDetail,
  approveOrRejectWorkLeave,
} from "../../store/slices/workLeaveSlice";

const WorkLeaveManagementPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  const { dataWorkLeave, detail, loading } = useSelector(
    (state: RootState) => state.workLeave
  );

  const [openDetail, setOpenDetail] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchDataWorkLeave());
  }, [dispatch]);

  const handleOpenDetail = async (id: string) => {
    setSelectedId(id);
    try {
      await dispatch(fetchWorkLeaveDetail(id)).unwrap();
      setOpenDetail(true);
    } catch {
      alert("Gagal mengambil detail work leave");
    }
  };

  const handleApproveReject = async (status: "approved" | "rejected") => {
    if (!selectedId) return;

    try {
      await dispatch(
        approveOrRejectWorkLeave({ workLeaveId: selectedId, status })
      ).unwrap();

      await dispatch(fetchDataWorkLeave()).unwrap();
      setOpenDetail(false);
      setSelectedId(null);
    } catch (err: any) {
      alert(err?.message || "Gagal update status");
    }
  };

  const columns: Column<any>[] = [
    {
      header: "Pegawai",
      accessor: (row) => row.employeeName || "-",
    },
    {
      header: "Tipe cuti",
      accessor: (row) => row.leaveType || "-",
    },
    {
      header: "Mulai cuti",
      accessor: (row) =>
        row.startDate ? String(row.startDate).split("T")[0] : "-",
    },
    {
      header: "Selesai cuti",
      accessor: (row) =>
        row.endDate ? String(row.endDate).split("T")[0] : "-",
    },
    {
      header: "Status",
      accessor: (row) => (
        <span
          className={`px-2 py-1 rounded-md text-xs font-semibold ${
            row.status === "approved"
              ? "bg-green-100 text-green-700"
              : row.status === "rejected"
              ? "bg-red-100 text-red-700"
              : "bg-yellow-100 text-yellow-700"
          }`}
        >
          {row.status || "-"}
        </span>
      ),
    },
  ];

  const tableData = dataWorkLeave?.data ?? [];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Work Leave Management</h1>

      <Table
        columns={columns}
        data={tableData}
        emptyMessage="No work leave submissions"
        actions={(row) => (
          <button
            onClick={() => handleOpenDetail(row.id)}
            className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-500"
          >
            Detail
          </button>
        )}
      />

      <ModalDetail
        title="Work Leave Detail"
        open={openDetail}
        onClose={() => {
          setOpenDetail(false);
          setSelectedId(null);
        }}
        data={detail}
        width="md:w-2/5"
        fields={[
          { key: "employeeName", label: "Employee" },
          { key: "leaveType", label: "Leave Type" },
          {
            key: "startDate",
            label: "Start Date",
            render: (v) => (v ? String(v).split("T")[0] : "-"),
          },
          {
            key: "endDate",
            label: "End Date",
            render: (v) => (v ? String(v).split("T")[0] : "-"),
          },
          { key: "reason", label: "Reason" },

          // FIXED: fileUrl -> files
          {
            key: "files",
            label: "Attachment",
            render: (v) =>
              v ? (
                <a
                  href={v}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline hover:text-blue-800"
                >
                  Download File
                </a>
              ) : (
                "-"
              ),
          },

          {
            key: "status",
            label: "Status",
            render: (v) => (
              <span
                className={`px-2 py-1 rounded-md text-xs font-semibold ${
                  v === "approved"
                    ? "bg-green-100 text-green-700"
                    : v === "rejected"
                    ? "bg-red-100 text-red-700"
                    : "bg-yellow-100 text-yellow-700"
                }`}
              >
                {v || "-"}
              </span>
            ),
          },
        ]}
      >
        {/* CUSTOM FOOTER BUTTON */}
        {detail && (
          <div className="flex justify-center gap-3 mt-6">
            <button
              disabled={loading}
              onClick={() => handleApproveReject("approved")}
              className="px-5 py-2 bg-green-600 text-white rounded-md shadow hover:bg-green-500"
            >
              Approve
            </button>

            <button
              disabled={loading}
              onClick={() => handleApproveReject("rejected")}
              className="px-5 py-2 bg-red-600 text-white rounded-md shadow hover:bg-red-500"
            >
              Reject
            </button>
          </div>
        )}
      </ModalDetail>
    </div>
  );
};

export default WorkLeaveManagementPage;
