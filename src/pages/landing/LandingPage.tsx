import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { AppDispatch, RootState } from "../../store";
import { fetchJobVacanciesPublic } from "../../store/slices/jobVacancySlice";
import JobModal from "../../components/modal/JobModal";

const LandingPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const { list, loading } = useSelector((state: RootState) => state.jobVacancy);
  const [selectedJobId, setSelectedJobId] = React.useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchJobVacanciesPublic());
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-gray-100 text-gray-800">
      {/* NAVBAR */}
      <nav className="w-full bg-white shadow px-6 py-4 flex justify-between items-center">
        <h1
          className="text-xl font-bold text-blue-600 cursor-pointer"
          onClick={() => navigate("/")}
        >
          MyApp
        </h1>

        <div className="flex gap-6">
          <button
            onClick={() => navigate("/job")}
            className="text-gray-700 hover:text-blue-600 font-medium"
          >
            Job
          </button>

          <button
            onClick={() => navigate("/login")}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Login
          </button>
        </div>
      </nav>

      {/* HERO SECTION */}
      <div className="flex flex-col justify-center items-center text-center py-20 bg-gradient-to-r from-blue-500 to-purple-600 text-white">
        <h2 className="text-5xl font-bold mb-4">Welcome to MyApp</h2>
        <p className="text-lg mb-8">Find your next career opportunity here!</p>
      </div>

      {/* JOB SECTION */}
      <div className="max-w-4xl mx-auto mt-10 px-4 pb-20">
        <h3 className="text-2xl font-bold mb-4">Latest Job Vacancies</h3>

        {loading && <p>Loading jobs...</p>}

        {!loading && list?.data?.length === 0 && (
          <p className="text-gray-500">No jobs available</p>
        )}

        <div className="grid grid-cols-1 gap-6">
          {list?.data?.map((job) => (
            <div
              key={job.id}
              className="bg-white p-5 rounded-lg shadow hover:shadow-lg transition cursor-pointer"
              onClick={() => setSelectedJobId(job.id)}
            >
              <h3 className="text-xl font-semibold">{job.position}</h3>
              <p className="text-gray-600">{job.companyName}</p>
              <p className="text-sm text-gray-500">{job.location}</p>
              <p className="text-sm text-blue-600 mt-2">
                Published: {job.publishedDate}
              </p>
              <p className="text-sm text-blue-600 mt-2">
                Clossed: {job.closedDate}
              </p>
            </div>
          ))}
        </div>
      </div>
      {selectedJobId && (
        <JobModal id={selectedJobId} onClose={() => setSelectedJobId(null)} />
      )}
    </div>
  );
};

export default LandingPage;
