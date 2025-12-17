import React from "react";
import { motion } from "framer-motion";

const ProblemSection: React.FC = () => {
  return (
    <section className="py-20 md:py-32 bg-white">
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12 items-center justify-center">
        {/* Illustration */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="flex justify-center"
        >
          <img
            src="/src/pages/public/landing/assets/images/problem-illustration.png"
            alt="The Problem Illustration"
            className="w-full max-w-[420px]"
          />
        </motion.div>

        {/* Text Section */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >

          <h2 className="text-2xl md:text-3xl font-bold mt-2 mb-4 text-gray-900">
            Permasalahan Umum di Manajemen SDM
          </h2>

          <p className="text-gray-500 leading-relaxed max-w-lg">
            Banyak perusahaan masih menghadapi tantangan dalam mengelola SDM
            secara efisien. Mulai dari data karyawan yang tersebar, absensi
            manual, hingga proses payroll yang tidak terintegrasi. Hal ini
            berdampak pada keterlambatan pengambilan keputusan, rendahnya
            efisiensi kerja, serta tingginya risiko kesalahan administrasi.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default ProblemSection;
