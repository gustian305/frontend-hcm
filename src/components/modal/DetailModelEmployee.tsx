// src/components/modal/DetailModalEmployee.tsx
import React, { useMemo } from "react";
import {
  AlertCircle,
  Building,
  Calendar,
  CheckCircle,
  Clock,
  File,
  Mail,
  User,
  Users,
  Briefcase,
  Heart,
  CreditCard,
  GraduationCap,
  Home,
  Phone,
  PhoneCall,
  MapPin,
  DollarSign,
  Shield,
  Stethoscope,
  BookOpen,
  Baby,
  Scale,
  FileText,
  Globe,
  Cake,
  Banknote,
  Percent,
  FileSpreadsheet,
  Activity,
  Plus,
} from "lucide-react";
import ModalDetail from "../../components/modal/DetailModal";
import {
  formatCurrency,
  formatDateForDisplay,
} from "../../utils/dateTimeHelper";

interface DetailModalEmployeeProps {
  open: boolean;
  onClose: () => void;
  employeeDetail: EmployeeDetailData | null;
  loading?: boolean;
}

// Tipe data untuk children dan certification
interface ChildData {
  name: string;
  birthDate?: string;
  gender?: string;
  education?: string;
}

interface CertificationData {
  name: string;
  issuer?: string;
  year?: string;
  validityPeriod?: string;
  certificateNumber?: string;
}

export interface EmployeeDetailData {
  // Personal Information
  id: string;
  picture?: string;
  fullName: string;
  idCardNumber: string;
  email?: string;
  birthPlace?: string;
  birthDate?: string;
  gender?: string;
  ktpNumber?: string;
  npwpNumber?: string;
  maritalStatus?: string;
  citizenship?: string;
  religion?: string;
  address?: string;
  domicileAddress?: string;
  bloodType?: string;

  // Employment Information
  joinedDate?: string;
  employmentStatus?: string;
  resignDate?: string;
  status: string;
  departmentName?: string;
  roleName?: string;
  shiftName?: string;
  isVerified?: boolean;

  // Contact Information
  phoneNumber?: string;
  emergencyPhone?: string;

  // Education & Certification
  lastEducation?: string;
  educationInstitute?: string;
  major?: string;
  graduationYear?: string;
  certificationList?: CertificationData[];

  // Family Information
  spouseName?: string;
  childrenList?: ChildData[];

  // Health Information
  bpjsForHealth?: string;
  bpjsForWork?: string;
  height?: string | number;
  weight?: string | number;
  diseaseHistory?: string;
  lastMedicalCheck?: string;

  // Administrative & Payroll
  bankAccountNumber?: string;
  bankName?: string;
  bankAccountName?: string;
  taxStatus?: string;
  basicSalary?: number;
  allowances?: number;
  totalIncome?: number;
}

