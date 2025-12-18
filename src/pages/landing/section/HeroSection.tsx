import React from "react";
import { motion } from "framer-motion";
import { Link as ScrollLink } from "react-scroll";
import BgResource from "../../../assets/bglandingpage.png";

const HeroSection: React.FC = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black text-white" id="hero">
      {/* Background Image */}
      <img
        src={BgResource}
        alt="Modern business background"
        loading="lazy"
        className="absolute inset-0 w-full h-full object-cover brightness-[0.55] z-0 transform scale-[1.05] transition-transform duration-[6000ms] ease-linear hover:scale-110"
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/60 z-10" />

      {/* Content */}
      <div className="relative z-20 max-w-6xl px-6 sm:px-10 py-12 text-center md:text-left">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: "easeOut" }}
          viewport={{ once: true }}
        >
          <h1 className="font-bold text-3xl sm:text-[2.6rem] md:text-[3.4rem] max-w-xl mb-2 leading-[1.25]">
            Solusi pintar untuk <br />
            manajemen SDM
          </h1>

          <h2 className="font-semibold text-xl md:text-2xl mb-3 opacity-95">
            Masuk untuk mulai bekerja lebih cerdas
          </h2>

          <p className="text-white/90 max-w-lg mb-4 text-sm md:text-base leading-7">
            Tidak peduli industri atau skala bisnis Anda, HUMADIFY hadir untuk
            menyederhanakan proses HR, meningkatkan efisiensi, dan memperkuat
            produktivitas tim Anda.
          </p>

          <ScrollLink to="recruitment" smooth duration={600} offset={-70}>
            <button className="bg-teal-600 text-white font-semibold px-16 py-3 rounded-lg text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300">
              Get Started
            </button>
          </ScrollLink>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
