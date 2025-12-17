import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Building, MapPin, CalendarClock, Search } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../../../store";
import {
  fetchJobVacanciesPublic,
  fetchJobVacancyDetailPublic,
} from "../../../store/slices/jobVacancySlice";
import ModalDetail from "../../../components/modal/DetailModal";
import RecruitmentFormModal from "../../../components/form/RecrutmentFormModal";
import buildingPicture from "../../../../public/building.svg";

const JobsListSection: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<any | null>(null);

  const dispatch = useDispatch<AppDispatch>();
  const { list, loading, error } = useSelector(
    (state: RootState) => state.jobVacancy
  );

  useEffect(() => {
    dispatch(fetchJobVacanciesPublic());
  }, [dispatch]);

  // ---------- Helpers ----------
  const getJobPicture = (job: any) => {
    if (job.picture) return job.picture;
    if (job.buildingPicture) return job.buildingPicture;
    return buildingPicture;
  };

  const filteredJobs = list?.data.filter((job) =>
    job.position.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // ---------- Modal Handlers ----------
  const openJobModal = async (job: any) => {
    setModalOpen(true);

    console.log("Selected Job:", job); // <-- log di sini
    setSelectedJob(null);

    try {
      const detail: any = await dispatch(
        fetchJobVacancyDetailPublic(job.id)
      ).unwrap();
      setSelectedJob(detail);
    } catch (err) {
      console.error("Failed to load job detail:", err);
    }
  };

  const closeJobModal = () => {
    setSelectedJob(null);
    setModalOpen(false);
  };

  const openFormModal = async (job: any) => {
    console.log("Selected Job:", selectedJob);
    setFormModalOpen(true);

    // Jika detail job belum di-load atau berbeda job, fetch dulu
    if (!selectedJob || selectedJob.id !== job.id) {
      try {
        const detail: any = await dispatch(
          fetchJobVacancyDetailPublic(job.id)
        ).unwrap();
        setSelectedJob(detail);
      } catch (err) {
        console.error("Failed to load job detail:", err);
      }
    }
  };

  const closeFormModal = () => {
    setFormModalOpen(false);
  };

  return (
    <section id="jobs" className="bg-white py-16">
      <div className="max-w-6xl mx-auto px-4">
        <motion.h2
          className="text-3xl font-bold text-center mb-8"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Recruitment
        </motion.h2>

        {/* Search Bar */}
        <div className="flex justify-center mb-12">
          <div className="relative w-full sm:w-4/5 md:w-1/2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Cari posisi..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
            />
          </div>
        </div>

        {loading && <p className="text-center text-gray-500">Loading...</p>}
        {error && <p className="text-center text-red-500">{error}</p>}

        {!loading && !error && (
          <>
            {filteredJobs && filteredJobs.length === 0 ? (
              <p className="text-center text-gray-500 mt-8">
                Tidak ada posisi yang cocok dengan pencarianmu
              </p>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2">
                {filteredJobs?.map((job, index) => (
                  <motion.div
                    key={job.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="flex border rounded-xl shadow hover:shadow-lg p-4 gap-4 transition-transform transform hover:-translate-y-1 cursor-pointer"
                  >
                    <img
                      src={getJobPicture(job)}
                      alt={job.position}
                      className="w-24 h-24 object-cover rounded-lg"
                    />

                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <p className="text-gray-500 text-sm">Dibutuhkan</p>
                        <h3 className="text-lg font-bold">{job.position}</h3>

                        <div className="flex items-center gap-2 text-gray-500 text-sm mt-1">
                          <Building className="w-4 h-4" /> {job.companyName}
                        </div>
                        <div className="flex items-center gap-2 text-gray-500 text-sm mt-1">
                          <MapPin className="w-4 h-4" /> {job.location}
                        </div>
                        <div className="flex items-center gap-2 text-gray-500 text-sm mt-1">
                          <CalendarClock className="w-4 h-4" /> {job.closedDate}
                        </div>
                      </div>

                      {/* Buttons */}
                      <div className="flex justify-end gap-2 mt-2">
                        <button
                          onClick={() => openJobModal(job)}
                          className="bg-teal-500 text-white px-4 py-1 rounded-lg font-semibold hover:bg-teal-600 transition"
                        >
                          Detail
                        </button>
                        <button
                          onClick={() => openFormModal(job)}
                          className="bg-blue-500 text-white px-4 py-1 rounded-lg font-semibold hover:bg-blue-600 transition"
                        >
                          Daftar
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* Modals */}
      {selectedJob && modalOpen && (
        <ModalDetail
          title={selectedJob.position}
          open={modalOpen}
          onClose={closeJobModal}
          data={selectedJob}
          fields={[
            {
              key: "picture",
              label: "",
              type: "custom",
              icon: null,
              render: (value) => (
                <img
                  src={
                    typeof value === "string"
                      ? value
                      : value?.buildingPicture || buildingPicture
                  }
                  alt="Company"
                  className="w-32 h-32 object-cover rounded-lg mx-auto bg-gray-100"
                />
              ),
            },
            { key: "companyName", label: "Perusahaan" },
            { key: "location", label: "Lokasi" },
            { key: "jobType", label: "Tipe Pekerjaan" },
            {
              key: "description",
              label: "Deskripsi",
              type: "custom",
              render: (value) => <p className="text-gray-700">{value}</p>,
            },
            { key: "qualification", label: "Kualifikasi", type: "array" },
            { key: "publishedDate", label: "Tanggal Publish", type: "date" },
            { key: "closedDate", label: "Tanggal Tutup", type: "date" },
          ]}
          width="2xl"
        />
      )}

      <RecruitmentFormModal
        open={formModalOpen}
        onClose={closeFormModal} // gunakan closeFormModal, bukan closeJobModal
        companyId={selectedJob?.companyProfileId} // perhatikan huruf kapital sesuai interface
        jobVacancyId={selectedJob?.id}
      />
    </section>
  );
};

export default JobsListSection;
