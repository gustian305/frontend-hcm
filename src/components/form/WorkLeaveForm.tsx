// src/components/form/WorkLeaveForm.tsx
import React, { useState } from "react";
import { AppDispatch } from "../../store";
import { useDispatch, useSelector } from "react-redux";
import { createWorkLeave, fetchWorkLeaveHistory } from "../../store/slices/workLeaveSlice";
import { CreateWorkLeaveRequest } from "../../service/workLeaveService";
import { RootState } from "../../store";

interface Props {
  employeeId: string;
}

const WorkLeaveForm: React.FC<Props> = ({ employeeId }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error, createLeave } = useSelector(
    (state: RootState) => state.workLeave
  );

  const [leaveType, setLeaveType] = useState("");
  const [reason, setReason] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload: CreateWorkLeaveRequest = {
      leaveType,
      reason,
      startDate,
      endDate,
      file,
    };

    const result = await dispatch(createWorkLeave({ employeeId, payload }));

    if (createWorkLeave.fulfilled.match(result)) {
      // reload history otomatis
      dispatch(fetchWorkLeaveHistory(employeeId));

      // Reset form jika berhasil
      setLeaveType("");
      setReason("");
      setStartDate("");
      setEndDate("");
      setFile(null);
    }
  };

  return (
    <div className="p-6 border bg-white rounded shadow-md">
      <h2 className="text-xl font-semibold mb-4">Create Work Leave</h2>

      {error && (
        <div className="mb-4 p-2 bg-red-50 text-red-600 rounded">{error}</div>
      )}

      {createLeave && (
        <div className="mb-4 p-2 bg-green-50 text-green-600 rounded">
          Work leave created successfully!
        </div>
      )}

      <form onSubmit={handleSubmit} className="p-4 space-y-4">
        <div>
          <label className="block font-medium mb-1">Jenis Cuti</label>
          <select
            value={leaveType}
            onChange={(e) => setLeaveType(e.target.value)}
            className="border rounded p-2 w-full"
            required
          >
            <option value="">Pilih jenis cuti</option>
            <option value="Cuti Hamil dan Melahirkan">Cuti Hamil dan Melahirkan</option>
            <option value="Cuti dengan Alasan Penting">Cuti dengan Alasan Penting</option>
            <option value="Cuti Menikah">Cuti Menikah</option>
            <option value="Cuti Sakit">Cuti Sakit</option>
            <option value="Cuti Tahunan">Cuti Tahunan</option>
          </select>
        </div>

        <div>
          <label className="block font-medium mb-1">Alasan</label>
          <input
            type="text"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="border rounded p-2 w-full"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-medium mb-1">Waktu Mulai Cuti</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="border rounded p-2 w-full"
              required
            />
          </div>
          <div>
            <label className="block font-medium mb-1">Waktu Akhir Cuti</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="border rounded p-2 w-full"
              required
            />
          </div>
        </div>

        <div>
          <label className="block font-medium mb-1">File Pendukung</label>
          <input
            type="file"
            onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
            className="border rounded p-2 w-full"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Submitting..." : "Submit"}
        </button>
      </form>
    </div>
  );
};

export default WorkLeaveForm;
