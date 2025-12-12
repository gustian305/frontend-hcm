import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store";
import { fetchJobVacancyDetailPublic, resetDetail } from "../../store/slices/jobVacancySlice";

interface JobModalProps {
  id: string | null;
  onClose: () => void;
}

const JobModal: React.FC<JobModalProps> = ({ id, onClose }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { detail, loading } = useSelector((state: RootState) => state.jobVacancy);

  useEffect(() => {
    if (id) {
      dispatch(fetchJobVacancyDetailPublic(id));
    }

    return () => {
      dispatch(resetDetail());
    };
  }, [id, dispatch]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-start pt-20 z-50">
      <div className="bg-white w-full max-w-xl rounded-lg shadow-lg p-6 relative animate-fadeIn">
        
        {/* CLOSE BUTTON */}
        <button
          className="absolute top-3 right-3 text-gray-600 hover:text-red-500 text-xl"
          onClick={onClose}
        >
          ✕
        </button>

        {/* LOADING */}
        {loading && <p className="text-center py-10">Loading...</p>}

        {/* DETAIL CONTENT */}
        {!loading && detail && (
          <>
            <h2 className="text-2xl font-bold mb-2">{detail.position}</h2>
            <p className="text-gray-600 mb-1">{detail.companyName}</p>
            <p className="text-gray-500 mb-4">{detail.location}</p>

            {detail.picture && (
              <img
                src={detail.picture}
                alt="company"
                className="w-full h-40 object-cover rounded-lg mb-4"
              />
            )}

            <div className="mb-4">
              <h3 className="font-semibold mb-1">Job Type</h3>
              <p className="text-gray-700">{detail.jobType}</p>
            </div>

            <div className="mb-4">
              <h3 className="font-semibold mb-1">Description</h3>
              <p className="text-gray-700 whitespace-pre-line">{detail.description}</p>
            </div>

            <div className="mb-4">
              <h3 className="font-semibold mb-1">Qualifications</h3>
              <ul className="list-disc ml-6 text-gray-700">
                {detail.qualification.map((q, i) => (
                  <li key={i}>{q}</li>
                ))}
              </ul>
            </div>

            <div className="text-sm text-gray-500">
              <p>Published: {detail.publishedDate}</p>
              <p>Closed: {detail.closedDate}</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default JobModal;
