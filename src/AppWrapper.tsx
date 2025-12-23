import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { rehydrateAuth } from "./store/slices/authSlice";
import { AppDispatch, RootState } from "./store";
import AppRoutes from "./routes/Route";
import HumadifyLogo from "./assets/HumadifySecondary.svg";


const AppWrapper: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [initialized, setInitialized] = useState(false);

  const { accessToken } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    const init = async () => {
      await dispatch(rehydrateAuth());
      setInitialized(true);
    };
    init();
  }, [dispatch]);

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

  return <AppRoutes />;
};

export default AppWrapper;
