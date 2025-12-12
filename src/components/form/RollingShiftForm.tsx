import React, { useEffect } from "react";
import { RollingShiftPatternRequest, RollingShiftRuleRequest } from "../../service/shiftService";

interface Props {
  values: RollingShiftRuleRequest;
  setValues: (v: RollingShiftRuleRequest) => void;
  shifts: { id: string; name: string }[];
  departments: { id: string; name: string }[];
}

const RollingShiftForm: React.FC<Props> = ({ values, setValues, shifts, departments }) => {
  // Buat pola default jika kosong atau periode berubah
  useEffect(() => {
    let defaultLength = 1;
    if (values.period === "weekly") defaultLength = 7;
    else if (values.period === "bi_weekly") defaultLength = 14;
    else if (values.period === "monthly") defaultLength = 30;
    else if (values.period === "custom") defaultLength = values.customPeriodDays || 1;

    if (!values.patterns || values.patterns.length !== defaultLength) {
      const newPatterns: RollingShiftPatternRequest[] = Array.from(
        { length: defaultLength },
        (_, i) => ({
          order: i + 1,
          shiftId: values.patterns?.[i]?.shiftId,
          shiftName: values.patterns?.[i]?.shiftName || "Belum dipilih",
        })
      );
      setValues({ ...values, patterns: newPatterns });
    }
  }, [values.period, values.patterns, values.customPeriodDays, setValues]);

  const handlePatternChange = (index: number, shiftId: string) => {
    const shift = shifts.find((s) => s.id === shiftId);
    const newPatterns: RollingShiftPatternRequest[] = [...values.patterns];
    newPatterns[index] = {
      ...newPatterns[index],
      shiftId: shift?.id,
      shiftName: shift?.name || "Tidak ada data shift",
    };
    setValues({ ...values, patterns: newPatterns });
  };

  const toggleDepartment = (deptId: string) => {
    const newDeptIds = values.departmentIds ? [...values.departmentIds] : [];
    if (newDeptIds.includes(deptId)) {
      setValues({ ...values, departmentIds: newDeptIds.filter((d) => d !== deptId) });
    } else {
      newDeptIds.push(deptId);
      setValues({ ...values, departmentIds: newDeptIds });
    }
  };

  return (
    <div className="space-y-4">
      {/* Periode Rolling */}
      <label className="flex flex-col gap-1">
        <span className="text-sm font-medium">Periode Rolling</span>
        <select
          value={values.period}
          onChange={(e) =>
            setValues({ ...values, period: e.target.value as RollingShiftRuleRequest["period"] })
          }
          className="border px-3 py-2 rounded-lg"
        >
          <option value="weekly">1 Minggu</option>
          <option value="bi_weekly">2 Minggu</option>
          <option value="monthly">Bulan</option>
          <option value="custom">Custom</option>
        </select>
      </label>

      {/* Custom Period Days */}
      {values.period === "custom" && (
        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium">Jumlah Hari Custom</span>
          <input
            type="number"
            min={1}
            value={values.customPeriodDays || 1}
            onChange={(e) =>
              setValues({
                ...values,
                customPeriodDays: Number(e.target.value),
              })
            }
            className="border px-3 py-2 rounded-lg"
          />
        </label>
      )}

      {/* Tanggal Mulai */}
      <label className="flex flex-col gap-1">
        <span className="text-sm font-medium">Tanggal Mulai</span>
        <input
          type="date"
          value={values.startDate}
          onChange={(e) => setValues({ ...values, startDate: e.target.value })}
          className="border px-3 py-2 rounded-lg"
        />
      </label>

      {/* Pola Shift */}
      <div>
        <span className="text-sm font-medium">Pola Shift</span>
        {values.patterns.length === 0 && <p className="text-xs text-gray-500">Belum ada pola shift</p>}
        {values.patterns.map((pattern, idx) => (
          <div key={idx} className="flex items-center gap-2 mt-2">
            <span>{pattern.order}.</span>
            <select
              value={pattern.shiftId || ""}
              onChange={(e) => handlePatternChange(idx, e.target.value)}
              className="border px-3 py-2 rounded-lg flex-1"
            >
              <option value="">Pilih Shift</option>
              {shifts.length === 0 ? (
                <option value="" disabled>Tidak ada data shift</option>
              ) : (
                shifts.map((s) => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))
              )}
            </select>
          </div>
        ))}
      </div>

      {/* Terapkan ke Department */}
      <div>
        <span className="text-sm font-medium">Terapkan ke Department</span>
        {departments.length === 0 && <p className="text-xs text-gray-500">Tidak ada data department</p>}
        <div className="flex flex-col gap-1 mt-1">
          {departments.map((d) => (
            <label key={d.id} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={values.departmentIds?.includes(d.id) || false}
                onChange={() => toggleDepartment(d.id)}
              />
              <span>{d.name}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RollingShiftForm;
