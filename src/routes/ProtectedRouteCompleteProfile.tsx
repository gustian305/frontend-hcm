import { useSelector } from "react-redux";
import { RootState } from "../store";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedCompleteProfile = () => {
  const { isAuthenticated, needsProfile, initialized } = useSelector(
    (state: RootState) => state.auth
  );

  if (!initialized) return <div>Loading...</div>;

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  if (!needsProfile) return <Navigate to="/dashboard" replace />;

  return <Outlet />;
};

export default ProtectedCompleteProfile;
