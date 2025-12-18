import React from "react";
import { motion } from "framer-motion";
import BgRecruitment from "../../../assets/bglandingpage.png"

const HeroSectionReqrutment: React.FC = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center text-white overflow-hidden">
      {/* Background Image */}
      <img
        src={BgRecruitment}
        alt="Recruitment Background"
        className="absolute top-0 left-0 w-full h-full object-cover z-1 brightness-[0.55]"
      />

      {/* Dark Overlay */}
      <div className="absolute top-0 left-0 w-full h-full bg-black/60 z-2" />

      {/* Content */}
      <div className="relative z-3 text-center px-4 sm:px-8 max-w-3xl mx-auto">
        {/* Title */}
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="font-extrabold text-2xl sm:text-3xl md:text-4xl mb-2 tracking-tight"
        >
          Telusuri Semua{" "}
          <span className="text-teal-400">Lowongan & Karier</span> di HUMADIFY
        </motion.h2>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="text-white/90 max-w-xl mx-auto mb-5 text-base sm:text-lg leading-relaxed font-normal"
        >
          Sesuaikan fitur dan kapasitas sesuai skala tim Anda, dari individu
          hingga perusahaan besar. Mari tumbuh bersama kami!
        </motion.p>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <a
            href="#jobs"
            className="inline-block px-10 py-3 bg-teal-500 hover:bg-teal-600 rounded-lg font-semibold text-white text-lg shadow-lg hover:shadow-xl transition-transform duration-300 transform hover:-translate-y-1"
          >
            Lihat Lowongan
          </a>
        </motion.div>
      </div>

      {/* Bottom Gradient */}
      <div className="absolute bottom-0 w-full h-32 bg-gradient-to-t from-black/50 to-transparent" />
    </section>
  );
};

export default HeroSectionReqrutment;
