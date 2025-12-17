import React from "react";
import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";
import pricingPlans from "../data/pricingPlan";

const PlanListSection: React.FC = () => {
  return (
    <section
      id="plans"
      className="bg-white py-24 px-4 md:px-8"
    >
      <div className="max-w-7xl mx-auto text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-bold">
          Humadify Plan Package
        </h2>
      </div>

      {/* Horizontal Cards */}
      <div
        className="flex flex-col md:flex-row gap-6 overflow-x-auto pb-4 snap-x snap-mandatory"
      >
        {pricingPlans.map((plan, index) => (
          <motion.div
            key={plan.id}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.15 }}
            viewport={{ once: true }}
            className="snap-center flex-shrink-0 md:flex-1"
          >
            <div
              className={`relative flex flex-col justify-between text-center rounded-xl transition-transform duration-300 bg-teal-50 ${
                plan.highlight
                  ? "border-2 border-teal-600 shadow-lg hover:-translate-y-1 hover:shadow-2xl"
                  : "border border-gray-200 shadow hover:-translate-y-1 hover:shadow-md"
              }`}
            >
              {/* Highlight Label */}
              {plan.highlight && (
                <span className="absolute top-5 right-5 bg-black text-white px-2 py-1 text-xs font-semibold rounded-lg">
                  Most Popular
                </span>
              )}

              <div className="p-8 flex flex-col h-full">
                {/* Plan Name */}
                <h3 className="text-xl font-bold mb-2 text-gray-900">{plan.name}</h3>

                {/* Description */}
                <p className="text-gray-800 mb-4 min-h-[3rem]">{plan.description}</p>

                {/* Price */}
                <p className="text-2xl font-bold mb-6 text-gray-900">
                  {typeof plan.price === "number"
                    ? `Rp.${plan.price.toLocaleString("id-ID")},00/Bulan`
                    : plan.price}
                </p>

                {/* CTA Button */}
                <button className="w-full bg-teal-600 text-white py-2 rounded-lg font-semibold mb-4 hover:bg-teal-700 transition">
                  Beli Paket
                </button>

                {/* Divider Text */}
                <p className="uppercase text-gray-500 text-xs tracking-wide mb-2">Feature</p>

                {/* Features List */}
                <ul className="text-left space-y-2 px-2 md:px-4">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-2 text-gray-800 text-sm">
                      <CheckCircle className="w-4 h-4 text-teal-600 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default PlanListSection;
