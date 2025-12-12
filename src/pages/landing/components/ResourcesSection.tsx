import { useState } from "react";
import { motion } from "framer-motion";

const resourcesList = [
    {
        id: "1",
        title: "Artikel",
        category: "Artikel",
        description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatum.",
        author: "John Doe",
        thumbnail: "https://images.unsplash.com/photo-1472099645785-99de5e6e1e33?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
        link: "#",
        date: "2023-01-01",
        readTime: "5 menit",
    },
    {
        id: "2",
        title: "E-Book",
        category: "E-Book",
        description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatum.",
        author: "John Doe",
        thumbnail: "https://images.unsplash.com/photo-1472099645785-99de5e6e1e33?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
        link: "#",
        date: "2023-01-01",
        readTime: "5 menit",
    },
    {
        id: "3",
        title: "Webinar",
        category: "Webinar",
        description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatum.",
        author: "John Doe",
        thumbnail: "https://images.unsplash.com/photo-1472099645785-99de5e6e1e33?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
        link: "#",
        date: "2023-01-01",
        readTime: "5 menit",
    },
    {
        id: "4",
        title: "Case Study",
        category: "Case Study",
        description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatum.",
        author: "John Doe",
        thumbnail: "https://images.unsplash.com/photo-1472099645785-99de5e6e1e33?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
        link: "#",
        date: "2023-01-01",
        readTime: "5 menit",
    },
]

const categories = ["All", "Artikel", "E-Book", "Webinar", "Case Study"];

export default function ResourcesSection() {
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredResources =
    selectedCategory === "All"
      ? resourcesList
      : resourcesList.filter((item) => item.category === selectedCategory);

  return (
    <section id="resources" className="bg-[#F8FBFB] py-16 md:py-24">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-3">
            Jelajahi <span className="text-emerald-600">Wawasan HR</span> &
            Pembelajaran Terbaru
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Temukan artikel, e-book, webinar, dan studi kasus terbaik untuk
            memahami dunia HR yang terus berkembang.
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-1.5 text-sm font-semibold rounded-xl border transition-all duration-300
                ${
                  selectedCategory === category
                    ? "bg-emerald-600 text-white border-emerald-600"
                    : "border-gray-300 text-gray-700 hover:bg-emerald-50"
                }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-6">
          {filteredResources.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all overflow-hidden"
            >
              {/* Thumbnail */}
              <div className="h-52 w-full overflow-hidden">
                <img
                  src={item.thumbnail}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                />
              </div>

              {/* Content */}
              <div className="p-5">
                <span className="inline-block text-sm font-semibold bg-emerald-100 text-emerald-700 px-3 py-1 rounded-lg mb-2">
                  {item.category}
                </span>

                <h3 className="text-lg font-bold line-clamp-2 mb-2">
                  {item.title}
                </h3>
                <p className="text-gray-600 text-sm line-clamp-3 mb-3">
                  {item.description}
                </p>

                <p className="text-xs text-gray-500 mb-4">
                  {item.author} • {item.date} • {item.readTime}
                </p>

                <button className="text-emerald-600 border border-emerald-600 px-4 py-1.5 text-sm rounded-xl font-semibold hover:bg-emerald-50 transition-all">
                  Baca Selengkapnya
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
