import React, { useState } from "react";
import { motion } from "framer-motion";
import resourcesList from "../data/resourceList";

const categories = ["All", "Artikel", "E-Book", "Webinar", "Case Study"];

const ResourceListSection: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredResources =
    selectedCategory === "All"
      ? resourcesList
      : resourcesList.filter((item) => item.category === selectedCategory);

  return (
    <section id="resources" className="bg-gray-50 py-20 md:py-32">
      <div className="max-w-6xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-2xl md:text-4xl font-bold mb-2">
            Jelajahi <span className="text-teal-600">Wawasan HR</span> & Pembelajaran Terbaru
          </h2>
          <p className="text-gray-600 max-w-xl mx-auto leading-relaxed">
            Temukan artikel, e-book, webinar, dan studi kasus terbaik untuk
            membantu Anda memahami dunia HR yang terus berkembang.
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center items-center gap-3 mb-16">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-1.5 rounded-full font-semibold text-sm transition-colors duration-300 ${
                selectedCategory === category
                  ? "bg-teal-600 text-white"
                  : "bg-transparent text-gray-800 border border-gray-300 hover:bg-teal-100"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Resources Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          {filteredResources.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white rounded-xl shadow-md overflow-hidden flex flex-col hover:shadow-xl transition-all duration-300"
            >
              {/* Thumbnail */}
              <img
                src={item.thumbnail}
                alt={item.title}
                className="h-56 w-full object-cover transition-transform duration-500 hover:scale-105"
              />

              {/* Content */}
              <div className="p-5 flex flex-col flex-1">
                <span className="text-teal-700 bg-teal-100 text-xs font-semibold px-2 py-1 rounded mb-2 inline-block">
                  {item.category}
                </span>
                <h3 className="font-bold text-lg mb-2 line-clamp-2">{item.title}</h3>
                <p className="text-gray-600 mb-3 text-sm line-clamp-3">{item.description}</p>
                <span className="text-gray-500 text-xs mb-3 block">
                  {item.author} • {item.date} • {item.readTime}
                </span>
                <button className="mt-auto px-4 py-2 rounded-lg font-semibold text-sm border border-teal-600 text-teal-600 hover:bg-teal-100 transition-colors duration-300">
                  Baca Selengkapnya
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ResourceListSection;
