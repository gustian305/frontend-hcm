import { EmployeeRequest } from "../../service/employeeService";
import { formatDateInput } from "../../utils/dateTimeHelper";
import ModalForm from "../modal/FormModal";
import { useEffect, useState } from "react";

interface EmployeeFormProps {
  modalOpen: boolean;
  editEmployee: EmployeeRequest | null;
  departmentData: any;
  roleList: any[];
  handleCreateOrUpdate: (values: EmployeeRequest) => Promise<void>;
  handleModalClose: () => void;
}

const EmployeeForm: React.FC<EmployeeFormProps> = ({
  modalOpen,
  editEmployee,
  departmentData,
  roleList,
  handleCreateOrUpdate,
  handleModalClose,
}) => {
  const [initialValues, setInitialValues] = useState<EmployeeRequest>({
    fullName: "",
    email: "",
    departmentId: "",
    roleId: "",
    employmentStatus: "",
    idCardNumber: "",
    joinedDate: "",
    status: "active",
    isVerified: false,
  });

  // Update initialValues ketika editEmployee berubah
  useEffect(() => {
    if (editEmployee) {
      console.log("Setting initial values from editEmployee:", editEmployee);
      setInitialValues({
        fullName: editEmployee.fullName || "",
        email: editEmployee.email || "",
        departmentId: editEmployee.departmentId
          ? String(editEmployee.departmentId)
          : "",
        roleId: editEmployee.roleId ? String(editEmployee.roleId) : "",
        employmentStatus: editEmployee.employmentStatus || "",
        idCardNumber: editEmployee.idCardNumber || "",
        joinedDate: formatDateInput(editEmployee.joinedDate),
        status: editEmployee.status || "active",
        isVerified: editEmployee.isVerified || false,
      });
    } else {
      // Reset untuk tambah baru
      setInitialValues({
        fullName: "",
        email: "",
        departmentId: "",
        roleId: "",
        employmentStatus: "",
        idCardNumber: "",
        joinedDate: "",
        status: "active",
        isVerified: false,
      });
    }
  }, [editEmployee]);


  if (!modalOpen || !departmentData?.data || !roleList) {
    return null;
  }

  return (
    <ModalForm<EmployeeRequest>
      title={editEmployee ? "Edit Karyawan" : "Tambah Karyawan"}
      initialValues={initialValues}
      onSubmit={handleCreateOrUpdate}
      onClose={handleModalClose}
      submitLabel={editEmployee ? "Update Karyawan" : "Simpan Karyawan"}
      cancelLabel="Batal"
      width="lg"
    >
      {(values, setValues, errors, setErrors) => (
        <div className="space-y-6">
          {/* Grid untuk ID Pegawai dan Nama Lengkap */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* ID Pegawai */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ID Pegawai <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2"
                    />
                  </svg>
                </div>
                <input
                  type="text"
                  className={`
                    w-full pl-10 pr-4 py-3 border rounded-lg
                    focus:ring-2 focus:ring-[#189AB4] focus:border-transparent
                    transition-all duration-200
                    ${errors.idCardNumber ? "border-red-500" : "border-gray-300"}
                    hover:border-gray-400
                  `}
                  placeholder="Masukkan ID pegawai"
                  value={values.idCardNumber}
                  onChange={(e) => {
                    setValues({ ...values, idCardNumber: e.target.value });
                    if (errors.idCardNumber) {
                      setErrors({ ...errors, idCardNumber: "" });
                    }
                  }}
                  required
                />
              </div>
              {errors.idCardNumber && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.idCardNumber}
                </p>
              )}
            </div>

            {/* Nama Lengkap */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nama Lengkap <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </div>
                <input
                  type="text"
                  className={`
                    w-full pl-10 pr-4 py-3 border rounded-lg
                    focus:ring-2 focus:ring-[#189AB4] focus:border-transparent
                    transition-all duration-200
                    ${errors.fullName ? "border-red-500" : "border-gray-300"}
                    hover:border-gray-400
                  `}
                  placeholder="Masukkan nama lengkap"
                  value={values.fullName}
                  onChange={(e) => {
                    setValues({ ...values, fullName: e.target.value });
                    if (errors.fullName) {
                      setErrors({ ...errors, fullName: "" });
                    }
                  }}
                  required
                />
              </div>
              {errors.fullName && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.fullName}
                </p>
              )}
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <input
                type="email"
                className={`
                  w-full pl-10 pr-4 py-3 border rounded-lg
                  focus:ring-2 focus:ring-[#189AB4] focus:border-transparent
                  transition-all duration-200
                  ${errors.email ? "border-red-500" : "border-gray-300"}
                  hover:border-gray-400
                `}
                placeholder="nama@perusahaan.com"
                value={values.email}
                onChange={(e) => {
                  setValues({ ...values, email: e.target.value });
                  if (errors.email) {
                    setErrors({ ...errors, email: "" });
                  }
                }}
                required
              />
            </div>
            {errors.email && (
              <p className="mt-1 text-sm text-red-500">{errors.email}</p>
            )}
          </div>

          {/* Grid untuk Department dan Role */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Department */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Department <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                    />
                  </svg>
                </div>
                <select
                  className={`
                    w-full pl-10 pr-4 py-3 border rounded-lg appearance-none
                    focus:ring-2 focus:ring-[#189AB4] focus:border-transparent
                    transition-all duration-200 bg-white
                    ${errors.departmentId ? "border-red-500" : "border-gray-300"}
                    hover:border-gray-400 cursor-pointer
                  `}
                  value={values.departmentId || ""}
                  onChange={(e) => {
                    setValues({ ...values, departmentId: e.target.value });
                    if (errors.departmentId) {
                      setErrors({ ...errors, departmentId: "" });
                    }
                  }}
                  required
                >
                  <option value="">Pilih Department</option>
                  {departmentData?.data.map((d: any) => (
                    <option key={d.id} value={String(d.id)}>
                      {d.name}
                    </option>
                  ))}
                </select>
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>
              {errors.departmentId && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.departmentId}
                </p>
              )}
            </div>

            {/* Role */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Role <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                </div>
                <select
                  className={`
                    w-full pl-10 pr-4 py-3 border rounded-lg appearance-none
                    focus:ring-2 focus:ring-[#189AB4] focus:border-transparent
                    transition-all duration-200 bg-white
                    ${errors.roleId ? "border-red-500" : "border-gray-300"}
                    hover:border-gray-400 cursor-pointer
                  `}
                  value={values.roleId || ""}
                  onChange={(e) => {
                    setValues({ ...values, roleId: e.target.value });
                    if (errors.roleId) {
                      setErrors({ ...errors, roleId: "" });
                    }
                  }}
                  required
                >
                  <option value="">Pilih Role</option>
                  {roleList.map((r: any) => (
                    <option key={r.id} value={String(r.id)}>
                      {r.name}
                    </option>
                  ))}
                </select>
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>
              {errors.roleId && (
                <p className="mt-1 text-sm text-red-500">{errors.roleId}</p>
              )}
            </div>
          </div>

          {/* Grid untuk Tanggal Bergabung dan Status Kepegawaian */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Tanggal Bergabung */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tanggal Bergabung <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <input
                  type="date"
                  className={`
                    w-full pl-10 pr-4 py-3 border rounded-lg
                    focus:ring-2 focus:ring-[#189AB4] focus:border-transparent
                    transition-all duration-200
                    ${errors.joinedDate ? "border-red-500" : "border-gray-300"}
                    hover:border-gray-400
                  `}
                  value={values.joinedDate || ""}
                  onChange={(e) => {
                    setValues({ ...values, joinedDate: e.target.value });
                    if (errors.joinedDate) {
                      setErrors({ ...errors, joinedDate: "" });
                    }
                  }}
                  required
                />
              </div>
              {errors.joinedDate && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.joinedDate}
                </p>
              )}
            </div>

            {/* Status Kepegawaian */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status Kepegawaian <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <select
                  className={`
                    w-full pl-10 pr-4 py-3 border rounded-lg appearance-none
                    focus:ring-2 focus:ring-[#189AB4] focus:border-transparent
                    transition-all duration-200 bg-white
                    ${
                      errors.employmentStatus
                        ? "border-red-500"
                        : "border-gray-300"
                    }
                    hover:border-gray-400 cursor-pointer
                  `}
                  value={values.employmentStatus || ""}
                  onChange={(e) => {
                    setValues({
                      ...values,
                      employmentStatus: e.target.value,
                    });
                    if (errors.employmentStatus) {
                      setErrors({ ...errors, employmentStatus: "" });
                    }
                  }}
                  required
                >
                  <option value="">Pilih Status Kepegawaian</option>
                  <option value="karyawan tetap">Karyawan Tetap</option>
                  <option value="karyawan kontrak (part-time)">
                    Karyawan Kontrak (Part-Time)
                  </option>
                  <option value="karyawan paruh waktu (freelance)">
                    Karyawan Paruh Waktu (Freelance)
                  </option>
                  <option value="karyawan magang">Karyawan Magang</option>
                  <option value="karyawan outsourcing">
                    Karyawan Outsourcing
                  </option>
                  <option value="karyawan harian lepas (casual employee)">
                    Karyawan Harian Lepas (Casual Employee)
                  </option>
                </select>
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>
              {errors.employmentStatus && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.employmentStatus}
                </p>
              )}
            </div>
          </div>

          {/* Grid untuk Status dan Verified */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status Akun
              </label>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <div
                    className={`
                      w-6 h-6 rounded-full border-2 flex items-center justify-center
                      ${
                        values.status === "active"
                          ? "border-[#189AB4] bg-[#189AB4]"
                          : "border-gray-300"
                      }
                    `}
                  >
                    {values.status === "active" && (
                      <div className="w-2 h-2 rounded-full bg-white"></div>
                    )}
                  </div>
                  <input
                    type="radio"
                    name="status"
                    className="sr-only"
                    checked={values.status === "active"}
                    onChange={() =>
                      setValues({ ...values, status: "active" })
                    }
                  />
                  <span className="text-gray-700">active</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <div
                    className={`
                      w-6 h-6 rounded-full border-2 flex items-center justify-center
                      ${
                        values.status === "inactive"
                          ? "border-red-500 bg-red-500"
                          : "border-gray-300"
                      }
                    `}
                  >
                    {values.status === "inactive" && (
                      <div className="w-2 h-2 rounded-full bg-white"></div>
                    )}
                  </div>
                  <input
                    type="radio"
                    name="status"
                    className="sr-only"
                    checked={values.status === "inactive"}
                    onChange={() =>
                      setValues({ ...values, status: "inactive" })
                    }
                  />
                  <span className="text-gray-700">inactive</span>
                </label>
              </div>
            </div>

            {/* Verified Checkbox */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Verifikasi Akun
              </label>
              <div className="flex items-center">
                <label className="inline-flex items-center cursor-pointer">
                  <div className="relative">
                    <input
                      type="checkbox"
                      className="sr-only"
                      checked={values.isVerified || false}
                      onChange={(e) =>
                        setValues({
                          ...values,
                          isVerified: e.target.checked,
                        })
                      }
                    />
                    <div
                      className={`
                        w-12 h-6 rounded-full transition-colors duration-200
                        ${values.isVerified ? "bg-[#189AB4]" : "bg-gray-300"}
                      `}
                    ></div>
                    <div
                      className={`
                        absolute top-0.5 left-0.5 w-5 h-5 rounded-full
                        bg-white transition-transform duration-200 transform
                        ${values.isVerified ? "translate-x-6" : "translate-x-0"}
                        shadow-md
                      `}
                    ></div>
                  </div>
                  <span className="ml-3 text-gray-700">
                    {values.isVerified
                      ? "Terverifikasi"
                      : "Belum diverifikasi"}
                  </span>
                </label>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-200 pt-4">
            <p className="text-xs text-gray-500">
              <span className="text-red-500">*</span> Menandakan field yang
              wajib diisi
            </p>
          </div>
        </div>
      )}
    </ModalForm>
  );
};

export default EmployeeForm;