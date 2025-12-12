import React, { useState } from "react";
import { ShiftInfo } from "../../service/shiftService";
import {
  ChevronDown,
  ChevronUp,
  Users,
  Clock,
  Trash2,
  RefreshCw,
  Calendar,
  Sun,
  Moon,
  Check,
} from "lucide-react";
import { AssignShiftInfo, SwitchShiftRequest } from "../../service/assignShift";

interface Props {
  shifts: ShiftInfo[];
  assignments: AssignShiftInfo[];
  onDeleteShift?: (id: string) => void;
  onRemoveEmployee?: (shiftId: string, employeeId: string) => void;
  onSwitchShift?: (payload: SwitchShiftRequest) => void;
}

const ShiftSection: React.FC<Props> = ({
  shifts,
  assignments,
  onDeleteShift,
  onRemoveEmployee,
  onSwitchShift,
}) => {
  const [expandedShiftId, setExpandedShiftId] = React.useState<string | null>(
    null
  );
  const [switchModalOpen, setSwitchModalOpen] = useState(false);
  const [selectedShift, setSelectedShift] = useState<ShiftInfo | null>(null);
  const [selectedToShiftId, setSelectedToShiftId] = useState("");
  const [selectedEmployeeIds, setSelectedEmployeeIds] = useState<string[]>([]);

  const toggleExpand = (id: string) => {
    setExpandedShiftId(expandedShiftId === id ? null : id);
  };

  // Handle open switch modal
  const handleOpenSwitchModal = (shift: ShiftInfo) => {
    setSelectedShift(shift);
    setSelectedToShiftId("");
    setSelectedEmployeeIds([]);
    setSwitchModalOpen(true);
  };

  // Handle submit switch
  const handleSubmitSwitch = () => {
    if (!selectedShift || !selectedToShiftId || selectedEmployeeIds.length === 0) {
      return;
    }

    const payload: SwitchShiftRequest = {
      fromShiftID: selectedShift.id,
      toShiftID: selectedToShiftId,
      employeeIDs: selectedEmployeeIds,
    };

    onSwitchShift?.(payload);
    setSwitchModalOpen(false);
    setSelectedShift(null);
  };

  const getAvatarColor = (name: string) => {
    const colors = [
      "bg-blue-100 text-blue-600",
      "bg-green-100 text-green-600",
      "bg-purple-100 text-purple-600",
      "bg-pink-100 text-pink-600",
      "bg-amber-100 text-amber-600",
      "bg-indigo-100 text-indigo-600",
      "bg-cyan-100 text-cyan-600",
      "bg-emerald-100 text-emerald-600",
    ];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((w) => w[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();
  };

  // Format tanggal
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric"
    });
  };

  // Cek apakah shift aktif
  const isShiftActive = (shift: ShiftInfo) => {
    const today = new Date();
    const startDate = new Date(shift.dateStart);
    const endDate = new Date(shift.dateEnd);
    return today >= startDate && today <= endDate && shift.isActive;
  };

  // Get employees for a specific shift
  const getEmployeesForShift = (shiftId: string) => {
    return assignments.filter(a => a.shiftId === shiftId && a.isActive);
  };

  // Get available target shifts (exclude current shift)
  const getAvailableTargetShifts = (currentShiftId: string) => {
    return shifts.filter(shift => shift.id !== currentShiftId && shift.isActive);
  };

  return (
    <>
      {/* Switch Shift Modal */}
      {switchModalOpen && selectedShift && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-800">Switch Shift</h2>
                <button
                  onClick={() => setSwitchModalOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>

              {/* Current Shift Info */}
              <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h3 className="font-medium text-blue-800 mb-2">Dari Shift:</h3>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                    <Sun className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold">{selectedShift.shiftName}</h4>
                    <p className="text-sm text-gray-600">
                      {selectedShift.shiftStartTime} - {selectedShift.shiftEndTime}
                      {selectedShift.isNightShift && " (Night Shift)"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Target Shift Selection */}
              <div className="mb-6">
                <label className="block font-medium text-gray-700 mb-2">
                  Pilih Shift Tujuan
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-60 overflow-y-auto p-2">
                  {getAvailableTargetShifts(selectedShift.id).map((shift) => (
                    <div
                      key={shift.id}
                      className={`p-3 border rounded-lg cursor-pointer transition ${
                        selectedToShiftId === shift.id
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                      onClick={() => setSelectedToShiftId(shift.id)}
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex-shrink-0">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                            shift.isNightShift ? "bg-indigo-100" : "bg-green-100"
                          }`}>
                            {shift.isNightShift ? (
                              <Moon className="w-4 h-4 text-indigo-600" />
                            ) : (
                              <Sun className="w-4 h-4 text-green-600" />
                            )}
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium truncate">{shift.shiftName}</h4>
                          <p className="text-xs text-gray-500 truncate">
                            {shift.shiftStartTime} - {shift.shiftEndTime}
                          </p>
                        </div>
                        {selectedToShiftId === shift.id && (
                          <Check className="w-5 h-5 text-blue-600 flex-shrink-0" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Employee Selection */}
              <div className="mb-6">
                <label className="block font-medium text-gray-700 mb-2">
                  Pilih Karyawan yang Akan Dipindahkan
                </label>
                <div className="max-h-60 overflow-y-auto border border-gray-200 rounded-lg p-2">
                  {getEmployeesForShift(selectedShift.id).map((emp) => (
                    <div
                      key={emp.employeeId}
                      className={`flex items-center justify-between p-3 rounded-lg cursor-pointer mb-2 ${
                        selectedEmployeeIds.includes(emp.employeeId)
                          ? "bg-blue-50 border border-blue-200"
                          : "hover:bg-gray-50"
                      }`}
                      onClick={() => {
                        const newIds = selectedEmployeeIds.includes(emp.employeeId)
                          ? selectedEmployeeIds.filter(id => id !== emp.employeeId)
                          : [...selectedEmployeeIds, emp.employeeId];
                        setSelectedEmployeeIds(newIds);
                      }}
                    >
                      <div className="flex items-center gap-3">
                        {emp.employeePicture ? (
                          <img
                            src={emp.employeePicture}
                            alt={emp.employeeName}
                            className="w-10 h-10 rounded-full object-cover border"
                          />
                        ) : (
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm ${getAvatarColor(
                              emp.employeeName
                            )}`}
                          >
                            {getInitials(emp.employeeName)}
                          </div>
                        )}
                        <div>
                          <h5 className="font-medium text-gray-900">
                            {emp.employeeName}
                          </h5>
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        checked={selectedEmployeeIds.includes(emp.employeeId)}
                        readOnly
                        className="w-4 h-4 text-blue-600 rounded"
                      />
                    </div>
                  ))}
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  {selectedEmployeeIds.length} karyawan dipilih
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t">
                <button
                  onClick={() => setSwitchModalOpen(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 font-medium"
                >
                  Batal
                </button>
                <button
                  onClick={handleSubmitSwitch}
                  disabled={!selectedToShiftId || selectedEmployeeIds.length === 0}
                  className={`px-4 py-2 rounded-lg font-medium flex items-center gap-2 ${
                    !selectedToShiftId || selectedEmployeeIds.length === 0
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-blue-600 text-white hover:bg-blue-700"
                  }`}
                >
                  <RefreshCw className="w-4 h-4" />
                  Switch Shift
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Shift List */}
      <div className="space-y-4">
        {shifts.map((shift) => {
          const isExpanded = expandedShiftId === shift.id;
          const active = isShiftActive(shift);
          const employees = getEmployeesForShift(shift.id);
          const employeeCount = employees.length;

          return (
            <div
              key={shift.id}
              className={`bg-white rounded-xl border hover:shadow-md transition-all duration-300 overflow-hidden ${
                active 
                  ? "border-green-200 hover:border-green-300" 
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              {/* Header */}
              <div className="p-5">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-start gap-3 mb-2">
                      <div
                        className={`flex items-center justify-center w-10 h-10 rounded-lg ${
                          shift.isNightShift 
                            ? "bg-indigo-100 text-indigo-600" 
                            : active 
                              ? "bg-green-100 text-green-600"
                              : "bg-blue-100 text-blue-600"
                        }`}
                      >
                        {shift.isNightShift ? (
                          <Moon className="w-5 h-5" />
                        ) : (
                          <Sun className="w-5 h-5" />
                        )}
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {shift.shiftName}
                          </h3>
                          
                          {/* Status Badges */}
                          <div className="flex items-center gap-1">
                            {shift.isNightShift && (
                              <span className="px-2 py-0.5 rounded-full text-xs bg-indigo-100 text-indigo-800 font-medium">
                                Night Shift
                              </span>
                            )}
                            
                            {active ? (
                              <span className="px-2 py-0.5 rounded-full text-xs bg-green-100 text-green-800 font-medium">
                                Aktif
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded-full text-xs bg-gray-100 text-gray-800 font-medium">
                                Tidak Aktif
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Shift Details */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-2">
                          <div className="flex items-center gap-2 text-gray-600">
                            <Clock className="w-4 h-4 flex-shrink-0" />
                            <span className="text-sm">
                              <span className="font-medium">{shift.shiftStartTime}</span> -{" "}
                              <span className="font-medium">{shift.shiftEndTime}</span>
                            </span>
                          </div>

                          <div className="flex items-center gap-2 text-gray-600">
                            <Calendar className="w-4 h-4 flex-shrink-0" />
                            <span className="text-sm">
                              {formatDate(shift.dateStart)} - {formatDate(shift.dateEnd)}
                            </span>
                          </div>

                          <div className="flex items-center gap-2 text-gray-600">
                            <Users className="w-4 h-4 flex-shrink-0" />
                            <span className="text-sm">
                              <span className="font-medium">{employeeCount}</span> karyawan
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleExpand(shift.id)}
                      className={`p-2 rounded-lg transition ${
                        isExpanded
                          ? "bg-gray-100 text-gray-700"
                          : "text-gray-500 hover:bg-gray-100"
                      }`}
                      title={isExpanded ? "Sembunyikan detail" : "Tampilkan detail"}
                    >
                      {isExpanded ? (
                        <ChevronUp className="w-5 h-5" />
                      ) : (
                        <ChevronDown className="w-5 h-5" />
                      )}
                    </button>

                    {onSwitchShift && (
                      <button
                        onClick={() => handleOpenSwitchModal(shift)}
                        className="px-3 py-2 bg-purple-100 text-purple-700 rounded-lg text-sm hover:bg-purple-200 flex items-center gap-2 font-medium"
                        title="Switch shift"
                        disabled={employeeCount === 0}
                      >
                        <RefreshCw className="w-4 h-4" />
                        <span className="hidden sm:inline">Switch</span>
                      </button>
                    )}

                    {onDeleteShift && (
                      <button
                        onClick={() => onDeleteShift(shift.id)}
                        className="px-3 py-2 bg-red-100 text-red-700 rounded-lg text-sm hover:bg-red-200 flex items-center gap-2 font-medium"
                        title="Hapus shift"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span className="hidden sm:inline">Hapus</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Expanded Content */}
              {isExpanded && (
                <div className="border-t bg-gray-50 px-5 py-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Users className="w-5 h-5 text-gray-600" />
                    <h4 className="font-semibold text-gray-900">
                      Karyawan yang Di-assign
                    </h4>
                    <span className="px-2 py-0.5 rounded-full bg-gray-200 text-sm font-medium">
                      {employeeCount} orang
                    </span>
                  </div>

                  {employeeCount > 0 ? (
                    <div className="space-y-3">
                      {employees.map((emp) => (
                        <div
                          key={emp.employeeId}
                          className="flex items-center justify-between p-3 bg-white rounded-lg border hover:border-gray-200 transition"
                        >
                          <div className="flex items-center gap-3">
                            {emp.employeePicture ? (
                              <img
                                src={emp.employeePicture}
                                alt={emp.employeeName}
                                className="w-10 h-10 rounded-full object-cover border"
                              />
                            ) : (
                              <div
                                className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm ${getAvatarColor(
                                  emp.employeeName
                                )}`}
                              >
                                {getInitials(emp.employeeName)}
                              </div>
                            )}

                            <div>
                              <h5 className="font-medium text-gray-900">
                                {emp.employeeName}
                              </h5>
                              <p className="text-xs text-gray-500">
                                ID: {emp.employeeId.substring(0, 8)}...
                              </p>
                            </div>
                          </div>
                          
                          {/* Tombol Hapus */}
                          {onRemoveEmployee && (
                            <button
                              onClick={() =>
                                onRemoveEmployee(shift.id, emp.employeeId)
                              }
                              className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition"
                              title="Hapus dari shift"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <Users className="w-10 h-10 mx-auto mb-4 text-gray-400" />
                      <p className="font-medium">Belum ada karyawan di-assign</p>
                      <p className="text-sm mt-1">
                        Gunakan tombol "Assign Karyawan" untuk menambahkan karyawan ke shift ini
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}

        {shifts.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <Clock className="w-10 h-10 mx-auto mb-4 text-gray-400" />
            <p className="font-medium text-lg mb-2">Belum ada shift</p>
            <p className="text-sm">
              Buat shift baru dengan menekan tombol "Buat Shift"
            </p>
          </div>
        )}
      </div>
    </>
  );
};

export default ShiftSection;