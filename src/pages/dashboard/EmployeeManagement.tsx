import { useEffect, useState } from "react";
import Button from "../../components/button/Button";
import EmployeeForm from "../../components/form/EmployeeForm";
import ModalAlert from "../../components/modal/AlertModal";
import DetailModalEmployee, {
  EmployeeDetailData,
} from "../../components/modal/DetailModelEmployee";
import {
  EmployeePayload,
  EmployeeRequest,
} from "../../service/employeeService";
import {
  clearEmployeeDetail,
  createEmployee,
  deleteEmployee,
  fetchEmployee,
  fetchEmployeeDetail,
  updateEmployee,
} from "../../store/slices/employeeSlice";
import { fetchDepartment } from "../../store/slices/departmentSlice";
import { fetchRolePermissions } from "../../store/slices/rolePermissionSlice";
import { AppDispatch, RootState } from "../../store";
import { useDispatch, useSelector } from "react-redux";
import Table, { Column } from "../../components/table/TableData";

const EmployeePage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { employeeData, employeeDetail, loading, detailLoading } = useSelector(
    (state: RootState) => state.employee
  );
  const { departmentData } = useSelector(
    (state: RootState) => state.department
  );
  const { list: roleList } = useSelector(
    (state: RootState) => state.rolePermission
  );

  const [modalOpen, setModalOpen] = useState(false);
  const [modalDetailOpen, setModalDetailOpen] = useState(false);
  const [editEmployee, setEditEmployee] = useState<EmployeePayload | null>(
    null
  );

  const [alertOpen, setAlertOpen] = useState(false);
  const [alertType, setAlertType] = useState<"success" | "error" | "confirm">(
    "success"
  );
  const [alertMessage, setAlertMessage] = useState("");
  const [onConfirmAction, setOnConfirmAction] = useState<
    (() => void) | undefined
  >();

  useEffect(() => {
    dispatch(fetchEmployee());
    dispatch(fetchDepartment());
    dispatch(fetchRolePermissions());
  }, [dispatch]);

  // Fungsi untuk mencari ID berdasarkan nama
  const findDepartmentIdByName = (departmentName: string): string => {
    if (!departmentData?.data || !departmentName) return "";
    const department = departmentData.data.find(
      (d: any) => d.name === departmentName
    );
    return department ? String(department.id) : "";
  };

  const findRoleIdByName = (roleName: string): string => {
    if (!roleList || !roleName) return "";
    const role = roleList.find((r: any) => r.name === roleName);
    return role ? String(role.id) : "";
  };

  // Debug log untuk melihat data yang diterima
  useEffect(() => {
    console.log("Employee Data from store:", employeeData);
    console.log("Department Data:", departmentData);
    console.log("Role List:", roleList);

    // Debug: cek apakah department dan role ada
    if (departmentData?.data) {
      console.log(
        "Available Departments:",
        departmentData.data.map((d: any) => ({ id: d.id, name: d.name }))
      );
    }
    if (roleList) {
      console.log(
        "Available Roles:",
        roleList.map((r: any) => ({ id: r.id, name: r.name }))
      );
    }
  }, [employeeData, departmentData, roleList]);

  // Columns for table
  const columns: Column<EmployeePayload>[] = [
    { header: "Nama Lengkap", accessor: "fullName" },
    { header: "Email", accessor: "email" },
    { header: "Department", accessor: "departmentName" },
    { header: "Role", accessor: "roleName" },
    { header: "Status", accessor: "status" },
  ];

  // Handlers
  const handleCreateOrUpdate = async (values: EmployeeRequest) => {
    try {
      if (editEmployee) {
        console.log("Updating employee with:", values);
        await dispatch(
          updateEmployee({ employeeId: editEmployee.id, payload: values })
        ).unwrap();
      } else {
        console.log("Creating employee with:", values);
        await dispatch(createEmployee(values)).unwrap();
      }
      setAlertType("success");
      setAlertMessage(
        editEmployee
          ? "Karyawan berhasil diperbarui!"
          : "Karyawan berhasil dibuat!"
      );
    } catch (err: any) {
      setAlertType("error");
      setAlertMessage(err?.message || "Karyawan gagal dibuat!");
      console.error("Error in handleCreateOrUpdate:", err);
    } finally {
      setModalOpen(false);
      setEditEmployee(null);
      setAlertOpen(true);
      dispatch(fetchEmployee());
    }
  };

  const handleDelete = (employeeId: string) => {
    setAlertType("confirm");
    setAlertMessage("Apakah kamu yakin ingin menghapus Karyawan ini?");
    setOnConfirmAction(async () => {
      try {
        await dispatch(deleteEmployee(employeeId)).unwrap();
        setAlertType("success");
        setAlertMessage("Karyawan berhasil dihapus!");
      } catch (err: any) {
        setAlertType("error");
        setAlertMessage(err?.message || "Karyawan gagal dihapus!");
      } finally {
        setAlertOpen(true);
      }
    });
    setAlertOpen(true);
  };

  const handleEdit = (employee: any) => {
    console.log("Editing employee from table:", employee);

    // Cari departmentId dan roleId berdasarkan nama
    const departmentId = findDepartmentIdByName(employee.departmentName);
    const roleId = findRoleIdByName(employee.roleName);

    console.log(
      "Found departmentId:",
      departmentId,
      "for department:",
      employee.departmentName
    );
    console.log("Found roleId:", roleId, "for role:", employee.roleName);

    // Format status untuk match dengan form (lowercase)
    const formattedStatus =
      employee.status?.toLowerCase() === "active" ? "active" : "inactive";

    // Format employmentStatus jika perlu
    const formattedEmploymentStatus = employee.employmentStatus || "";

    // Konversi tanggal bergabung ke format yang benar
    const formatDateForForm = (dateString: string) => {
      if (!dateString) return "";
      try {
        const dateParts = dateString.split(" ");
        if (dateParts.length === 3) {
          const day = dateParts[0];
          const month = dateParts[1];
          const year = dateParts[2];

          const monthMap: { [key: string]: string } = {
            Januari: "01",
            Februari: "02",
            Maret: "03",
            April: "04",
            Mei: "05",
            Juni: "06",
            Juli: "07",
            Agustus: "08",
            September: "09",
            Oktober: "10",
            November: "11",
            Desember: "12",
          };

          const monthNumber = monthMap[month] || "01";
          const formattedDay = day.padStart(2, "0");

          return `${year}-${monthNumber}-${formattedDay}`;
        }
        return dateString;
      } catch (error) {
        console.error("Error formatting date:", error);
        return dateString;
      }
    };

    const formattedJoinedDate = formatDateForForm(employee.joinedDate);

    const employeeForForm: EmployeeRequest = {
      fullName: employee.fullName || "",
      email: employee.email || "",
      departmentId: departmentId,
      roleId: roleId,
      employmentStatus: formattedEmploymentStatus,
      idCardNumber: employee.idCardNumber || "",
      joinedDate: formattedJoinedDate,
      status: formattedStatus as "active" | "inactive",
      isVerified: employee.isVerified || false,
    };

    const employeePayload = {
      ...employeeForForm,
      id: employee.id,
      departmentName: employee.departmentName,
      roleName: employee.roleName,
      userId: employee.userId || "",
      companyProfileId: employee.companyProfileId || "",
      passwordDefault: employee.passwordDefault || "",
      phoneNumber: employee.phoneNumber || "",
      shift: employee.shift || null,
      picture: employee.picture || "",
    };

    console.log("Processed employee payload for form:", employeePayload);

    setEditEmployee(employeePayload);
    setModalOpen(true);
  };
  const handleDetail = async (employee: EmployeePayload) => {
    console.log("Fetching detail for employee ID:", employee.id);
    console.log("Employee data from table:", employee);

    setModalDetailOpen(true);
    const result = await dispatch(fetchEmployeeDetail(employee.id));

    // Log hasil fetch
    console.log("Employee detail fetch result:", result);
    console.log("employeeDetail from store after fetch:", employeeDetail);
  };

  // Juga tambahkan useEffect untuk log perubahan employeeDetail
  useEffect(() => {
    if (employeeDetail) {
      console.log("=== EMPLOYEE DETAIL DATA ===");
      console.log("Full employeeDetail object:", employeeDetail);
      console.log("Basic info:", {
        id: employeeDetail.id,
        fullName: employeeDetail.fullName,
        email: employeeDetail.email,
        idCardNumber: employeeDetail.idCardNumber,
      });
      console.log("=== END ===");
    }
  }, [employeeDetail]);

  const handleModalClose = () => {
    setEditEmployee(null);
    setModalOpen(false);
  };

  const handleDetailClose = () => {
    setModalDetailOpen(false);
    dispatch(clearEmployeeDetail());
  };

  // EmployeePage.tsx - update prepareEmployeeDetailData function
  const prepareEmployeeDetailData = (
    detail: any
  ): EmployeeDetailData | null => {
    if (!detail) {
      console.log("No detail data to prepare");
      return null;
    }

    console.log("Raw detail data:", detail);

    // Helper function untuk extract number dari string currency
    const extractNumberFromCurrency = (currencyString: string): number => {
      if (!currencyString || typeof currencyString !== "string") return 0;

      // Remove currency symbols and non-numeric characters
      const numericString = currencyString.replace(/[^0-9.-]+/g, "");
      const number = parseFloat(numericString);

      return isNaN(number) ? 0 : number;
    };

    return {
      // Personal Information
      id: detail.id || "",
      picture: detail.picture || "",
      fullName: detail.fullName || "Nama tidak tersedia",
      idCardNumber: detail.idCardNumber || "ID tidak tersedia",
      email: detail.email || "Email tidak tersedia",
      birthPlace: detail.birthPlace || "",
      birthDate: detail.birthDate || "",
      gender: detail.gender || "",
      ktpNumber: detail.ktpNumber || "",
      npwpNumber: detail.npwpNumber || "",
      maritalStatus: detail.maritalStatus || "",
      citizenship: detail.citizenship || "",
      religion: detail.religion || "",
      address: detail.address || "",
      domicileAddress: detail.domicileAddress || "",
      bloodType: detail.bloodType || "",

      // Employment Information
      joinedDate: detail.joinedDate || "",
      employmentStatus: detail.employmentStatus || "",
      resignDate: detail.resignDate || "",
      status: detail.status || "",
      departmentName: detail.department?.name || detail.departmentName || "",
      roleName: detail.role?.name || detail.roleName || "",
      shiftName: detail.shift?.shiftName || detail.shiftName || "",
      isVerified: detail.isVerified || false,

      // Contact Information
      phoneNumber: detail.phoneNumber || "",
      emergencyPhone: detail.emergencyPhone || "",

      // Education & Certification
      lastEducation: detail.lastEducation || "",
      educationInstitute: detail.educationInstitute || "",
      major: detail.major || "",
      graduationYear: detail.graduationYear || "",
      certificationList: detail.certification || detail.certificationList || [],

      // Family Information
      spouseName: detail.spouseName || "",
      childrenList: detail.children || detail.childrenList || [],

      // Health Information
      bpjsForHealth: detail.bpjsForHealth || "",
      bpjsForWork: detail.bpjsForWork || "",
      height: detail.height || "",
      weight: detail.weight || "",
      diseaseHistory: detail.diseaseHistory || "",
      lastMedicalCheck: detail.lastMedicalCheck || "",

      // Administrative & Payroll
      bankAccountNumber: detail.bankAccountNumber || "",
      bankName: detail.bankName || "",
      bankAccountName: detail.bankAccountName || "",
      taxStatus: detail.taxStatus || "",
      basicSalary: extractNumberFromCurrency(detail.basicSalary),
      allowances: extractNumberFromCurrency(detail.allowances),
      totalIncome: extractNumberFromCurrency(detail.totalIncome),
    };
  };

  // Update employeeDetailData
  const employeeDetailData = prepareEmployeeDetailData(employeeDetail);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Employee Management</h1>
      <div className="flex gap-4 items-center mb-4">
        <Button
          label="Tambah Karyawan"
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-white hover:opacity-70 transition-all"
          bgColor="#189AB4"
          onClick={() => {
            setEditEmployee(null);
            setModalOpen(true);
          }}
        />
      </div>

      <Table
        columns={columns}
        data={employeeData?.data || []}
        actions={(row) => (
          <div className="flex justify-center gap-2">
            <Button
              label="Detail"
              className="flex items-center gap-2 px-2 py-1 rounded-sm text-white hover:opacity-70 transition-all"
              bgColor="#189AB4"
              onClick={() => handleDetail(row)}
            />
            <Button
              label="Edit"
              className="flex items-center gap-2 px-2 py-1 rounded-sm text-white hover:opacity-70 transition-all"
              bgColor="#eab308"
              onClick={() => handleEdit(row)}
            />
            <Button
              label="Hapus"
              className="flex items-center gap-2 px-2 py-1 rounded-sm text-white hover:opacity-70 transition-all"
              bgColor="#ef4444"
              onClick={() => handleDelete(row.id)}
            />
          </div>
        )}
        emptyMessage={loading ? "Loading..." : "No employees found"}
      />

      {/* Employee Form Modal */}
      {modalOpen && (
        <EmployeeForm
          modalOpen={modalOpen}
          editEmployee={editEmployee}
          departmentData={departmentData}
          roleList={roleList}
          handleCreateOrUpdate={handleCreateOrUpdate}
          handleModalClose={handleModalClose}
        />
      )}

      {/* Detail Modal Employee */}
      <DetailModalEmployee
        open={modalDetailOpen}
        onClose={handleDetailClose}
        employeeDetail={employeeDetailData}
        loading={detailLoading}
      />

      {/* Modal Alert */}
      <ModalAlert
        open={alertOpen}
        type={alertType}
        message={alertMessage}
        onClose={() => setAlertOpen(false)}
        onConfirm={onConfirmAction}
        confirmText="Yes"
        cancelText="Cancel"
      />
    </div>
  );
};

export default EmployeePage;
