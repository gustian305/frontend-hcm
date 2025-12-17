import React, { useState } from "react";
import { motion } from "framer-motion";

interface FAQItem {
  question: string;
  answer: string;
}

const faqData: FAQItem[] = [
  {
    question: "Apa itu HCM?",
    answer:
      "HCM (Human Capital Management) adalah sistem manajemen sumber daya manusia yang membantu perusahaan dalam mengelola karyawan secara lebih efisien dan terintegrasi.",
  },
  {
    question: "Kenapa HCM penting?",
    answer:
      "Dengan HCM, perusahaan dapat meningkatkan produktivitas karyawan, efisiensi administrasi HR, serta mendukung pengambilan keputusan berbasis data.",
  },
  {
    question: "Apakah HUMADIFY hadir untuk solusi terpadu?",
    answer:
      "Ya, HUMADIFY dari Humadify menyediakan platform all-in-one untuk absensi, cuti, penilaian, hingga penggajian, semua dalam satu dashboard.",
  },
  {
    question: "Apa saja modul HCM yang terdapat di HUMADIFY ini?",
    answer:
      "Beberapa modul utama meliputi Absensi Karyawan, Pengajuan Cuti, Penilaian Kinerja, dan Penggajian Otomatis.",
  },
  {
    question: "Untuk fitur keunggulannya ada apa saja?",
    answer:
      "Manajemen data karyawan terpusat & aman, dashboard interaktif, dan sistem berbasis cloud untuk kemudahan akses di mana saja.",
  },
];

const FAQSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section
      id="faq"
      className="bg-gray-50 py-20 px-4 md:px-0"
    >
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-3 text-gray-900">
            Pertanyaan yang Sering Diajukan
          </h2>
          <p className="text-gray-600 text-base md:text-lg">
            Pelajari lebih lanjut tentang HUMADIFY dan bagaimana sistem ini membantu transformasi manajemen SDM di perusahaan Anda.
          </p>
        </motion.div>

        <div className="border-t border-gray-200 mb-8" />

        {/* FAQ Items */}
        <div className="space-y-4">
          {faqData.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <div
                className={`bg-white rounded-xl shadow transition-all duration-300 ${
                  openIndex === index
                    ? "bg-teal-50 shadow-lg"
                    : "hover:shadow-md"
                }`}
              >
                <button
                  className="w-full text-left px-5 py-4 font-semibold text-gray-900 flex justify-between items-center"
                  onClick={() => toggleFAQ(index)}
                >
                  {item.question}
                  <span className="ml-4 text-teal-600 text-xl">
                    {openIndex === index ? "−" : "+"}
                  </span>
                </button>
                {openIndex === index && (
                  <div className="px-5 pb-4 text-gray-600 text-sm md:text-base">
                    {item.answer}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
