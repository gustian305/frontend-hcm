import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../store";
import { resetPassword } from "../../store/slices/forgotPasswordSlice";
import { useState } from "react";

const ResetPasswordPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error, token } = useSelector(
    (state: RootState) => state.forgotPassword
  );

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const submitNewPassword = () => {
    dispatch(
      resetPassword({
        token: token!,
        payload: { newPassword, confirmPassword },
      })
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white shadow-lg rounded-xl p-6 w-full max-w-sm">
        <h1 className="text-xl font-semibold text-center mb-6">Reset Password</h1>

        <input
          type="password"
          placeholder="Password Baru"
          className="w-full px-3 py-2 border rounded-md mb-3"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />

        <input
          type="password"
          placeholder="Konfirmasi Password"
          className="w-full px-3 py-2 border rounded-md mb-3"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

        <button
          onClick={submitNewPassword}
          className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700"
        >
          {loading ? "Menyimpan..." : "Simpan Password"}
        </button>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
