// src/AppWrapper.tsx
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { rehydrateAuth } from "./store/slices/authSlice";
import { AppDispatch, RootState } from "./store";
import AppRoutes from "./routes/Route";


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
      <div className="w-full h-screen flex items-center justify-center">
        <span>Loading...</span>
      </div>
    );
  }

  return <AppRoutes />;
};

export default AppWrapper;
