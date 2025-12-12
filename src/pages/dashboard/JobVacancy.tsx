// src/pages/JobVacancy.tsx
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store";
import {
  JobVacancyInfo,
  JobVacancyRequest,
} from "../../service/jobVacancyService";
import {
  createJobVacancy,
  deleteJobVacancy,
  fetchJobVacancies,
  fetchJobVacancyDetail,
  resetDetail,
  updateJobVacancy,
} from "../../store/slices/jobVacancySlice";
import Table, { Column } from "../../components/table/TableData";
import ModalForm from "../../components/modal/FormModal";
import ModalDetail from "../../components/modal/DetailModal";
import { formatDate } from "../../utils/date";
import Button from "../../components/button/Button";

const JobVacancy: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  const { list, detail, loading } = useSelector(
    (state: RootState) => state.jobVacancy
  );

  const [openCreate, setOpenCreate] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDetail, setOpenDetail] = useState(false);

  const [editId, setEditId] = useState<string | null>(null);

  // Default form values
  const defaultForm: JobVacancyRequest = {
    location: "",
    position: "",
    jobType: "",
    description: "",
    qualifications: [],
    publishedDate: "",
    closedDate: "",
  };

  const [formValues, setFormValues] = useState<JobVacancyRequest>(defaultForm);

  // Fetch data on load
  useEffect(() => {
    dispatch(fetchJobVacancies());
  }, [dispatch]);

  // Table Columns
  const columns: Column<JobVacancyInfo>[] = [
    { header: "Posisi", accessor: "position" },
    { header: "Lokasi", accessor: "location" },
    { header: "Tipe Pekerjaan", accessor: "jobType" },
    {
      header: "Diterbitkan",
      accessor: (row) => formatDate(row.publishedDate),
    },
    {
      header: "Ditutup",
      accessor: (row) => formatDate(row.closedDate),
    },
  ];

  // Actions for each row
  const actions = (row: JobVacancyInfo) => (
    <div className="flex gap-2">
      <Button
        label="Detail"
        className="flex items-center gap-2 px-2 py-1 rounded-sm text-white hover:opacity-70 transition-all"
        // icon={<Plus size={18} />}
        bgColor="#189AB4"
        onClick={async () => {
          await dispatch(fetchJobVacancyDetail(row.id));
          setOpenDetail(true);
        }}
      />
      <Button
        label="Edit"
        className="flex items-center gap-2 px-2 py-1 rounded-sm text-white hover:opacity-70 transition-all"
        // icon={<Plus size={18} />}
        bgColor="#eab308"
        onClick={() => {
          setEditId(row.id);
          setFormValues({
            location: row.location,
            position: row.position,
            jobType: row.jobType,
            description: row.description,
            qualifications: row.qualification,
            publishedDate: row.publishedDate,
            closedDate: row.closedDate,
          });
          setOpenEdit(true);
        }}
      />
      <Button
        label="Hapus"
        className="flex items-center gap-2 px-2 py-1 rounded-sm text-white hover:opacity-70 transition-all"
        // icon={<Plus size={18} />}
        bgColor="#ef4444"
        onClick={() => {
          if (!confirm("Hapus Lowongan Pekerjaan?")) return;
          dispatch(deleteJobVacancy(row.id)).then(() =>
            dispatch(fetchJobVacancies())
          );
        }}
      />
    </div>
  );

  // Submit Create
  const handleCreate = async (values: JobVacancyRequest) => {
    await dispatch(createJobVacancy(values));
    await dispatch(fetchJobVacancies());
  };

  // Submit Update
  const handleUpdate = async (values: JobVacancyRequest) => {
    if (!editId) return;
    await dispatch(updateJobVacancy({ id: editId, payload: values }));
    await dispatch(fetchJobVacancies());
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Job Vacancy</h1>
      {/* Header */}
      <div className="flex justify-between items-center">
        <Button
          label="Tambah Lowongan Pekerjaan"
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-white hover:opacity-70 transition-all"
          // icon={<Plus size={18} />}
          bgColor="#189AB4"
          onClick={() => {
            setFormValues(defaultForm);
            setOpenCreate(true);
          }}
        />
      </div>

      {/* Table */}
      <div className="mt-4">
        {loading ? (
          <div className="text-center py-10">Loading...</div>
        ) : (
          <Table<JobVacancyInfo>
            columns={columns}
            data={list?.data || []}
            actions={actions}
          />
        )}
      </div>

      {/* Modal Create */}
      {openCreate && (
        <ModalForm<JobVacancyRequest>
          title="Create Job Vacancy"
          initialValues={formValues}
          onSubmit={handleCreate}
          onClose={() => setOpenCreate(false)}
        >
          {(values, setValues) => {
            const [newQualification, setNewQualification] = useState("");

            const addQualification = () => {
              if (!newQualification.trim()) return;
              setValues({
                ...values,
                qualifications: [
                  ...values.qualifications,
                  newQualification.trim(),
                ],
              });
              setNewQualification("");
            };

            const removeQualification = (index: number) => {
              const updated = [...values.qualifications];
              updated.splice(index, 1);
              setValues({ ...values, qualifications: updated });
            };

            return (
              <div className="flex flex-col gap-4">
                {/* Position */}
                <div>
                  <label className="block font-medium mb-1">Position</label>
                  <input
                    type="text"
                    className="w-full border px-3 py-2 rounded"
                    value={values.position}
                    onChange={(e) =>
                      setValues({ ...values, position: e.target.value })
                    }
                    required
                  />
                </div>

                {/* Location */}
                <div>
                  <label className="block font-medium mb-1">Location</label>
                  <input
                    type="text"
                    className="w-full border px-3 py-2 rounded"
                    value={values.location}
                    onChange={(e) =>
                      setValues({ ...values, location: e.target.value })
                    }
                    required
                  />
                </div>

                {/* Job Type */}
                <div>
                  <label className="block font-medium mb-1">Job Type</label>
                  <input
                    type="text"
                    className="w-full border px-3 py-2 rounded"
                    value={values.jobType}
                    onChange={(e) =>
                      setValues({ ...values, jobType: e.target.value })
                    }
                    required
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block font-medium mb-1">Description</label>
                  <textarea
                    className="w-full border px-3 py-2 rounded"
                    value={values.description}
                    onChange={(e) =>
                      setValues({ ...values, description: e.target.value })
                    }
                  />
                </div>

                {/* Qualifications — ADD/REMOVE */}
                <div className="flex flex-col gap-1">
                  <span className="text-sm font-medium text-gray-700">
                    Qualifications
                  </span>

                  <div className="flex gap-2">
                    <input
                      className="border px-3 py-2 rounded-lg flex-1"
                      placeholder="Insert qualification"
                      value={newQualification}
                      onChange={(e) => setNewQualification(e.target.value)}
                    />
                    <button
                      type="button"
                      onClick={addQualification}
                      className="px-3 py-2 bg-indigo-500 text-white rounded-lg"
                    >
                      Tambah
                    </button>
                  </div>

                  <div className="flex flex-col gap-1 mt-2">
                    {values.qualifications.map((q: string, i: number) => (
                      <div
                        key={i}
                        className="flex justify-between items-center bg-gray-100 px-3 py-2 rounded"
                      >
                        <span>{q}</span>
                        <button
                          type="button"
                          onClick={() => removeQualification(i)}
                          className="text-red-600"
                        >
                          Hapus
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Published Date */}
                <label className="flex flex-col gap-1">
                  <span className="text-sm font-medium text-gray-700">
                    Published Date
                  </span>
                  <input
                    type="date"
                    className="border px-3 py-2 rounded-lg"
                    value={values.publishedDate}
                    onChange={(e) =>
                      setValues({ ...values, publishedDate: e.target.value })
                    }
                  />
                </label>

                {/* Closed Date */}
                <label className="flex flex-col gap-1">
                  <span className="text-sm font-medium text-gray-700">
                    Closed Date
                  </span>
                  <input
                    type="date"
                    className="border px-3 py-2 rounded-lg"
                    value={values.closedDate}
                    onChange={(e) =>
                      setValues({ ...values, closedDate: e.target.value })
                    }
                  />
                </label>
              </div>
            );
          }}
        </ModalForm>
      )}

      {/* Modal Edit */}
      {openEdit && (
        <ModalForm<JobVacancyRequest>
          title="Edit Job Vacancy"
          initialValues={formValues}
          onSubmit={handleUpdate}
          onClose={() => setOpenEdit(false)}
        >
          {(values, setValues) => {
            const [newQualification, setNewQualification] = useState("");

            const addQualification = () => {
              if (!newQualification.trim()) return;
              setValues({
                ...values,
                qualifications: [
                  ...values.qualifications,
                  newQualification.trim(),
                ],
              });
              setNewQualification("");
            };

            const removeQualification = (index: number) => {
              const updated = [...values.qualifications];
              updated.splice(index, 1);
              setValues({ ...values, qualifications: updated });
            };

            return (
              <div className="flex flex-col gap-4">
                {/* Position */}
                <div>
                  <label className="block font-medium mb-1">Position</label>
                  <input
                    type="text"
                    className="w-full border px-3 py-2 rounded"
                    value={values.position}
                    onChange={(e) =>
                      setValues({ ...values, position: e.target.value })
                    }
                  />
                </div>

                {/* Location */}
                <div>
                  <label className="block font-medium mb-1">Location</label>
                  <input
                    type="text"
                    className="w-full border px-3 py-2 rounded"
                    value={values.location}
                    onChange={(e) =>
                      setValues({ ...values, location: e.target.value })
                    }
                  />
                </div>

                {/* Job Type */}
                <div>
                  <label className="block font-medium mb-1">Job Type</label>
                  <input
                    type="text"
                    className="w-full border px-3 py-2 rounded"
                    value={values.jobType}
                    onChange={(e) =>
                      setValues({ ...values, jobType: e.target.value })
                    }
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block font-medium mb-1">Description</label>
                  <textarea
                    className="w-full border px-3 py-2 rounded"
                    value={values.description}
                    onChange={(e) =>
                      setValues({ ...values, description: e.target.value })
                    }
                  />
                </div>

                {/* Qualification Add/Remove */}
                <div className="flex flex-col gap-1">
                  <span className="text-sm font-medium text-gray-700">
                    Qualifications
                  </span>

                  <div className="flex gap-2">
                    <input
                      className="border px-3 py-2 rounded-lg flex-1"
                      placeholder="Insert qualification"
                      value={newQualification}
                      onChange={(e) => setNewQualification(e.target.value)}
                    />
                    <button
                      type="button"
                      onClick={addQualification}
                      className="px-3 py-2 bg-indigo-500 text-white rounded-lg"
                    >
                      Tambah
                    </button>
                  </div>

                  <div className="flex flex-col gap-1 mt-2">
                    {values.qualifications.map((q: string, i: number) => (
                      <div
                        key={i}
                        className="flex justify-between items-center bg-gray-100 px-3 py-2 rounded"
                      >
                        <span>{q}</span>
                        <button
                          type="button"
                          onClick={() => removeQualification(i)}
                          className="text-red-600"
                        >
                          Hapus
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Published Date */}
                <label className="flex flex-col gap-1">
                  <span className="text-sm font-medium text-gray-700">
                    Published Date
                  </span>
                  <input
                    type="date"
                    className="border px-3 py-2 rounded-lg"
                    value={values.publishedDate}
                    onChange={(e) =>
                      setValues({ ...values, publishedDate: e.target.value })
                    }
                  />
                </label>

                {/* Closed Date */}
                <label className="flex flex-col gap-1">
                  <span className="text-sm font-medium text-gray-700">
                    Closed Date
                  </span>
                  <input
                    type="date"
                    className="border px-3 py-2 rounded-lg"
                    value={values.closedDate}
                    onChange={(e) =>
                      setValues({ ...values, closedDate: e.target.value })
                    }
                  />
                </label>
              </div>
            );
          }}
        </ModalForm>
      )}

      {/* Modal Detail */}
      {openDetail && (
        <ModalDetail
          title="Job Vacancy Detail"
          open={openDetail}
          onClose={() => {
            setOpenDetail(false);
            dispatch(resetDetail());
          }}
          data={detail}
          fields={[
            { key: "companyName", label: "Company" },
            { key: "position", label: "Position" },
            { key: "location", label: "Location" },
            { key: "jobType", label: "Job Type" },
            { key: "description", label: "Description" },
            {
              key: "qualification",
              label: "Qualifications",
              render: (val) => (
                <ul className="list-disc ml-5">
                  {(val || []).map((q: string) => (
                    <li key={q}>{q}</li>
                  ))}
                </ul>
              ),
            },
            { key: "publishedDate", label: "Published Date" },
            { key: "closedDate", label: "Closed Date" },
          ]}
        />
      )}
    </div>
  );
};

export default JobVacancy;