const DetailModalEmployee: React.FC<DetailModalEmployeeProps> = ({
  open,
  onClose,
  employeeDetail,
  loading = false,
}) => {
  const processedData = useMemo(() => {
    if (!employeeDetail) return null;

    // Calculate BMI if height and weight are available
    const calculateBMI = () => {
      if (!employeeDetail.height || !employeeDetail.weight) return null;
      const heightInMeters = Number(employeeDetail.height) / 100;
      const weightInKg = Number(employeeDetail.weight);
      if (heightInMeters === 0) return null;
      const bmi = weightInKg / (heightInMeters * heightInMeters);
      return bmi.toFixed(1);
    };

    const bmi = calculateBMI();
    const getBMICategory = (bmiValue: string) => {
      const num = parseFloat(bmiValue);
      if (num < 18.5)
        return { category: "Underweight", color: "text-yellow-600" };
      if (num < 25) return { category: "Normal", color: "text-green-600" };
      if (num < 30) return { category: "Overweight", color: "text-orange-600" };
      return { category: "Obese", color: "text-red-600" };
    };

    const bmiInfo = bmi ? getBMICategory(bmi) : null;

    return {
      ...employeeDetail,
      // Format dates
      birthDate: employeeDetail.birthDate
        ? formatDateForDisplay(employeeDetail.birthDate)
        : "-",
      joinedDate: employeeDetail.joinedDate
        ? formatDateForDisplay(employeeDetail.joinedDate)
        : "-",
      resignDate: employeeDetail.resignDate
        ? formatDateForDisplay(employeeDetail.resignDate)
        : "-",
      lastMedicalCheck: employeeDetail.lastMedicalCheck
        ? formatDateForDisplay(employeeDetail.lastMedicalCheck)
        : "-",
      bmi,
      bmiInfo,
    };
  }, [employeeDetail]);

  // Pindahkan renderHeaderSection ke dalam fields atau gunakan sebagai children
  const CustomHeader = () => {
    if (!processedData) return null;

    const {
      picture,
      fullName,
      idCardNumber,
      email,
      status,
      isVerified,
      departmentName,
      roleName,
      shiftName,
    } = processedData;

    const getStatusColor = () => {
      switch (status?.toLowerCase()) {
        case "active":
          return "bg-green-100 text-green-800 border-green-200";
        case "inactive":
          return "bg-red-100 text-red-800 border-red-200";
        case "resigned":
          return "bg-gray-100 text-gray-800 border-gray-200";
        case "on leave":
          return "bg-blue-100 text-blue-800 border-blue-200";
        default:
          return "bg-gray-100 text-gray-800 border-gray-200";
      }
    };

    const getInitials = (name: string) => {
      if (!name || name === "-") return "?";
      const names = name.split(" ");
      if (names.length >= 2) {
        return `${names[0][0]}${names[1][0]}`.toUpperCase();
      }
      return name[0].toUpperCase();
    };

    const getAvatarColor = (name: string) => {
      const colors = [
        "from-blue-500 to-blue-700",
        "from-green-500 to-green-700",
        "from-purple-500 to-purple-700",
        "from-pink-500 to-pink-700",
        "from-orange-500 to-orange-700",
        "from-teal-500 to-teal-700",
      ];
      const index = name.length % colors.length;
      return colors[index];
    };

    return (
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-t-lg -mx-6 -mt-6 p-6 text-white">
        <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
          {/* Avatar */}
          <div className="relative">
            {picture ? (
              <img
                src={picture}
                alt={fullName}
                className="w-20 h-20 rounded-full border-4 border-white/30 object-cover shadow-xl"
              />
            ) : (
              <div
                className={`w-20 h-20 rounded-full border-4 border-white/30 flex items-center justify-center bg-gradient-to-br ${getAvatarColor(
                  fullName
                )} shadow-xl`}
              >
                <span className="text-white text-2xl font-bold">
                  {getInitials(fullName)}
                </span>
              </div>
            )}
            {isVerified && (
              <div className="absolute -bottom-1 -right-1 bg-emerald-500 rounded-full p-1 border-2 border-white">
                <CheckCircle className="w-4 h-4 text-white" />
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-3 mb-2">
              <h1 className="text-2xl md:text-3xl font-bold">{fullName}</h1>
              <div
                className={`px-3 py-1 rounded-full text-sm font-semibold border ${getStatusColor()}`}
              >
                {status || "Unknown"}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="flex items-center gap-2 text-slate-200">
                <User className="w-4 h-4" />
                <span>ID: {idCardNumber}</span>
              </div>

              <div className="flex items-center gap-2 text-slate-200">
                <Mail className="w-4 h-4" />
                <a
                  href={`mailto:${email}`}
                  className="hover:text-white transition-colors"
                >
                  {email || "-"}
                </a>
              </div>

              {/* {departmentName && (
                <div className="flex items-center gap-2 text-slate-200">
                  <Building className="w-4 h-4" />
                  <span>{departmentName}</span>
                </div>
              )}

              {roleName && (
                <div className="flex items-center gap-2 text-slate-200">
                  <Briefcase className="w-4 h-4" />
                  <span>{roleName}</span>
                </div>
              )}

              {shiftName && (
                <div className="flex items-center gap-2 text-slate-200">
                  <Clock className="w-4 h-4" />
                  <span>{shiftName}</span>
                </div>
              )} */}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderInfoCard = (
    title: string,
    value: string | number,
    icon: React.ReactNode,
    color: string
  ) => (
    <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
      <div className="flex items-center gap-3 mb-2">
        <div className={`p-2 rounded-lg ${color}`}>{icon}</div>
        <span className="text-sm font-medium text-gray-500">{title}</span>
      </div>
      <p className="text-lg font-semibold text-gray-900 truncate">
        {value || "-"}
      </p>
    </div>
  );

  const fields = useMemo(
    () => [
      // Gunakan custom render untuk header sebagai field pertama
      {
        key: "header_section",
        label: "",
        type: "custom" as const,
        className: "col-span-2 -mx-6 -mt-6 mb-6",
        render: () => <CustomHeader />,
      },

      // Section 1: Personal Information
      {
        key: "section_personal",
        label: "Informasi Pribadi",
        type: "custom" as const,
        className: "col-span-2",
        render: () => (
          <div className="space-y-6">
            <div className="flex items-center gap-2 mb-4">
              <User className="w-6 h-6 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900">
                Informasi Pribadi
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {renderInfoCard(
                "Tempat Lahir",
                processedData?.birthPlace || "-",
                <MapPin className="w-5 h-5 text-blue-600" />,
                "bg-blue-50"
              )}

              {renderInfoCard(
                "Tanggal Lahir",
                processedData?.birthDate || "-",
                <Cake className="w-5 h-5 text-purple-600" />,
                "bg-purple-50"
              )}

              {renderInfoCard(
                "Jenis Kelamin",
                processedData?.gender || "-",
                <Users className="w-5 h-5 text-pink-600" />,
                "bg-pink-50"
              )}

              {renderInfoCard(
                "No. KTP",
                processedData?.ktpNumber || "-",
                <FileText className="w-5 h-5 text-orange-600" />,
                "bg-orange-50"
              )}

              {renderInfoCard(
                "No. NPWP",
                processedData?.npwpNumber || "-",
                <FileSpreadsheet className="w-5 h-5 text-red-600" />,
                "bg-red-50"
              )}

              {renderInfoCard(
                "Status Pernikahan",
                processedData?.maritalStatus || "-",
                <Users className="w-5 h-5 text-teal-600" />,
                "bg-teal-50"
              )}

              {renderInfoCard(
                "Kewarganegaraan",
                processedData?.citizenship || "-",
                <Globe className="w-5 h-5 text-indigo-600" />,
                "bg-indigo-50"
              )}

              {renderInfoCard(
                "Agama",
                processedData?.religion || "-",
                <Shield className="w-5 h-5 text-amber-600" />,
                "bg-amber-50"
              )}

              {renderInfoCard(
                "Golongan Darah",
                processedData?.bloodType || "-",
                <Activity className="w-5 h-5 text-rose-600" />,
                "bg-rose-50"
              )}
            </div>

            {/* Address Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <MapPin className="w-5 h-5 text-gray-600" />
                  <h4 className="font-medium text-gray-900">Alamat</h4>
                </div>
                <p className="text-gray-700 whitespace-pre-line">
                  {processedData?.address || "Tidak ada alamat"}
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Home className="w-5 h-5 text-gray-600" />
                  <h4 className="font-medium text-gray-900">Alamat Domisili</h4>
                </div>
                <p className="text-gray-700 whitespace-pre-line">
                  {processedData?.domicileAddress ||
                    processedData?.address ||
                    "Sama dengan alamat"}
                </p>
              </div>
            </div>
          </div>
        ),
      },

      // ... (section-section lainnya tetap sama seperti sebelumnya)
      // Section 2: Employment Information
      {
        key: "section_employment",
        label: "Informasi Pekerjaan",
        type: "custom" as const,
        className: "col-span-2",
        render: () => (
          <div className="space-y-6">
            <div className="flex items-center gap-2 mb-4">
              <Briefcase className="w-6 h-6 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900">
                Informasi Pekerjaan
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {renderInfoCard(
                "Tanggal Bergabung",
                processedData?.joinedDate || "-",
                <Calendar className="w-5 h-5 text-green-600" />,
                "bg-green-50"
              )}

              {renderInfoCard(
                "Status Kepegawaian",
                processedData?.employmentStatus || "-",
                <CheckCircle className="w-5 h-5 text-emerald-600" />,
                "bg-emerald-50"
              )}

              {renderInfoCard(
                "Tanggal Resign",
                processedData?.resignDate || "-",
                <Calendar className="w-5 h-5 text-red-600" />,
                "bg-red-50"
              )}

              {renderInfoCard(
                "Department",
                processedData?.departmentName || "-",
                <Building className="w-5 h-5 text-blue-600" />,
                "bg-blue-50"
              )}

              {renderInfoCard(
                "Posisi/Role",
                processedData?.roleName || "-",
                <User className="w-5 h-5 text-purple-600" />,
                "bg-purple-50"
              )}

              {renderInfoCard(
                "Shift",
                processedData?.shiftName || "-",
                <Clock className="w-5 h-5 text-orange-600" />,
                "bg-orange-50"
              )}
            </div>
          </div>
        ),
      },

      // Section 3: Contact Information
      {
        key: "section_contact",
        label: "Informasi Kontak",
        type: "custom" as const,
        className: "col-span-2",
        render: () => (
          <div className="space-y-6">
            <div className="flex items-center gap-2 mb-4">
              <Phone className="w-6 h-6 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900">
                Informasi Kontak
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-blue-50 rounded-lg p-5 border border-blue-200">
                <div className="flex items-center gap-3 mb-4">
                  <Phone className="w-6 h-6 text-blue-600" />
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      Nomor Telepon Pribadi
                    </h4>
                    <p className="text-sm text-gray-600">Kontak utama</p>
                  </div>
                </div>
                {processedData?.phoneNumber ? (
                  <a
                    href={`tel:${processedData.phoneNumber}`}
                    className="inline-flex items-center gap-2 text-lg font-semibold text-blue-700 hover:text-blue-800 hover:underline"
                  >
                    <PhoneCall className="w-5 h-5" />
                    {processedData.phoneNumber}
                  </a>
                ) : (
                  <p className="text-gray-500 italic">Tidak tersedia</p>
                )}
              </div>

              <div className="bg-red-50 rounded-lg p-5 border border-red-200">
                <div className="flex items-center gap-3 mb-4">
                  <AlertCircle className="w-6 h-6 text-red-600" />
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      Kontak Darurat
                    </h4>
                    <p className="text-sm text-gray-600">
                      Hubungi dalam keadaan darurat
                    </p>
                  </div>
                </div>
                {processedData?.emergencyPhone ? (
                  <a
                    href={`tel:${processedData.emergencyPhone}`}
                    className="inline-flex items-center gap-2 text-lg font-semibold text-red-700 hover:text-red-800 hover:underline"
                  >
                    <PhoneCall className="w-5 h-5" />
                    {processedData.emergencyPhone}
                  </a>
                ) : (
                  <p className="text-gray-500 italic">Tidak tersedia</p>
                )}
              </div>
            </div>
          </div>
        ),
      },

      // Section 4: Education
      {
        key: "section_education",
        label: "Pendidikan",
        type: "custom" as const,
        className: "col-span-2",
        render: () => (
          <div className="space-y-6">
            <div className="flex items-center gap-2 mb-4">
              <GraduationCap className="w-6 h-6 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900">
                Pendidikan
              </h3>
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  {renderInfoCard(
                    "Pendidikan Terakhir",
                    processedData?.lastEducation || "-",
                    <GraduationCap className="w-5 h-5 text-blue-600" />,
                    "bg-blue-50"
                  )}

                  {renderInfoCard(
                    "Lembaga Pendidikan",
                    processedData?.educationInstitute || "-",
                    <Building className="w-5 h-5 text-purple-600" />,
                    "bg-purple-50"
                  )}
                </div>

                <div className="space-y-4">
                  {renderInfoCard(
                    "Jurusan",
                    processedData?.major || "-",
                    <BookOpen className="w-5 h-5 text-green-600" />,
                    "bg-green-50"
                  )}

                  {renderInfoCard(
                    "Tahun Lulus",
                    processedData?.graduationYear || "-",
                    <Calendar className="w-5 h-5 text-orange-600" />,
                    "bg-orange-50"
                  )}
                </div>
              </div>

              {/* Certifications */}
              {processedData?.certificationList &&
                processedData.certificationList.length > 0 && (
                  <div className="mt-8">
                    <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-emerald-600" />
                      Sertifikasi
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {processedData.certificationList.map((cert, index) => (
                        <div
                          key={index}
                          className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow"
                        >
                          <div className="flex items-start justify-between">
                            <div>
                              <h5 className="font-semibold text-gray-900">
                                {cert.name}
                              </h5>
                              {cert.issuer && (
                                <p className="text-sm text-gray-600 mt-1">
                                  Issuer: {cert.issuer}
                                </p>
                              )}
                              {cert.year && (
                                <p className="text-sm text-gray-600">
                                  Year: {cert.year}
                                </p>
                              )}
                            </div>
                            {cert.validityPeriod && (
                              <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded">
                                {cert.validityPeriod}
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
            </div>
          </div>
        ),
      },

      // Section 5: Family
      {
        key: "section_family",
        label: "Informasi Keluarga",
        type: "custom" as const,
        className: "col-span-2",
        render: () => (
          <div className="space-y-6">
            <div className="flex items-center gap-2 mb-4">
              <Users className="w-6 h-6 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900">
                Informasi Keluarga
              </h3>
            </div>

            <div className="bg-gradient-to-r from-pink-50 to-rose-50 rounded-xl p-6 border border-pink-200">
              {processedData?.spouseName ? (
                <div className="mb-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Users className="w-6 h-6 text-pink-600" />
                    <div>
                      <h4 className="font-semibold text-gray-900">Pasangan</h4>
                      <p className="text-sm text-gray-600">Nama pasangan</p>
                    </div>
                  </div>
                  <p className="text-xl font-semibold text-gray-900">
                    {processedData.spouseName}
                  </p>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">Tidak ada informasi pasangan</p>
                </div>
              )}

              {/* Children */}
              {processedData?.childrenList &&
                processedData.childrenList.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <Baby className="w-5 h-5 text-rose-600" />
                      Anak-anak ({processedData.childrenList.length})
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {processedData.childrenList.map((child, index) => (
                        <div
                          key={index}
                          className="bg-white rounded-lg border border-rose-100 p-4 hover:shadow-md transition-shadow"
                        >
                          <div className="flex items-start justify-between mb-2">
                            <h5 className="font-semibold text-gray-900">
                              {child.name}
                            </h5>
                            {child.gender && (
                              <span className="px-2 py-1 bg-rose-100 text-rose-800 text-xs font-medium rounded">
                                {child.gender}
                              </span>
                            )}
                          </div>
                          {child.birthDate && (
                            <p className="text-sm text-gray-600">
                              Lahir: {formatDateForDisplay(child.birthDate)}
                            </p>
                          )}
                          {child.education && (
                            <p className="text-sm text-gray-600">
                              Pendidikan: {child.education}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
            </div>
          </div>
        ),
      },

      // Section 6: Health
      {
        key: "section_health",
        label: "Informasi Kesehatan",
        type: "custom" as const,
        className: "col-span-2",
        render: () => (
          <div className="space-y-6">
            <div className="flex items-center gap-2 mb-4">
              <Heart className="w-6 h-6 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900">
                Informasi Kesehatan
              </h3>
            </div>

            <div className="bg-gradient-to-r from-emerald-50 to-green-50 rounded-xl p-6 border border-emerald-200">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                {renderInfoCard(
                  "BPJS Kesehatan",
                  processedData?.bpjsForHealth || "-",
                  <Shield className="w-5 h-5 text-emerald-600" />,
                  "bg-emerald-50"
                )}

                {renderInfoCard(
                  "BPJS Ketenagakerjaan",
                  processedData?.bpjsForWork || "-",
                  <Stethoscope className="w-5 h-5 text-green-600" />,
                  "bg-green-50"
                )}

                {renderInfoCard(
                  "Pemeriksaan Terakhir",
                  processedData?.lastMedicalCheck || "-",
                  <Calendar className="w-5 h-5 text-teal-600" />,
                  "bg-teal-50"
                )}
              </div>

              {/* BMI and Physical Data */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="bg-white rounded-lg border border-gray-200 p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-600">
                        Tinggi Badan
                      </span>
                      {processedData?.height && (
                        <Scale className="w-5 h-5 text-blue-600" />
                      )}
                    </div>
                    <p className="text-2xl font-bold text-gray-900">
                      {processedData?.height
                        ? `${processedData.height} cm`
                        : "-"}
                    </p>
                  </div>

                  <div className="bg-white rounded-lg border border-gray-200 p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-600">
                        Berat Badan
                      </span>
                      {processedData?.weight && (
                        <Scale className="w-5 h-5 text-orange-600" />
                      )}
                    </div>
                    <p className="text-2xl font-bold text-gray-900">
                      {processedData?.weight
                        ? `${processedData.weight} kg`
                        : "-"}
                    </p>
                  </div>
                </div>

                {/* BMI Calculator */}
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                  <div className="flex items-center gap-2 mb-4">
                    <Activity className="w-5 h-5 text-purple-600" />
                    <h4 className="font-semibold text-gray-900">
                      Indeks Massa Tubuh (BMI)
                    </h4>
                  </div>

                  {processedData?.bmi ? (
                    <>
                      <div className="text-center mb-4">
                        <div className="text-4xl font-bold text-gray-900 mb-1">
                          {processedData.bmi}
                        </div>
                        <div
                          className={`text-lg font-semibold ${processedData.bmiInfo?.color}`}
                        >
                          {processedData.bmiInfo?.category}
                        </div>
                      </div>

                      <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="absolute h-full bg-gradient-to-r from-emerald-500 via-yellow-500 to-red-500"
                          style={{
                            width: `${Math.min(
                              100,
                              (parseFloat(processedData.bmi) / 40) * 100
                            )}%`,
                          }}
                        />
                      </div>

                      <div className="flex justify-between text-xs text-gray-500 mt-2">
                        <span>Underweight</span>
                        <span>Normal</span>
                        <span>Overweight</span>
                        <span>Obese</span>
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-6">
                      <Activity className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-500">
                        Data tidak cukup untuk menghitung BMI
                      </p>
                      <p className="text-sm text-gray-400 mt-1">
                        Diperlukan tinggi dan berat badan
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Disease History */}
              {processedData?.diseaseHistory && (
                <div className="mt-6">
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-red-600" />
                    Riwayat Penyakit
                  </h4>
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="text-gray-700 whitespace-pre-line">
                      {processedData.diseaseHistory}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        ),
      },

      // Section 7: Financial
      {
        key: "section_financial",
        label: "Informasi Keuangan",
        type: "custom" as const,
        className: "col-span-2",
        render: () => (
          <div className="space-y-6">
            <div className="flex items-center gap-2 mb-4">
              <CreditCard className="w-6 h-6 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900">
                Informasi Keuangan
              </h3>
            </div>

            <div className="bg-gradient-to-r from-amber-50 to-yellow-50 rounded-xl p-6 border border-amber-200">
              {/* Bank Account Information */}
              <div className="mb-8">
                <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Banknote className="w-5 h-5 text-amber-600" />
                  Informasi Rekening Bank
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {renderInfoCard(
                    "Nama Bank",
                    processedData?.bankName || "-",
                    <Building className="w-5 h-5 text-amber-600" />,
                    "bg-amber-50"
                  )}

                  {renderInfoCard(
                    "Nomor Rekening",
                    processedData?.bankAccountNumber || "-",
                    <CreditCard className="w-5 h-5 text-yellow-600" />,
                    "bg-yellow-50"
                  )}

                  {renderInfoCard(
                    "Nama Pemilik",
                    processedData?.bankAccountName || "-",
                    <User className="w-5 h-5 text-orange-600" />,
                    "bg-orange-50"
                  )}
                </div>
              </div>

              {/* Tax Information */}
              {processedData?.taxStatus && (
                <div className="mb-8">
                  <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Percent className="w-5 h-5 text-red-600" />
                    Informasi Pajak
                  </h4>
                  <div className="bg-white rounded-lg border border-gray-200 p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-700">Status Pajak:</span>
                      <span className="font-semibold text-gray-900">
                        {processedData.taxStatus}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Salary Information */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-emerald-600" />
                  Informasi Gaji
                </h4>
                <div className="space-y-4">
                  <div className="bg-white rounded-lg border border-gray-200 p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-700">Gaji Pokok</span>
                      {processedData?.basicSalary && (
                        <DollarSign className="w-5 h-5 text-blue-600" />
                      )}
                    </div>
                    <p className="text-2xl font-bold text-blue-600">
                      {processedData?.basicSalary
                        ? formatCurrency(processedData.basicSalary)
                        : "-"}
                    </p>
                  </div>

                  <div className="bg-white rounded-lg border border-gray-200 p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-700">Tunjangan</span>
                      {processedData?.allowances && (
                        <Plus className="w-5 h-5 text-green-600" />
                      )}
                    </div>
                    <p className="text-2xl font-bold text-green-600">
                      {processedData?.allowances
                        ? formatCurrency(processedData.allowances)
                        : "-"}
                    </p>
                  </div>

                  <div className="bg-gradient-to-r from-emerald-500 to-green-500 rounded-lg border border-emerald-500 p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-white/90">Total Pendapatan</span>
                    </div>
                    <p className="text-3xl font-bold text-white">
                      {processedData?.totalIncome
                        ? formatCurrency(processedData.totalIncome)
                        : "-"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ),
      },
    ],
    [processedData]
  );

  if (!open) return null;

  return (
    <ModalDetail
      open={open}
      onClose={onClose}
      title="Detail Karyawan" // Kembalikan ke string biasa
      data={processedData}
      fields={fields}
      width="5xl"
      maxHeight="max-h-[70vh]"
      showFooter={true}
      gridColumns={2}
      loading={loading}
      customStyles={{
        content: "p-0 overflow-hidden",
        body: "p-6", // Remove padding karena header sudah ada di dalam
      }}
    />
  );
};

export default DetailModalEmployee;
