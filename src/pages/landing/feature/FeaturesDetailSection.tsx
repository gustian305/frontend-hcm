import React from "react";
import { motion } from "framer-motion";
import * as LucideIcons from "lucide-react";
import { featureDetails } from "../data/featureDetail";

export interface FeatureDetail {
  icon: string;
  title: string;
  desc: string;
  image: string;
}

const FeaturesDetailSection: React.FC = () => {
  return (
    <section className="py-20 md:py-32 bg-gray-50">
      <div className="max-w-6xl mx-auto px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-24"
        >
          <span className="text-teal-600 font-semibold tracking-wide uppercase">
            FEATURE HIGHLIGHTS
          </span>
          <h2 className="text-2xl md:text-4xl font-bold mt-2 mb-2 text-gray-900">
            Temukan Fitur Unggulan Kami
          </h2>
          <p className="text-gray-600 max-w-xl mx-auto leading-relaxed">
            Setiap fitur dirancang untuk meningkatkan efisiensi kerja dan
            membantu tim HR Anda bekerja lebih cerdas, bukan lebih keras.
          </p>
        </motion.div>

        {/* Features Grid */}
        {featureDetails.map((feature, index) => {
          // Ambil komponen ikon dari lucide-react
          const FeatureIcon = (LucideIcons as any)[feature.icon];

          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: index * 0.15 }}
              viewport={{ once: true }}
              className={`flex flex-col md:flex-row items-center mb-24 md:mb-32 ${
                index % 2 !== 0 ? "md:flex-row-reverse" : ""
              }`}
            >
              {/* Image */}
              <motion.img
                whileHover={{ scale: 1.03 }}
                src={feature.image}
                alt={feature.title}
                className="w-full md:w-1/2 rounded-xl shadow-lg transition-all duration-300"
              />

              {/* Description */}
              <div className="md:w-1/2 md:px-10 mt-8 md:mt-0">
                {/* Icon and Tag */}
                <div className="flex items-center gap-4 mb-6 text-teal-600">
                  {FeatureIcon && <FeatureIcon size={36} />}
                  <span className="bg-teal-300 text-teal-900 text-sm font-semibold px-2 py-1 rounded">
                    Fitur #{index + 1}
                  </span>
                </div>

                <h3 className="text-xl md:text-2xl font-bold mb-2 text-gray-900">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed text-base md:text-lg max-w-xl">
                  {feature.desc}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};

export default FeaturesDetailSection;
