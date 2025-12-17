import React from "react";
import { motion } from "framer-motion";

const HeroSectionResources: React.FC = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center text-white overflow-hidden">
      {/* Background Image */}
      <img
        src="/src/pages/public/landing/assets/images/modern-business-buildings 2.png"
        alt="Resources Background"
        className="absolute inset-0 w-full h-full object-cover brightness-[0.55] z-0"
      />

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/60 z-10" />

      {/* Content */}
      <div className="relative z-20 text-center px-6 sm:px-8 max-w-3xl">
        {/* Title */}
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="font-extrabold text-2xl sm:text-3xl md:text-4xl mb-2 tracking-tight"
        >
          Jelajahi{" "}
          <span className="text-teal-400">Sumber Daya & Wawasan</span> dari HUMADIFY
        </motion.h2>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="text-white/90 max-w-xl mx-auto mb-10 font-normal leading-relaxed text-base md:text-lg"
        >
          Temukan artikel, panduan, dan studi kasus terbaru yang dirancang untuk
          membantu tim HR Anda berkembang di era digital.
        </motion.p>

        {/* CTA Button */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
          <button className="px-12 py-3 rounded-lg font-semibold text-lg bg-teal-500 shadow-[0_8px_25px_rgba(0,191,165,0.45)] hover:shadow-[0_10px_30px_rgba(0,191,165,0.6)] hover:-translate-y-1 transition-all duration-300">
            Lihat Semua Artikel
          </button>
        </motion.div>
      </div>

      {/* Bottom Gradient */}
      <div className="absolute bottom-0 w-full h-32 bg-gradient-to-t from-black/50 to-transparent z-10" />
    </section>
  );
};

export default HeroSectionResources;
