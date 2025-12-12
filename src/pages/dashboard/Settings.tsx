import React from "react";
import { NavLink, Outlet } from "react-router-dom";

const Setting: React.FC = () => {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Pengaturan</h1>

      {/* Navbar */}
      <nav className="flex gap-4 mb-6">
        <NavLink
          to="attendance-rule" // RELATIVE
          className={({ isActive }) =>
            `px-4 py-2 rounded-t-lg ${
              isActive
                ? "bg-blue-100 text-blue-700 font-semibold"
                : "text-gray-600"
            }`
          }
        >
          Aturan Kehadiran
        </NavLink>

        <NavLink
          to="rolling-shift-rule" // RELATIVE
          className={({ isActive }) =>
            `px-4 py-2 rounded-t-lg ${
              isActive
                ? "bg-blue-100 text-blue-700 font-semibold"
                : "text-gray-600"
            }`
          }
        >
          Rolling Shift Rule
        </NavLink>
      </nav>

      {/* Content dari child routes */}
      <Outlet />
    </div>
  );
};

export default Setting;
