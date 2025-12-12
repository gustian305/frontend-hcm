import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store";
import { completeProfileThunk } from "../../store/slices/authSlice";
import { useNavigate } from "react-router-dom";

const CompleteProfilePage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const { userInfo, profileLoading } = useSelector((s: RootState) => s.auth);

  const [form, setForm] = useState({
    name: userInfo?.name || "",
    phoneNumber: "",
    companyName: "",
  });

  const handleSubmit = async () => {
    const res = await dispatch(
      completeProfileThunk({
        userId: userInfo.id,
        payload: form,
      })
    );

    if (res.meta.requestStatus === "fulfilled") {
      navigate("/dashboard");
    }
  };

  return (
    <div className="w-full min-h-screen flex bg-gray-100">
      {/* Illustration */}
      <div className="hidden md:flex flex-1 bg-white justify-center items-center relative">
        <img
          src="\src\assets\ilustrasi-2.svg"
          alt="Illustration"
          className="w-1/2 object-contain"
        />
      </div>

      {/* Form */}
      <div className="flex-1 flex flex-col justify-center items-center bg-white px-12 py-16 max-w-lg shadow-lg">
        <img
          src="\src\assets\logo.svg"
          alt="logo"
          className="h-16 w-auto transition-all duration-300"
        />
        <h2 className="mt-6 text-2xl font-semibold text-gray-800 text-center">
          Complete Your Profile
        </h2>
        <p className="mt-2 text-gray-600 text-center">
          Silakan lengkapi profil Anda untuk mulai mengelola data karyawan dan
          HR.
        </p>

        {/* Input Full Name */}
        <div className="w-full mt-6">
          <label className="block text-gray-700 text-sm mb-1">Full Name</label>
          <input
            type="text"
            placeholder="Enter your full name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full p-3 border border-gray-300 rounded-full focus:ring-2 focus:ring-blue-400 outline-none"
          />
        </div>

        {/* Input Phone Number */}
        <div className="w-full mt-4">
          <label className="block text-gray-700 text-sm mb-1">
            Phone Number
          </label>
          <input
            type="text"
            placeholder="Enter your phone number"
            value={form.phoneNumber}
            onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })}
            className="w-full p-3 border border-gray-300 rounded-full focus:ring-2 focus:ring-blue-400 outline-none"
          />
        </div>

        {/* Input Company Name */}
        <div className="w-full mt-4">
          <label className="block text-gray-700 text-sm mb-1">
            Company Name
          </label>
          <input
            type="text"
            placeholder="Enter your company name"
            value={form.companyName}
            onChange={(e) => setForm({ ...form, companyName: e.target.value })}
            className="w-full p-3 border border-gray-300 rounded-full focus:ring-2 focus:ring-blue-400 outline-none"
          />
        </div>

        {/* Submit Button */}
        <div className="w-full mt-6">
          <button
            onClick={handleSubmit}
            disabled={profileLoading}
            className="w-full py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition font-semibold"
          >
            {profileLoading ? "Saving..." : "Submit"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CompleteProfilePage;
