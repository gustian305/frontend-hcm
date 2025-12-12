const HeroSection = () => {
  return (
    <section className="pt-32 pb-20 bg-gradient-to-r from-blue-50 to-purple-50">
      <div className="max-w-6xl mx-auto px-6 text-center flex flex-col items-center">
        <h1 className="text-4xl md:text-6xl font-extrabold text-gray-800 leading-tight">
          Welcome to <span className="text-blue-600">Humadify</span>
        </h1>

        <p className="mt-4 text-gray-600 text-lg md:text-xl max-w-2xl">
          Simplify your hiring process, find top talent, and build a better
          workplace.
        </p>

        <div className="flex gap-4 mt-8">
          <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium">
            Get Started
          </button>
          <button className="px-6 py-3 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 transition font-medium">
            Learn More
          </button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
