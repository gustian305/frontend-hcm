import React from "react";
import { motion } from "framer-motion";

// ===== Mock Data =====
const features = [
  {
    image: "/src/pages/public/landing/assets/images/bg-solution.png",
    title: "Absensi Karyawan",
    desc: "Catat kehadiran secara real-time dengan sistem absensi online yang praktis dan akurat.",
  },
  {
    image: "/src/pages/public/landing/assets/images/bg-solution.png",
    title: "Pengajuan Cuti",
    desc: "Ajukan cuti atau izin dengan mudah dan pantau status persetujuan secara langsung.",
  },
  {
    image: "/src/pages/public/landing/assets/images/bg-solution.png",
    title: "Nilai Update",
    desc: "Lihat penilaian kinerja dan feedback berkala untuk mendukung perkembangan karier.",
  },
  {
    image: "/src/pages/public/landing/assets/images/bg-solution.png",
    title: "Slip Gaji",
    desc: "Akses slip gaji bulanan secara digital, aman, dan kapan saja Anda butuhkan.",
  },
];

const SolutionSection: React.FC = () => {
  return (
    <section className="py-20 md:py-32 bg-gray-50">
      <div className="max-w-6xl mx-auto px-6">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-teal-600 font-semibold tracking-wide uppercase">
            THE SOLUTION
          </span>
          <h2 className="text-2xl md:text-3xl font-bold mt-2 text-gray-900">
            Keunggulan menggunakan Humadify adalah fitur-fitur utama
          </h2>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-8">
          {features.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              viewport={{ once: true }}
              className="bg-white rounded-xl overflow-hidden shadow hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 flex flex-col h-full"
            >
              <img
                src={item.image}
                alt={item.title}
                className="h-44 w-full object-cover"
              />
              <div className="p-5 flex-1 flex flex-col">
                <h3 className="text-lg font-semibold">{item.title}</h3>
                <p className="text-gray-500 mt-2 flex-1">{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SolutionSection;
