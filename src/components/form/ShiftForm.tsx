import React from "react";
import { ShiftRequest } from "../../service/shiftService";

interface Props {
  values: ShiftRequest;
  setValues: (v: ShiftRequest) => void;
  workDays?: { id: string; name: string }[]; // list hari opsional
}

const ShiftForm: React.FC<Props> = ({ values, setValues, workDays = [] }) => {
  const toggleWorkDay = (id: string) => {
    const exist = values.workDayIds.includes(id);
    const updated = exist
      ? values.workDayIds.filter((w) => w !== id)
      : [...values.workDayIds, id];

    setValues({ ...values, workDayIds: updated });
  };

  return (
    <div className="space-y-4">

      {/* Night Shift */}
      <div className="flex items-center justify-between bg-gray-50 border rounded-lg p-3">
        <label className="text-sm font-medium text-gray-700">
          Night Shift
          <p className="text-xs text-gray-500">Enable if this shift passes midnight</p>
        </label>

        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={values.isNightShift}
            onChange={(e) =>
              setValues({ ...values, isNightShift: e.target.checked })
            }
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-300 rounded-full peer peer-checked:bg-indigo-600 transition-colors"></div>
          <div className="absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full shadow peer-checked:translate-x-5 transition-transform"></div>
        </label>
      </div>

      {/* Shift Name */}
      <label className="flex flex-col gap-1">
        <span className="text-sm font-medium text-gray-700">Shift Name</span>
        <input
          type="text"
          value={values.shiftName}
          onChange={(e) => setValues({ ...values, shiftName: e.target.value })}
          className="border px-3 py-2 rounded-lg focus:ring-2 focus:ring-indigo-500"
        />
      </label>

      {/* Work Days */}
      <div className="flex flex-col gap-1">
        <span className="text-sm font-medium text-gray-700">Work Days</span>
        <div className="grid grid-cols-3 gap-2 bg-gray-50 border p-3 rounded-lg">
          {workDays.map((day) => (
            <label key={day.id} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={values.workDayIds.includes(day.id)}
                onChange={() => toggleWorkDay(day.id)}
              />
              <span className="text-sm">{day.name}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Date Start */}
      <label className="flex flex-col gap-1">
        <span className="text-sm font-medium text-gray-700">Start Date</span>
        <input
          type="date"
          value={values.dateStart}
          onChange={(e) => setValues({ ...values, dateStart: e.target.value })}
          className="border px-3 py-2 rounded-lg focus:ring-2 focus:ring-indigo-500"
        />
      </label>

      {/* Date End */}
      <label className="flex flex-col gap-1">
        <span className="text-sm font-medium text-gray-700">End Date</span>
        <input
          type="date"
          value={values.dateEnd}
          onChange={(e) => setValues({ ...values, dateEnd: e.target.value })}
          className="border px-3 py-2 rounded-lg focus:ring-2 focus:ring-indigo-500"
        />
      </label>

      {/* Start Time */}
      <label className="flex flex-col gap-1">
        <span className="text-sm font-medium text-gray-700">Start Time</span>
        <input
          type="time"
          value={values.shiftStartTime}
          onChange={(e) => setValues({ ...values, shiftStartTime: e.target.value })}
          className="border px-3 py-2 rounded-lg focus:ring-2 focus:ring-indigo-400"
        />
      </label>

      {/* End Time */}
      <label className="flex flex-col gap-1">
        <span className="text-sm font-medium text-gray-700">End Time</span>
        <input
          type="time"
          value={values.shiftEndTime}
          onChange={(e) => setValues({ ...values, shiftEndTime: e.target.value })}
          className="border px-3 py-2 rounded-lg focus:ring-2 focus:ring-indigo-400"
        />
      </label>

      {/* Active Status */}
      <div className="flex items-center justify-between bg-gray-50 border rounded-lg p-3">
        <label className="text-sm font-medium text-gray-700">Active Shift</label>

        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={values.isActive}
            onChange={(e) => setValues({ ...values, isActive: e.target.checked })}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-300 rounded-full peer peer-checked:bg-green-500 transition-colors"></div>
          <div className="absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full shadow peer-checked:translate-x-5 transition-transform"></div>
        </label>
      </div>
    </div>
  );
};

export default ShiftForm;
