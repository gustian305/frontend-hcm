import React, { useState, useMemo, useEffect } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../store";
import { AssignShiftRequest, AssignShiftInfo } from "../../service/assignShift";
import {
  assignShiftThunk,
  fetchAssignmentsThunk,
} from "../../store/slices/assignShiftSlice";
import ModalForm from "../../components/modal/FormModal";
import { DataShift } from "../../service/shiftService";

interface AssignFormProps {
  open: boolean;
  onClose: () => void;
  shifts: DataShift;
  employeesWithShift: {
    id: string;
    fullName: string;
    shift?: AssignShiftInfo | null;
    active?: boolean;
  }[];
  initialValues: AssignShiftRequest;
  title?: string;
  onSuccess?: () => void;
  onError?: (message: string) => void;
}

const AssignForm: React.FC<AssignFormProps> = ({
  open,
  onClose,
  shifts,
  employeesWithShift,
  initialValues,
  title = "Assign Shift",
  onSuccess,
  onError,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState("");
  const [searchShift, setSearchShift] = useState("");

  useEffect(() => {
    if (open) {
      setSearch("");
      setSearchShift("");
      dispatch(fetchAssignmentsThunk());
    }
  }, [open, dispatch]);


  

  // Validation FOR ModalForm
  const validate = (values: AssignShiftRequest) => {
    const errors: Record<keyof AssignShiftRequest, string> = {
      shiftId: "",
      employeeIDs: ""
    };
    
    if (!values.shiftId) {
      errors.shiftId = "Shift harus dipilih";
    }
    
    if (!values.employeeIDs || values.employeeIDs.length === 0) {
      errors.employeeIDs = "Pilih minimal 1 pegawai";
    }
    
    return errors;
  };

  const handleSubmit = async (vals: AssignShiftRequest) => {
    setLoading(true);
    try {
      // Validasi sebelum submit
      const errors = validate(vals);
      if (errors.shiftId || errors.employeeIDs) {
        onError?.("Harap lengkapi semua field yang diperlukan");
        return;
      }

      await dispatch(assignShiftThunk(vals)).unwrap();
      await dispatch(fetchAssignmentsThunk());
      
      // Reset form values
      setSearch("");
      setSearchShift("");
      
      // Panggil callback success
      onSuccess?.();
      
    } catch (err: any) {
      // Panggil callback error
      onError?.(err?.message || "Gagal meng-assign shift");
    } finally {
      setLoading(false);
    }
  };

  // Pegawai yang belum memiliki shift DAN aktif
  const availableEmployees = useMemo(
    () => employeesWithShift.filter((e) => e.active !== false && !e.shift),
    [employeesWithShift]
  );

  const filteredEmployees = useMemo(
    () =>
      availableEmployees.filter((emp) =>
        emp.fullName.toLowerCase().includes(search.toLowerCase())
      ),

    [availableEmployees, search]
  );

  const filteredShifts = useMemo(
    () =>
      shifts.data.filter((shift) =>
        shift.shiftName.toLowerCase().includes(searchShift.toLowerCase())
      ),
    [shifts, searchShift]
  );

  const totalAvailable = availableEmployees.length;

  return (
    <ModalForm<AssignShiftRequest>
      title={title}
      onSubmit={handleSubmit}
      onClose={onClose}
      initialValues={initialValues}
      validate={validate}
      submitLabel={loading ? "Memproses..." : "Assign"}
      showSuccess={false} // Karena kita handle success di parent
      successMessage=""
      // disabled={loading}
    >
      {(values, setValues, errors) => (
        <div className="flex flex-col gap-6">
          {/* SHIFT SELECTION */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block font-medium text-gray-700">
                Pilih Shift
              </label>
              {errors.shiftId && (
                <span className="text-sm text-red-600">{errors.shiftId}</span>
              )}
            </div>

            <input
              type="text"
              placeholder="Cari shift..."
              className="w-full mb-3 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={searchShift}
              onChange={(e) => setSearchShift(e.target.value)}
            />

            <select
              className={`w-full border rounded-lg px-4 py-2.5 text-sm bg-white focus:ring-2 focus:ring-blue-500 ${
                errors.shiftId ? "border-red-500" : "border-gray-300"
              }`}
              value={values.shiftId}
              onChange={(e) =>
                setValues({ ...values, shiftId: e.target.value })
              }
              disabled={loading}
            >
              <option value="">Pilih Shift</option>
              {filteredShifts.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.shiftName} • {s.shiftStartTime} - {s.shiftEndTime}{" "}
                  {s.isNightShift ? "(Night)" : ""}
                  {!s.isActive ? " (Tidak Aktif)" : ""}
                </option>
              ))}
            </select>
          </div>

          {/* EMPLOYEE LIST */}
          <div>
            <div className="flex justify-between items-center mb-3">
              <div>
                <label className="block font-medium text-gray-700">
                  Pilih Pegawai
                </label>
                {errors.employeeIDs && (
                  <span className="text-sm text-red-600">{errors.employeeIDs}</span>
                )}
              </div>
              <span className="text-sm px-3 py-1.5 rounded-full font-medium text-blue-700 bg-blue-100 border border-blue-200">
                Tersedia: {totalAvailable}
              </span>
            </div>

            <div className="mb-3 relative">
              <input
                type="text"
                placeholder="Cari pegawai..."
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 pl-10 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                disabled={loading}
              />
              <svg
                className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>

            <div className="border border-gray-200 rounded-lg bg-white overflow-hidden">
              {filteredEmployees.length === 0 ? (
                <div className="p-6 text-center text-gray-500">
                  <svg
                    className="w-8 h-8 mx-auto mb-2 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                    />
                  </svg>
                  <p>Tidak ada karyawan yang tersedia</p>
                  <p className="text-sm mt-1">
                    Semua karyawan sudah memiliki shift atau tidak aktif
                  </p>
                </div>
              ) : (
                <div className="max-h-80 overflow-y-auto p-1">
                  {filteredEmployees.map((emp) => {
                    const isChecked = values.employeeIDs.includes(emp.id);

                    return (
                      <div
                        key={emp.id}
                        className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition ${
                          isChecked
                            ? "bg-blue-50 border border-blue-200"
                            : "hover:bg-gray-50 border border-transparent"
                        } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                        onClick={() => {
                          if (loading) return;
                          const newIDs = isChecked
                            ? values.employeeIDs.filter((id) => id !== emp.id)
                            : [...values.employeeIDs, emp.id];

                          setValues({ ...values, employeeIDs: newIDs });
                        }}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${
                              isChecked
                                ? "bg-blue-600 text-white"
                                : "bg-gray-200 text-gray-700"
                            }`}
                          >
                            {emp.fullName.charAt(0)}
                          </div>
                          <div>
                            <span className="text-sm font-medium text-gray-700 block">
                              {emp.fullName}
                            </span>
                          </div>
                        </div>

                        <input
                          type="checkbox"
                          checked={isChecked}
                          readOnly
                          disabled={loading}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {values.employeeIDs.length > 0 && (
              <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm text-green-700 font-medium">
                  <span className="font-bold">{values.employeeIDs.length}</span> karyawan dipilih
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </ModalForm>
  );
};

export default AssignForm;