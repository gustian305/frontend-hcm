import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import departmentReducer from "./slices/departmentSlice";
import rolePermissionReducer from "./slices/rolePermissionSlice";
import employeeReducer from "./slices/employeeSlice";
import shiftReducer from "./slices/shiftSlice";
import forgotPasswordReducer from "./slices/forgotPasswordSlice";
import attendanceReducer from "./slices/attendanceSlice";
import workLeaveReducer from "./slices/workLeaveSlice";
import jobVacancyReducer from "./slices/jobVacancySlice";
import workPlanTaskReducer from "./slices/workPlanTaskSlice";
import attendanceRuleReducer from "./slices/attendanceRuleSlice";
import assignShiftReducer from "./slices/assignShiftSlice";
import applicantReducer from "./slices/applicantSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    forgotPassword: forgotPasswordReducer,
    department: departmentReducer,
    rolePermission: rolePermissionReducer,
    employee: employeeReducer,
    shift: shiftReducer,
    assignShift: assignShiftReducer,
    attendance: attendanceReducer,
    attendanceRule: attendanceRuleReducer,
    workLeave: workLeaveReducer,
    jobVacancy: jobVacancyReducer,
    workPlanTask: workPlanTaskReducer,
    applicant: applicantReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, 
    }),
});

// types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
