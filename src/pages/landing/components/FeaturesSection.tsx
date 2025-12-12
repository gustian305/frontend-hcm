import { motion } from "framer-motion";
import { Menu } from "lucide-react";
import FeatureImage from "../../../assets/bg-solution.png";

const featureDetails = [
  {
    title: "Pencarian yang Cepat",
    desc: "Dapatkan hasil pencarian cepat dan akurat dengan fitur pencarian yang mudah digunakan.",
  },
  {
    title: "Pencarian yang Cepat",
    desc: "Dapatkan hasil pencarian cepat dan akurat dengan fitur pencarian yang mudah digunakan.",
  }
];

const FeaturesSection = () => {
  return (
    <section className="py-20 md:py-32 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-primary font-semibold tracking-wider text-sm">
            FEATURE HIGHLIGHTS
          </p>
          <h2 className="text-3xl md:text-4xl font-bold mt-2 text-gray-900">
            Temukan Fitur Unggulan Kami
          </h2>
          <p className="text-gray-600 max-w-xl mx-auto mt-4 leading-relaxed">
            Setiap fitur dirancang untuk meningkatkan efisiensi kerja dan
            membantu tim HR Anda bekerja lebih cerdas, bukan lebih keras.
          </p>
        </motion.div>

        {/* Features */}
        {featureDetails.map((feature, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: index * 0.15 }}
            viewport={{ once: true }}
            className="grid md:grid-cols-2 gap-10 md:gap-16 items-center mb-24"
          >
            {/* Image */}
            <div
              className={`order-1 ${
                index % 2 !== 0 ? "md:order-2" : "md:order-1"
              }`}
            >
              <motion.img
                whileHover={{ scale: 1.03 }}
                src={FeatureImage}
                alt={feature.title}
                className="rounded-2xl w-full shadow-xl"
              />
            </div>

            {/* Content */}
            <div
              className={`order-2 ${
                index % 2 !== 0 ? "md:order-1" : "md:order-2"
              }`}
            >
              <div className="flex items-center gap-3 mb-4 text-primary">
                <Menu />
                <span className="px-3 py-1 text-xs bg-primary/20 text-primary font-semibold rounded-full">
                  Fitur #{index + 1}
                </span>
              </div>

              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                {feature.title}
              </h3>

              <p className="text-gray-600 leading-relaxed max-w-lg">
                {feature.desc}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default FeaturesSection;