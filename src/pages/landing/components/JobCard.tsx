interface JobCardProps {
  job: any;
  onClick: () => void;
}

const JobCard: React.FC<JobCardProps> = ({ job, onClick }) => {
  return (
    <div
      className="bg-white p-5 rounded-lg shadow hover:shadow-lg transition cursor-pointer"
      onClick={onClick}
    >
      <h3 className="text-xl font-semibold">{job.position}</h3>
      <p className="text-gray-600">{job.companyName}</p>
      <p className="text-sm text-gray-500">{job.location}</p>
      <p className="text-sm text-blue-600 mt-2">
        Published: {job.publishedDate}
      </p>
      <p className="text-sm text-blue-600 mt-2">Closed: {job.closingDate}</p>
    </div>
  );
};

export default JobCard;
