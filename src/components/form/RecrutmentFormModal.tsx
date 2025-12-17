import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, UploadCloud } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../../store";
import { ApplicantRequest } from "../../service/applicantService";
import {
  resetApplicantState,
  submitApplicant,
} from "../../store/slices/applicantSlice";

interface RecruitmentFormModalProps {
  open: boolean;
  onClose: () => void;
  companyId: string;
  jobVacancyId: string;
}

const RecruitmentFormModal: React.FC<RecruitmentFormModalProps> = ({
  open,
  onClose,
  companyId,
  jobVacancyId,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error, lastSubmitted } = useSelector(
    (state: RootState) => state.applicant
  );

  const [formData, setFormData] = useState<ApplicantRequest>({
    fullName: "",
    phoneNumber: "",
    email: "",
    birthPlace: "",
    birthDate: "",
    address: "",
    gender: "",
    cvFile: null as unknown as File,
    certificateFile: null as unknown as File,
    resume: "",
  });

  // Reset state on modal close
  useEffect(() => {
    if (!open) {
      setFormData({
        fullName: "",
        phoneNumber: "",
        email: "",
        birthPlace: "",
        birthDate: "",
        address: "",
        gender: "",
        cvFile: null as unknown as File,
        certificateFile: null as unknown as File,
        resume: "",
      });
      dispatch(resetApplicantState());
    }
  }, [open, dispatch]);

  // Close modal if submission successful
  useEffect(() => {
    if (lastSubmitted) {
      onClose();
    }
  }, [lastSubmitted, onClose]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, files } = e.target as HTMLInputElement;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validasi minimal file
    if (!formData.cvFile || !formData.certificateFile) {
      alert("CV dan Ijazah wajib diunggah");
      return;
    }

    dispatch(
      submitApplicant({
        companyId,
        jobVacancyId,
        payload: formData,
      })
    );
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white rounded-xl w-full max-w-2xl p-6 relative"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ duration: 0.3 }}
          >
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold">Form Recruitment</h2>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Description */}
            <p className="text-sm text-gray-600 mb-6">
              Isi data Anda untuk mendaftar pada lowongan yang tersedia.
            </p>

            {error && <p className="text-red-500 mb-2">{error}</p>}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Row 1 */}
              <div className="flex flex-col sm:flex-row gap-4">
                <input
                  type="text"
                  name="fullName"
                  placeholder="Nama Lengkap"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-400"
                  required
                />
                <input
                  type="text"
                  name="phoneNumber"
                  placeholder="Nomor Telepon"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-400"
                  required
                />
              </div>

              {/* Row 2 */}
              <div className="flex flex-col sm:flex-row gap-4">
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                  className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-400"
                  required
                />
                <input
                  type="text"
                  name="birthPlace"
                  placeholder="Tempat Lahir"
                  value={formData.birthPlace}
                  onChange={handleChange}
                  className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-400"
                  required
                />
              </div>

              {/* Row 3 */}
              <input
                type="date"
                name="birthDate"
                placeholder="Tanggal Lahir"
                value={formData.birthDate}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-400"
                required
              />

              {/* Row 4 */}
              <input
                type="text"
                name="address"
                placeholder="Alamat"
                value={formData.address}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-400"
                required
              />

              {/* Row 5: Gender */}
              <select
                name="gender"
                value={formData.gender}
                onChange={handleSelectChange} // <- pakai handler baru
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-400"
                required
              >
                <option value="">Pilih Jenis Kelamin</option>
                <option value="Male">Laki-laki</option>
                <option value="Female">Perempuan</option>
              </select>

              {/* Row 6: Upload Files */}
              <div className="flex flex-col sm:flex-row gap-4">
                <label className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-4 cursor-pointer hover:border-teal-500 hover:bg-teal-50 text-center">
                  <UploadCloud className="w-10 h-10 text-teal-500 mb-1" />
                  <span className="font-medium text-sm">
                    {formData.certificateFile
                      ? formData.certificateFile.name
                      : "Upload Ijazah"}
                  </span>
                  <span className="text-xs text-gray-500">
                    (PDF / JPG / PNG)
                  </span>
                  <input
                    type="file"
                    name="certificateFile"
                    accept=".pdf,.jpg,.png"
                    hidden
                    onChange={handleChange}
                    required
                  />
                </label>

                <label className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-4 cursor-pointer hover:border-teal-500 hover:bg-teal-50 text-center">
                  <UploadCloud className="w-10 h-10 text-teal-500 mb-1" />
                  <span className="font-medium text-sm">
                    {formData.cvFile ? formData.cvFile.name : "Upload CV"}
                  </span>
                  <span className="text-xs text-gray-500">
                    (PDF / JPG / PNG)
                  </span>
                  <input
                    type="file"
                    name="cvFile"
                    accept=".pdf,.jpg,.png"
                    hidden
                    onChange={handleChange}
                    required
                  />
                </label>
              </div>

              {/* Row 7: Resume */}
              <textarea
                name="resume"
                placeholder="Resume (Opsional)"
                value={formData.resume}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-400"
                rows={3}
              />

              {/* Submit Button */}
              <div className="text-right mt-4">
                <button
                  type="submit"
                  className={`px-6 py-2 bg-teal-500 text-white font-semibold rounded-lg transition ${
                    loading
                      ? "opacity-70 cursor-not-allowed"
                      : "hover:bg-teal-600"
                  }`}
                  disabled={loading}
                >
                  {loading ? "Mengirim..." : "Kirim Lamaran"}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default RecruitmentFormModal;
