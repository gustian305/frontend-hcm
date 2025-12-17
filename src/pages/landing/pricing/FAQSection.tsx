import React, { useState } from "react";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

const faqData = [
  {
    question: "Apakah saya bisa upgrade paket kapan saja?",
    answer:
      "Ya, Anda dapat melakukan upgrade paket kapan saja tanpa kehilangan data. Sistem akan otomatis menyesuaikan fitur sesuai dengan paket baru Anda.",
  },
  {
    question: "Apakah ada masa trial gratis?",
    answer:
      "Kami menyediakan masa trial gratis selama 14 hari untuk mencoba semua fitur premium sebelum Anda memutuskan untuk berlangganan.",
  },
  {
    question: "Bagaimana metode pembayarannya?",
    answer:
      "Kami mendukung berbagai metode pembayaran, termasuk transfer bank, kartu kredit, dan e-wallet populer seperti OVO atau GoPay.",
  },
  {
    question: "Apakah data saya aman?",
    answer:
      "Keamanan data adalah prioritas kami. Seluruh data disimpan di server terenkripsi dan hanya dapat diakses oleh pengguna yang berwenang.",
  },
  {
    question: "Bisakah membatalkan langganan?",
    answer:
      "Tentu saja. Anda dapat membatalkan kapan saja melalui dashboard akun Anda. Tidak ada biaya tambahan untuk pembatalan.",
  },
];

const FAQSection: React.FC = () => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <section id="faq" className="bg-gray-50 py-20 px-4">
      <div className="max-w-3xl mx-auto text-center mb-12">
        <motion.h2
          className="text-3xl md:text-4xl font-bold mb-2 text-gray-900"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          Pertanyaan yang Sering Diajukan
        </motion.h2>
        <motion.p
          className="text-gray-600 max-w-xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          viewport={{ once: true }}
        >
          Pelajari lebih lanjut tentang HUMADIFY dan bagaimana sistem ini
          membantu transformasi manajemen SDM di perusahaan Anda.
        </motion.p>
      </div>

      <div className="max-w-3xl mx-auto space-y-4">
        {faqData.map((item, index) => {
          const isExpanded = expandedIndex === index;
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <div
                className={`bg-white rounded-xl shadow-sm border ${
                  isExpanded ? "bg-teal-50 border-teal-200" : "border-gray-200"
                } overflow-hidden transition-all duration-300`}
              >
                <button
                  className="flex justify-between items-center w-full px-6 py-4 text-left font-semibold text-gray-900 focus:outline-none"
                  onClick={() => toggle(index)}
                >
                  {item.question}
                  <ChevronDown
                    className={`w-5 h-5 text-teal-600 transform transition-transform duration-300 ${
                      isExpanded ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {isExpanded && (
                  <div className="px-6 pb-4 text-gray-700 text-sm leading-relaxed">
                    {item.answer}
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};

export default FAQSection;
