import React from "react";

const CTASection: React.FC = () => {
  return (
    <section className="text-center py-20 md:py-32 bg-gradient-to-br from-teal-700 to-teal-900 text-white">
      <div className="max-w-3xl mx-auto px-6">
        <h2 className="text-2xl md:text-4xl font-bold mb-4">
          Siap meningkatkan produktivitas tim Anda?
        </h2>
        <p className="text-white/85 mb-8 text-base md:text-lg">
          Bergabung dengan ribuan perusahaan yang sudah mempercayai Humadify untuk
          mengelola SDM mereka.
        </p>
        <button className="bg-white text-teal-700 font-semibold px-8 py-3 rounded-lg text-lg transition hover:bg-gray-100">
          Mulai Sekarang
        </button>
      </div>
    </section>
  );
};

export default CTASection;
