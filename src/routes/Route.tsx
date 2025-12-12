import { Routes, Route, Navigate } from "react-router-dom";

import LoginPage from "../pages/auth/Login";
import DashboardPage from "../pages/dashboard/Dashboard";
import EmployeePage from "../pages/dashboard/EmployeeManagement";
import DepartmentPage from "../pages/dashboard/DepartmentManagement";
import UnauthorizedPage from "../pages/Unauthorized";

import ProtectedRouteDashboard from "./ProtectedRouteDashboard";
import ProtectedCompleteProfile from "./ProtectedRouteCompleteProfile";
import LandingPage from "../pages/landing/LandingPage";
import MainLayout from "../components/layout/Main";
import RolePermissionPage from "../pages/dashboard/RolePermissionManagement";
import ShiftPage from "../pages/dashboard/ShiftManagement";
import CompleteProfilePage from "../pages/auth/completeProfile";
import AttendancePage from "../pages/dashboard/Attendance";
import AttendanceManagementPage from "../pages/dashboard/AttendanceManagement";
import WorkLeavePage from "../pages/dashboard/WorkLeave";
import WorkLeaveManagementPage from "../pages/dashboard/WorkLeaveManagement";
import JobVacancyPage from "../pages/dashboard/JobVacancy";
import JobPage from "../pages/landing/Job";
import WorkPlanDetailPage from "../pages/dashboard/workPlanDetail";
import SettingAttendancePage from "../pages/dashboard/SettingAttendanceRule";
import Setting from "../pages/dashboard/Settings";

const AppRoutes = () => {
  return (
    <Routes>
      {/* ==================== LANDING PAGE ==================== */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/job" element={<JobPage />} />
      {/* ======================== AUTH ======================== */}
      <Route path="/login" element={<LoginPage />} />

      {/* =================== COMPLETE PROFILE ================== */}
      <Route element={<ProtectedCompleteProfile />}>
        <Route
          path="/complete-profile/:userId"
          element={<CompleteProfilePage />}
        />
      </Route>

      {/* ====================== DASHBOARD ====================== */}
      <Route
        element={
          <ProtectedRouteDashboard>
            <MainLayout />
          </ProtectedRouteDashboard>
        }
      >
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/employee-management" element={<EmployeePage />} />
        <Route path="/department-management" element={<DepartmentPage />} />
        <Route path="/shift-management" element={<ShiftPage />} />
        <Route path="/settings" element={<Setting />}>
          <Route index element={<Navigate to="attendance-rule" replace />} />
          <Route path="attendance-rule" element={<SettingAttendancePage />} />
        </Route>
        <Route path="/attendance" element={<AttendancePage />} />
        <Route
          path="/attendance-management"
          element={<AttendanceManagementPage />}
        />
        <Route
          path="/role-permission-management"
          element={<RolePermissionPage />}
        />
        <Route path="/work-leave" element={<WorkLeavePage />} />
        <Route
          path="/work-leave-management"
          element={<WorkLeaveManagementPage />}
        />
        <Route path="/job-vacancy" element={<JobVacancyPage />} />

        <Route path="/work-plan/:workPlanId" element={<WorkPlanDetailPage />} />
      </Route>

      {/* =================== PERMISSION BLOCK =================== */}
      <Route path="/unauthorized" element={<UnauthorizedPage />} />

      {/* ========================= FALLBACK ===================== */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
