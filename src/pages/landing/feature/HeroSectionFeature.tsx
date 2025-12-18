import React from "react";
import { motion } from "framer-motion";
import BgLanding from "../../../assets/bglandingpage.png"

const HeroSectionFeature: React.FC = () => {
  return (
    <section className="relative h-[90vh] md:h-screen flex items-center justify-center text-white overflow-hidden">
      {/* Background Image */}
      <img
        src={BgLanding}
        alt="Background"
        className="absolute inset-0 w-full h-full object-cover z-0 brightness-50"
      />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-black/60 z-10"></div>

      {/* Content */}
      <div className="relative z-20 text-center px-4 sm:px-6 max-w-3xl">
        {/* Title */}
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="font-extrabold text-2xl sm:text-3xl md:text-5xl mb-2 tracking-tight"
        >
          Fitur Unggulan{" "}
          <span className="text-teal-400">Humadify</span>
        </motion.h2>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="text-white/90 max-w-xl mx-auto mb-12 font-normal leading-relaxed text-sm sm:text-base md:text-lg"
        >
          Semua yang Anda butuhkan untuk mengelola SDM — dari absensi hingga payroll — dalam satu platform terintegrasi dan cerdas.
        </motion.p>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <button className="px-10 py-3 bg-teal-400 rounded-lg text-white font-semibold text-base sm:text-lg shadow-[0_8px_25px_rgba(0,191,165,0.45)] hover:shadow-[0_10px_30px_rgba(0,191,165,0.6)] hover:-translate-y-1 transition-all duration-300">
            Jelajahi Semua Fitur
          </button>
        </motion.div>
      </div>

      {/* Bottom Gradient */}
      <div className="absolute bottom-0 w-full h-32 bg-gradient-to-t from-black/50 to-transparent z-10"></div>
    </section>
  );
};

export default HeroSectionFeature;
