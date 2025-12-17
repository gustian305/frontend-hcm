import React, { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  CheckCircle,
  Briefcase,
  MapPin,
  Clock,
  DollarSign,
  ArrowLeft,
  Linkedin,
  PhoneCall,
  Twitter,
  PhoneCallIcon,
} from "lucide-react";
import { jobList } from "../data/jobList";
import RecruitmentFormModal from "../../../components/form/RecrutmentFormModal";

const JobDetail: React.FC = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [openForm, setOpenForm] = useState(false);

  const jobData = jobList.find((job) => job.id.toString() === jobId);

  if (!jobData) {
    return (
      <div className="py-24 text-center">
        <h2 className="text-2xl font-bold mb-4">Pekerjaan tidak ditemukan 😢</h2>
        <button
          className="px-6 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition"
          onClick={() => navigate(-1)}
        >
          Kembali
        </button>
      </div>
    );
  }

  const infoCards = [
    { icon: <Briefcase className="text-teal-500 w-6 h-6" />, label: "Tipe", value: jobData.type || "Full Time" },
    { icon: <DollarSign className="text-green-500 w-6 h-6" />, label: "Gaji", value: jobData.salary || "Disesuaikan kemampuan" },
    { icon: <MapPin className="text-red-500 w-6 h-6" />, label: "Lokasi", value: jobData.location },
  ];

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      {/* Hero Section */}
      <motion.div
        className="relative h-56 rounded-xl mb-12 bg-cover bg-center overflow-hidden"
        style={{ backgroundImage: `url(${jobData.image})` }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="absolute inset-0 bg-black/45 flex flex-col items-center justify-center text-center text-white p-4">
          <h1 className="text-2xl sm:text-3xl font-bold">{jobData.title}</h1>
          <p className="text-base">{jobData.company}</p>
        </div>
      </motion.div>

      {/* Header & Info Cards */}
      <motion.div
        className="bg-white rounded-xl border border-gray-200 shadow-md p-6 mb-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex justify-between items-center mb-4">
          <Link to="/recruitment" className="flex items-center gap-2 text-teal-500 hover:text-teal-600">
            <ArrowLeft className="w-4 h-4" /> Kembali
          </Link>
        </div>
        <p className="text-gray-700 mb-4">
          <strong>{jobData.company}</strong> membuka kesempatan berkarier bagi kamu yang siap berkembang sebagai{" "}
          <strong>{jobData.title}</strong> di <strong>{jobData.location}</strong>.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-4">
          {infoCards.map((card, i) => (
            <motion.div
              key={i}
              className="flex items-center gap-3 p-4 border rounded-lg hover:scale-105 transition"
              whileHover={{ scale: 1.02 }}
            >
              {card.icon}
              <div>
                <p className="text-gray-500 text-sm">{card.label}</p>
                <p className="font-semibold">{card.value}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="flex items-center gap-2 text-red-500 text-sm">
          <Clock className="w-4 h-4" /> Batas Lamaran: {jobData.deadline}
        </div>
      </motion.div>

      {/* Deskripsi Pekerjaan */}
      <motion.div
        className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-8"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-lg font-bold mb-3">Deskripsi Pekerjaan</h2>
        <ul className="list-disc pl-5 space-y-1">
          {jobData.description?.map((item, idx) => (
            <li key={idx}>{item}</li>
          ))}
        </ul>
      </motion.div>

      {/* Kualifikasi */}
      <motion.div
        className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-8"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <h2 className="text-lg font-bold mb-3">Kualifikasi</h2>
        <ul className="space-y-1">
          {jobData.qualifications?.map((item, idx) => (
            <li key={idx} className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-500" /> {item}
            </li>
          ))}
        </ul>
      </motion.div>

      {/* Tentang Perusahaan */}
      {jobData.aboutCompany && (
        <motion.div
          className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h2 className="text-lg font-bold mb-3">Tentang Perusahaan</h2>
          <p className="text-gray-700 leading-relaxed">{jobData.aboutCompany}</p>
        </motion.div>
      )}

      {/* CTA */}
      <div className="text-center">
        <button
          onClick={() => setOpenForm(true)}
          className="px-8 py-3 bg-teal-500 hover:bg-teal-600 text-white rounded-lg font-semibold text-lg shadow-lg hover:shadow-xl transition-transform duration-300 transform hover:-translate-y-1"
        >
          Lamar Pekerjaan
        </button>

        {/* Share Buttons */}
        <div className="mt-4">
          <p className="text-gray-500 text-sm mb-2">Bagikan lowongan ini:</p>
          <div className="flex justify-center gap-2">
            <a href="#" className="p-2 bg-gray-100 rounded hover:bg-gray-200 transition">
              <Linkedin className="w-5 h-5 text-blue-600" />
            </a>
            <a href="#" className="p-2 bg-gray-100 rounded hover:bg-gray-200 transition">
              <PhoneCall className="w-5 h-5 text-green-500" />
            </a>
            <a href="#" className="p-2 bg-gray-100 rounded hover:bg-gray-200 transition">
              <Twitter className="w-5 h-5 text-blue-400" />
            </a>
          </div>
        </div>

        <RecruitmentFormModal open={openForm} onClose={() => setOpenForm(false)} />
      </div>
    </div>
  );
};

export default JobDetail;
