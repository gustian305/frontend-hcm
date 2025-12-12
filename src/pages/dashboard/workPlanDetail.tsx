import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store";
import { detailWorkPlan } from "../../store/slices/workPlanTaskSlice";

const WorkPlanDetailPage: React.FC = () => {
  const { workPlanId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const { workPlanDetail, loading, error } = useSelector(
    (state: RootState) => state.workPlanTask
  );

  // Fetch detail saat halaman dibuka
  useEffect(() => {
    if (workPlanId) {
      dispatch(detailWorkPlan(workPlanId));
    }
  }, [dispatch, workPlanId]);

  // Error state
  if (error) {
    return (
      <div className="p-6 text-red-500">
        Failed to load work plan detail: {error}
      </div>
    );
  }

  // Jika belum ada data (tetapi loading), tampilkan skeleton
  if (!workPlanDetail) {
    return (
      <div className="p-6 text-gray-500">
        {loading ? "Loading..." : "Work Plan not found."}
      </div>
    );
  }

  return (
    <div className="p-6">

      {/* Header */}
      <h1 className="text-2xl font-bold mb-4">{workPlanDetail.name}</h1>

      {/* Work Plan Info */}
      <div className="bg-white p-5 rounded-lg shadow mb-6">
        <p>
          <strong>Description:</strong> {workPlanDetail.description}
        </p>
        <p>
          <strong>Status:</strong> {workPlanDetail.status}
        </p>
        <p>
          <strong>Start Date:</strong> {workPlanDetail.startDate}
        </p>
        <p>
          <strong>End Date:</strong> {workPlanDetail.endDate}
        </p>
        <p>
          <strong>Created By:</strong> {workPlanDetail.createdBy}
        </p>

        {/* DepartmentList[] */}
        <div className="mt-2">
          <strong>Departments:</strong>
          {workPlanDetail.department && workPlanDetail.department.length > 0 ? (
            <ul className="ml-5 list-disc">
              {workPlanDetail.department.map((dep) => (
                <li key={dep.id}>{dep.name}</li>
              ))}
            </ul>
          ) : (
            <p className="italic text-gray-500">No department linked</p>
          )}
        </div>
      </div>

      {/* Jika nanti ada tasks, bagian task bisa ditambahkan di sini */}
      <h2 className="text-xl font-semibold mb-2">Tasks</h2>
      <p className="text-gray-400 italic">Task list belum di-setup.</p>
    </div>
  );
};

export default WorkPlanDetailPage;
