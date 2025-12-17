import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../../store";
import {
  fetchAllApplicants,
  fetchApplicantDetail,
  resetApplicantState,
  updateStatusApplicant,
} from "../../store/slices/applicantSlice";
import Table, {
  Column,
  renderAvatar,
  renderDate,
  renderStatus,
} from "../../components/table/TableData";
import ModalDetail, { DetailField } from "../../components/modal/DetailModal";
import { ApplicantPayload } from "../../service/applicantService";
import ModalForm from "../../components/modal/FormModal";

interface UpdateStatusForm {
  status: "approved" | "candidate" | "rejected";
}

const ApplicantManagementPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { data, loading, error, detail } = useSelector(
    (state: RootState) => state.applicant
  );

  const [modalOpen, setModalOpen] = useState(false);
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [selectedApplicant, setSelectedApplicant] =
    useState<ApplicantPayload | null>(null);

  useEffect(() => {
    dispatch(fetchAllApplicants());
    return () => {
      dispatch(resetApplicantState());
    };
  }, [dispatch]);

  // Handle klik tombol Detail
  const handleDetailClick = (applicantId: string) => {
    dispatch(fetchApplicantDetail(applicantId));
    setModalOpen(true);
  };

  const handleUpdateStatusClick = (applicant: ApplicantPayload) => {
    setSelectedApplicant(applicant);
    setStatusModalOpen(true);
  };

  const handleStatusSubmit = async (values: UpdateStatusForm) => {
    if (!selectedApplicant) return;

    await dispatch(
      updateStatusApplicant({
        applicantId: selectedApplicant.id,
        payload: values,
      })
    ).unwrap();

    setStatusModalOpen(false);
  };

  const columns: Column<ApplicantPayload>[] = [
    {
      header: "Tanggal Apply",
      accessor: (row: ApplicantPayload) => renderDate(row.appliedAt, "long"),
    },
    {
      header: "Nama",
      accessor: "fullName",
    },
    {
      header: "Email",
      accessor: "email",
    },
    {
      header: "Telepon",
      accessor: "phoneNumber",
    },
    {
      header: "Tanggal Lahir",
      accessor: (row: ApplicantPayload) => renderDate(row.birthDate, "short"),
    },
    {
      header: "Posisi Dilamar",
      accessor: "positionApplied", // <-- ini baru
    },
    {
      header: "Status",
      accessor: (row: ApplicantPayload) => renderStatus(row.status),
    },
  ];

  // Kolom aksi (Detail)
  const actions = (row: ApplicantPayload) => (
    <div className="flex items-center gap-2">
      <button
        onClick={() => handleDetailClick(row.id)}
        className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm font-medium transition-colors"
      >
        Detail
      </button>
      <button
        onClick={() => handleUpdateStatusClick(row)}
        className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 text-sm font-medium transition-colors"
      >
        Update Status
      </button>
    </div>
  );

  // Detail fields untuk modal
  const detailFields: DetailField[] = [
    { key: "fullName", label: "Nama", type: "text" },
    { key: "email", label: "Email", type: "email" },
    { key: "phoneNumber", label: "Telepon", type: "text" },
    { key: "address", label: "Alamat", type: "text" },
    { key: "birthPlace", label: "Tempat Lahir", type: "text" },
    { key: "birthDate", label: "Tanggal Lahir", type: "date" },
    { key: "gender", label: "Jenis Kelamin", type: "text" },
    { key: "status", label: "Status", type: "status" },
    {
      key: "cvFileUrl",
      label: "CV",
      type: "file",
      render: (value: string) =>
        value ? (
          <a
            href={value}
            target="_blank"
            rel="noopener noreferrer"
            download
            className="px-3 py-2 bg-blue-50 text-blue-700 rounded hover:bg-blue-100 transition-colors inline-flex items-center gap-2"
          >
            <span>Download CV</span>
          </a>
        ) : (
          <span className="text-gray-400 italic">Tidak ada file</span>
        ),
    },
    {
      key: "certificateUrl",
      label: "Sertifikat",
      type: "file",
      render: (value: string) =>
        value ? (
          <a
            href={value}
            target="_blank"
            rel="noopener noreferrer"
            download
            className="px-3 py-2 bg-green-50 text-green-700 rounded hover:bg-green-100 transition-colors inline-flex items-center gap-2"
          >
            <span>Download Sertifikat</span>
          </a>
        ) : (
          <span className="text-gray-400 italic">Tidak ada file</span>
        ),
    },
    { key: "resume", label: "Resume", type: "text" },
    { key: "appliedAt", label: "Tanggal Apply", type: "date" },
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Applicant Management</h1>

      {/* {error && (
        <div className="mb-4 text-red-600 font-medium">
          Terjadi kesalahan: {error}
        </div>
      )} */}

      <Table
        columns={columns}
        data={data?.data || []}
        loading={loading}
        emptyMessage="Belum ada applicant"
        loadingMessage="Sedang memuat applicant..."
        actions={actions}
      />

      {/* Modal Detail */}
      <ModalDetail
        title="Detail Applicant"
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        data={detail}
        fields={detailFields}
        width="2xl"
        gridColumns={2}
        loading={loading && !detail}
      />

      {/* Modal Update Status */}
      {selectedApplicant && (
        <ModalForm<UpdateStatusForm>
          title={`Update Status: ${selectedApplicant.fullName}`}
          initialValues={{
            status:
              selectedApplicant.status.toLowerCase() as UpdateStatusForm["status"],
          }}
          onSubmit={handleStatusSubmit}
          onClose={() => {
            setStatusModalOpen(false);
            setSelectedApplicant(null); // reset agar modal benar-benar hilang
          }}
          submitLabel="Update"
        >
          {(values, setValues, errors, setErrors) => (
            <div className="flex flex-col gap-3">
              <label className="font-medium">Pilih Status</label>
              <select
                className="border border-gray-300 rounded px-3 py-2"
                value={values.status.toLowerCase()} // pastikan lowercase
                onChange={(e) =>
                  setValues({
                    ...values,
                    status: e.target.value as UpdateStatusForm["status"],
                  })
                }
              >
                <option value="candidate">Candidate</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>

              {errors.status && (
                <p className="text-red-500 text-sm">{errors.status}</p>
              )}
            </div>
          )}
        </ModalForm>
      )}
    </div>
  );
};

export default ApplicantManagementPage;
