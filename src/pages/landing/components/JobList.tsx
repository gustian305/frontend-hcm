import JobCard from "./JobCard";

interface JobListProps {
  list: any[];
  loading: boolean;
  onSelect: (id: string) => void;
}

const JobList: React.FC<JobListProps> = ({ list, loading, onSelect }) => {
  return (
    <div className="max-w-4xl mx-auto mt-10 px-4 pb-20">
      <h3 className="text-2xl font-bold mb-4">Latest Job Vacancies</h3>

      {loading && <p>Loading jobs...</p>}

      {!loading && list?.length === 0 && (
        <p className="text-gray-500">No jobs available</p>
      )}

      <div className="grid grid-cols-1 gap-6">
        {list?.map((job) => (
          <JobCard key={job.id} job={job} onClick={() => onSelect(job.id)} />
        ))}
      </div>
    </div>
  );
};

export default JobList;
