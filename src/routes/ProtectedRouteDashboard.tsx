import HumadifyLogo from "../assets/HumadifySecondary.svg";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { hasPermission } from "../utils/permission";
import { PermissionInfo } from "../service/authService";

interface Props {
  permission?: string | string[];
  children?: React.ReactNode;
}

const ProtectedDashboard = ({ permission, children }: Props) => {
  const { isAuthenticated, needsProfile, userInfo, initialized } = useSelector(
    (state: RootState) => state.auth
  );
  const location = useLocation();

  if (!initialized) {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center bg-white z-50">
        <img src={HumadifyLogo} alt="Humadify Logo" className="h-20 w-auto mb-4 animate-pulse" />
        <span className="text-lg font-semibold text-gray-700 animate-pulse">
          Loading...
        </span>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (needsProfile) {
    return (
      <Navigate
        to={`/complete-profile/${userInfo?.id}`}
        replace
        state={{ from: location }}
      />
    );
  }

  if (permission) {
    const userPerm =
      userInfo?.permission?.map((p: PermissionInfo) => p.name) || [];

    if (!hasPermission(userPerm, permission)) {
      return <Navigate to="/unauthorized" replace />;
    }
  }

  return <>{children || <Outlet />}</>;
};

export default ProtectedDashboard;
