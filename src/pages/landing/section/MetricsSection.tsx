import React from "react";
import { motion } from "framer-motion";

const metrics = [
  { value: "1M+", label: "Customers visit Humadify every month" },
  { value: "93%", label: "Satisfaction rate from our customers" },
  { value: "4.9", label: "Average customer ratings out of 5.00!" },
];

const MetricsSection: React.FC = () => {
  return (
    <section className="py-16 md:py-20 bg-white border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-3 gap-8 justify-center items-center text-center">
        {metrics.map((metric, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: index * 0.15 }}
          >
            <h3 className="text-2xl md:text-[2.8rem] font-bold text-teal-600 mb-1">
              {metric.value}
            </h3>
            <p className="text-gray-500 max-w-xs mx-auto leading-relaxed">
              {metric.label}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default MetricsSection;
