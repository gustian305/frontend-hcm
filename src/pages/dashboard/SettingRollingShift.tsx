// // src/pages/setting/SettingRollingShift.tsx
// import React, { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { RootState, AppDispatch } from "../../store";

// import RollingShiftForm from "../../components/form/RollingShiftForm";
// import Button from "../../components/button/Button";
// import { RollingShiftRuleRequest } from "../../service/shiftService";
// import {
//   createRollingShiftRuleThunk,
//   fetchRollingShiftRulesThunk,
//   updateRollingShiftRuleThunk,
//   fetchShiftsThunk,
// } from "../../store/slices/shiftSlice";

// const SettingRollingShift: React.FC = () => {
//   const dispatch = useDispatch<AppDispatch>();
//   const { loading, rules, shifts } = useSelector((state: RootState) => state.shift);
//   const { departmentData } = useSelector((state: RootState) => state.department);

//   const [formValues, setFormValues] = useState<RollingShiftRuleRequest>({
//     period: "weekly",
//     startDate: "",
//     departmentIds: [],
//     patterns: [],
//   });

//   const [initialized, setInitialized] = useState(false);

//   // Options untuk form
//   const shiftOptions = shifts?.map((s) => ({
//     id: s.id,
//     name: s.shiftName || "Tidak ada nama shift",
//   })) || [];

//   const departmentOptions = departmentData?.data?.map((d) => ({
//     id: d.id,
//     name: d.name,
//   })) || [];

//   // Fetch awal
//   useEffect(() => {
//     dispatch(fetchShiftsThunk());
//     dispatch(fetchRollingShiftRulesThunk());
//   }, [dispatch]);

//   // Update formValues setelah shifts & rules selesai fetch
//   useEffect(() => {
//     if (initialized || rules.length === 0 || shifts.length === 0) return;

//     const firstRule = rules[0];
//     if (!firstRule) return;

//     setFormValues({
//       period: firstRule.period,
//       startDate: firstRule.startDate,
//       customPeriodDays: firstRule.customPeriodDays,
//       departmentIds: firstRule.departments?.map((d) => d.id) || [],
//       patterns:
//         firstRule.patterns?.map((p) => {
//           const shift = shifts.find((s) => s.id === p.shiftId);
//           return {
//             order: p.order,
//             shiftId: p.shiftId,
//             shiftName: shift?.shiftName || "Tidak ada nama shift",
//           };
//         }) || [],
//     });

//     setInitialized(true);
//   }, [rules, shifts, initialized]);

//   const handleSubmit = async () => {
//     try {
//       const existingRule = rules[0];
//       if (existingRule) {
//         await dispatch(updateRollingShiftRuleThunk({
//           id: existingRule.id,
//           payload: formValues,
//         })).unwrap();
//         alert("Rolling Shift Rule updated!");
//       } else {
//         await dispatch(createRollingShiftRuleThunk(formValues)).unwrap();
//         alert("Rolling Shift Rule created!");
//       }

//       // Refresh data
//       dispatch(fetchRollingShiftRulesThunk());
//     } catch (err: any) {
//       alert(err?.message || "Failed to save rolling shift rule");
//     }
//   };

//   return (
//     <div className="p-5">
//       <h1 className="text-2xl font-bold mb-4">Pengaturan Rolling Shift</h1>

//       {loading && <p className="text-gray-500 mb-3">Loading...</p>}

//       {rules.length > 0 ? (
//         <div className="bg-green-50 border border-green-300 p-4 rounded mb-4">
//           <p className="font-medium text-green-700">Current Rolling Shift Rule Loaded</p>

//           {/* Pola Shift */}
//           <div className="mt-2">
//             <p className="font-medium text-gray-700 mb-1">Pola Shift:</p>
//             {formValues.patterns.length === 0 ? (
//               <p className="text-gray-500">Belum ada pola shift</p>
//             ) : (
//               <ul className="list-disc ml-5">
//                 {formValues.patterns
//                   .sort((a, b) => a.order - b.order)
//                   .map((p) => (
//                     <li key={p.order}>
//                       {p.order}. {p.shiftName || "Tidak ada shift"}
//                     </li>
//                   ))}
//               </ul>
//             )}
//           </div>
//         </div>
//       ) : (
//         <div className="bg-red-50 border border-red-300 p-4 rounded mb-4">
//           <p className="font-medium text-red-700">No Rolling Shift Rule Found</p>
//           <p className="text-sm text-red-600">Please create one below.</p>
//         </div>
//       )}

//       {/* Form */}
//       <div className="bg-white border border-gray-200 p-4 rounded shadow-sm">
//         <RollingShiftForm
//           values={formValues}
//           setValues={setFormValues}
//           shifts={shiftOptions}
//           departments={departmentOptions}
//         />

//         <Button
//           className="flex items-center mt-4 px-4 py-2 rounded-lg text-white hover:opacity-70 transition"
//           bgColor="#189AB4"
//           onClick={handleSubmit}
//         >
//           {rules.length > 0 ? "Update Rolling Shift" : "Buat Rolling Shift"}
//         </Button>
//       </div>
//     </div>
//   );
// };

// export default SettingRollingShift;
