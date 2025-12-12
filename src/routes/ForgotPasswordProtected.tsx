import { useSelector } from "react-redux";
import { Navigate, useParams } from "react-router-dom";
import type { RootState } from "../store";

const ForgotPasswordProtected: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { token: storedToken } = useSelector(
    (state: RootState) => state.forgotPassword
  );

  const { token: urlToken } = useParams();

  if (!storedToken) {
    return <Navigate to="/login" replace />;
  }

  if (storedToken !== urlToken) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ForgotPasswordProtected;
