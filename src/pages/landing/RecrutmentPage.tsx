// import React, { useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { useDispatch, useSelector } from "react-redux";
// import { AppDispatch, RootState } from "../../store";
// import { fetchJobVacanciesPublic } from "../../store/slices/jobVacancySlice";
// import JobModal from "../../components/modal/JobModal";

import FooterLandingPage from "../../components/layout/FooterLandingPage";
import NavbarLandingPage from "../../components/layout/NavbarLandingPage";
import HeroSectionReqrutment from "./reqrutment/HeroSectionReqrutment";
import JobsListSection from "./reqrutment/JobListSection";

// const JobPage: React.FC = () => {
//   const dispatch = useDispatch<AppDispatch>();
//   const navigate = useNavigate();

//   const { list, loading } = useSelector((state: RootState) => state.jobVacancy);
//   const [selectedJobId, setSelectedJobId] = React.useState<string | null>(null);


//   useEffect(() => {
//     dispatch(fetchJobVacanciesPublic());
//   }, [dispatch]);

//   return (
//     <div className="min-h-screen bg-gray-100">
//       {/* NAVBAR */}
//       <nav className="w-full bg-white shadow px-6 py-4 flex justify-between items-center">
//         <h1
//           className="text-xl font-bold text-blue-600 cursor-pointer"
//           onClick={() => navigate("/")}
//         >
//           MyApp
//         </h1>

//         <button
//           className="text-gray-700 hover:text-blue-600 font-medium"
//           onClick={() => navigate("/job")}
//         >
//           Job
//         </button>
//       </nav>

//       <div className="max-w-4xl mx-auto mt-10 px-4 pb-20">
//         <h2 className="text-3xl font-bold mb-6">Job Vacancies</h2>

//         {loading && <p>Loading jobs...</p>}

//         {!loading && list?.data?.length === 0 && (
//           <p className="text-gray-500">No job vacancies available</p>
//         )}

//         <div className="grid grid-cols-1 gap-6">
//           {list?.data?.map((job) => (
//             <div
//               key={job.id}
//               className="bg-white p-5 rounded-lg shadow hover:shadow-lg transition cursor-pointer"
//               onClick={() => setSelectedJobId(job.id)}
//             >
//               <h3 className="text-xl font-semibold">{job.position}</h3>
//               <p className="text-gray-600">{job.companyName}</p>
//               <p className="text-sm text-gray-500">{job.location}</p>
//               <p className="text-sm text-blue-600 mt-2">
//                 Published: {job.publishedDate}
//               </p>
//               <p className="text-sm text-blue-600 mt-2">
//                 Clossed: {job.closedDate}
//               </p>
//             </div>
//           ))}
//         </div>
//       </div>

//       {selectedJobId && (
//         <JobModal id={selectedJobId} onClose={() => setSelectedJobId(null)} />
//       )}
//     </div>
//   );
// };

// export default JobPage;

const RecruitmentPublicPage: React.FC = () => {
  return (
    <div className="bg-gray-50">
      {/* Navigation Bar */}
      <NavbarLandingPage />

      {/* Hero Section */}
      <HeroSectionReqrutment />

      {/* Jobs List Section */}
      <JobsListSection />

      {/* Footer */}
      <FooterLandingPage />
    </div>
  );
};

export default RecruitmentPublicPage;
