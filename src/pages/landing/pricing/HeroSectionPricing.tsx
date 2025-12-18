import React from "react";
import { motion } from "framer-motion";
import BgPricing from "../../../assets/bglandingpage.png";

const HeroSectionPricing: React.FC = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center text-white overflow-hidden">
      {/* Background Image */}
      <img
        src={BgPricing}
        alt="Pricing Background"
        className="absolute top-0 left-0 w-full h-full object-cover z-0 brightness-[0.55]"
      />

      {/* Dark Overlay */}
      <div className="absolute top-0 left-0 w-full h-full bg-black/60 z-10"></div>

      {/* Content */}
      <div className="relative z-20 text-center px-4 sm:px-8 max-w-3xl mx-auto">
        {/* Title */}
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="font-extrabold text-2xl sm:text-3xl md:text-4xl mb-2 tracking-tight"
        >
          Pilih Paket{" "}
          <span className="text-teal-500">Terbaik</span> untuk Tim Anda
        </motion.h2>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="text-white/90 max-w-xl mx-auto mb-12 font-normal leading-relaxed"
        >
          Nikmati fleksibilitas dan fitur lengkap sesuai kebutuhan bisnis Anda — mulai dari
          paket gratis hingga solusi enterprise.
        </motion.p>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <button
            className="px-12 py-3 rounded-xl text-lg font-semibold bg-teal-500 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
          >
            Lihat Paket Harga
          </button>
        </motion.div>
      </div>

      {/* Bottom Gradient */}
      <div className="absolute bottom-0 w-full h-32 bg-gradient-to-t from-black/50 to-transparent z-10"></div>
    </section>
  );
};

export default HeroSectionPricing;
