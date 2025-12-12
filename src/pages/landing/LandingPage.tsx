import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store";
import { fetchJobVacanciesPublic } from "../../store/slices/jobVacancySlice";

import JobModal from "../../components/modal/JobModal";
import NavbarLanding from "./components/NavbarLanding";
import HeroLanding from "./components/HeroLanding";
import JobList from "./components/JobList";

const LandingPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  const { list, loading } = useSelector((state: RootState) => state.jobVacancy);
  const [selectedJobId, setSelectedJobId] = React.useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchJobVacanciesPublic());
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-gray-100 text-gray-800">
      {/* NAVBAR */}
      <NavbarLanding />

      {/* HERO SECTION */}
      <div className="relative py-15">
        <HeroLanding />
      </div>

      {/* JOB SECTION */}
      <JobList
        list={list?.data || []}
        loading={loading}
        onSelect={(id) => setSelectedJobId(id)}
      />
      {selectedJobId && (
        <JobModal id={selectedJobId} onClose={() => setSelectedJobId(null)} />
      )}
    </div>
  );
};

export default LandingPage;
