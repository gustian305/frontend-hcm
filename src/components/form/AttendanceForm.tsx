import React, { useEffect, useState } from "react";
import {
  AttendanceRequest,
  AttendanceInfo,
} from "../../service/attendanceService";
import {
  MapPin,
  RefreshCw,
  Clock,
  Shield,
  CheckCircle,
  XCircle,
  Navigation,
  Loader2,
  LogIn,
  LogOut,
  CheckCheck,
  Home,
  Briefcase,
} from "lucide-react";
import { RootState, AppDispatch } from "../../store";
import { useSelector, useDispatch } from "react-redux";
import {
  attendanceCheckInThunk,
  attendanceCheckOutThunk,
} from "../../store/slices/attendanceSlice";
import ModalAlert from "../modal/AlertModal";

export interface AttendanceFormProps {
  employeeId: string;
  shiftId?: string | null;
  shiftName?: string | null;
  lastAttendanceToday?: AttendanceInfo | null;
  todayAttendance?: AttendanceInfo | null;
}

// Define constants for clarity
const ATTENDANCE_STATUS = {
  NOT_CHECKED_IN: "NOT_CHECKED_IN",
  CHECKED_IN: "CHECKED_IN", // Sudah absen masuk, belum keluar
  COMPLETED: "COMPLETED", // Sudah absen masuk dan keluar
} as const;

const AttendanceForm: React.FC<AttendanceFormProps> = ({
  employeeId,
  shiftId,
  shiftName,
  todayAttendance,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const attendanceError = useSelector(
    (state: RootState) => state.attendance.error
  );

  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [nowTime, setNowTime] = useState("00:00:00");
  const [isLocationGranted, setIsLocationGranted] = useState(false);

  // Modal states
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalTitle, setModalTitle] = useState("");

  // TIMER JAM REAL-TIME
  useEffect(() => {
    const timer = setInterval(() => {
      const d = new Date();
      setNowTime(
        `${String(d.getHours()).padStart(2, "0")}:${String(
          d.getMinutes()
        ).padStart(2, "0")}:${String(d.getSeconds()).padStart(2, "0")}`
      );
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // CHECK GEOLOCATION PERMISSION ON MOUNT
  useEffect(() => {
    if (navigator.permissions) {
      navigator.permissions
        .query({ name: "geolocation" as PermissionName })
        .then((result) => {
          setIsLocationGranted(result.state === "granted");
          result.onchange = () => {
            setIsLocationGranted(result.state === "granted");
          };
        });
    }
  }, []);

  // AUTO-FETCH LOCATION ON FIRST LOAD
  useEffect(() => {
    if (isLocationGranted) {
      fetchLocation();
    }
  }, [isLocationGranted]);

  // FETCH LOCATION
  const fetchLocation = () => {
    if (!navigator.geolocation) {
      setLocationError("Browser tidak mendukung geolocation.");
      return;
    }

    setLoadingLocation(true);

    const onSuccess = (pos: GeolocationPosition) => {
      setLatitude(pos.coords.latitude);
      setLongitude(pos.coords.longitude);
      setLocationError(null);
      setLoadingLocation(false);
      setIsLocationGranted(true);
    };

    const onError = (err: GeolocationPositionError) => {
      let msg = "Gagal mendapatkan lokasi.";
      if (err.code === err.PERMISSION_DENIED) {
        msg = "Akses lokasi ditolak. Aktifkan izin lokasi di browser.";
        setIsLocationGranted(false);
      } else if (err.code === err.POSITION_UNAVAILABLE) {
        msg = "Lokasi tidak tersedia. Pastikan GPS aktif.";
      } else if (err.code === err.TIMEOUT) {
        msg = "Timeout saat mengambil lokasi. Coba lagi.";
      }
      setLocationError(msg);
      setLoadingLocation(false);
    };

    navigator.geolocation.getCurrentPosition(onSuccess, onError, {
      enableHighAccuracy: true,
      timeout: 30000,
      maximumAge: 0,
    });
  };

  const hasCheckedInToday = todayAttendance?.checkInTime;
  const hasCheckedOutToday = todayAttendance?.checkOutTime;
  
  // DEBUG LOG
  useEffect(() => {
    console.log("DEBUG Attendance Data:", {
      todayAttendance,
      hasCheckedInToday,
      hasCheckedOutToday,
      checkInTime: todayAttendance?.checkInTime,
      checkOutTime: todayAttendance?.checkOutTime,
      attendanceStatus: hasCheckedOutToday
        ? ATTENDANCE_STATUS.COMPLETED
        : hasCheckedInToday
        ? ATTENDANCE_STATUS.CHECKED_IN
        : ATTENDANCE_STATUS.NOT_CHECKED_IN,
    });
  }, [todayAttendance, hasCheckedInToday, hasCheckedOutToday]);

  // STATUS ABSENSI - SESUAI DENGAN BACKEND
  const attendanceStatus = hasCheckedOutToday
    ? ATTENDANCE_STATUS.COMPLETED // Sudah absen masuk dan keluar
    : hasCheckedInToday
    ? ATTENDANCE_STATUS.CHECKED_IN // Sudah absen masuk, belum keluar
    : ATTENDANCE_STATUS.NOT_CHECKED_IN; // Belum absen sama sekali

  // Tentukan action yang harus ditampilkan - SESUAI DENGAN BACKEND LOGIC
  const action = attendanceStatus === ATTENDANCE_STATUS.COMPLETED
    ? {
        label: "Absensi Selesai",
        color: "from-gray-400 to-gray-500 cursor-not-allowed",
        icon: <CheckCheck className="w-5 h-5" />,
        disabled: true,
        type: "completed" as const,
      }
    : attendanceStatus === ATTENDANCE_STATUS.NOT_CHECKED_IN
    ? {
        label: "Absen Masuk",
        color: "from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600",
        icon: <Briefcase className="w-5 h-5" />,
        disabled: false,
        type: "checkin" as const,
      }
    : {
        label: "Absen Keluar",
        color: "from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600",
        icon: <Home className="w-5 h-5" />,
        disabled: false,
        type: "checkout" as const,
      };

  // CONDITION FOR BUTTON DISABLE - SESUAI DENGAN BACKEND REQUIREMENTS
  const isButtonDisabled = () => {
    // Jika sudah absen keluar (COMPLETED), tombol selalu disabled
    if (attendanceStatus === ATTENDANCE_STATUS.COMPLETED) return true;

    // Kondisi lainnya
    if (submitting) return true;
    if (loadingLocation) return true;
    if (locationError) return true;
    if (!latitude || !longitude) return true;
    
    // PERUBAHAN PENTING: Backend membutuhkan shiftId untuk BAIK check-in MAUPUN check-out
    // Baik check-in maupun check-out membutuhkan shiftId berdasarkan backend
    if (!shiftId) return true;

    return false;
  };

  const showConfirmation = () => {
    // Jika sudah COMPLETED, tampilkan pesan error
    if (attendanceStatus === ATTENDANCE_STATUS.COMPLETED) {
      setModalTitle("Absensi Telah Selesai");
      setModalMessage(
        "Anda sudah menyelesaikan absensi hari ini (sudah absen masuk dan keluar). Tidak dapat melakukan absensi lagi."
      );
      setShowErrorModal(true);
      return;
    }

    const actionText = attendanceStatus === ATTENDANCE_STATUS.NOT_CHECKED_IN ? "masuk" : "keluar";
    const confirmTitle = attendanceStatus === ATTENDANCE_STATUS.NOT_CHECKED_IN 
      ? "Konfirmasi Absen Masuk" 
      : "Konfirmasi Absen Keluar";
    
    let confirmMessage = `Apakah Anda yakin ingin melakukan absen ${actionText} pada pukul ${nowTime}? Pastikan Anda berada di lokasi kerja yang sesuai.`;
    
    // Tambahkan informasi status saat ini
    if (attendanceStatus === ATTENDANCE_STATUS.CHECKED_IN) {
      confirmMessage += `\n\nAnda sudah absen masuk pada pukul ${formatTime(todayAttendance?.checkInTime)}.`;
    }

    setModalTitle(confirmTitle);
    setModalMessage(confirmMessage);
    setShowConfirmModal(true);
  };

  const handleSubmit = async () => {
    // Double check: jika sudah COMPLETED, jangan proses
    if (attendanceStatus === ATTENDANCE_STATUS.COMPLETED) {
      setModalTitle("Absensi Telah Selesai");
      setModalMessage(
        "Anda sudah menyelesaikan absensi hari ini. Tidak dapat melakukan absensi lagi."
      );
      setShowErrorModal(true);
      return;
    }

    if (isButtonDisabled()) return;

    const payload: AttendanceRequest = {
      employeeId,
      shiftId: shiftId || undefined, // Backend membutuhkan shiftId untuk check-in dan check-out
      latitude,
      longitude,
    };

    setSubmitting(true);
    try {
      if (attendanceStatus === ATTENDANCE_STATUS.NOT_CHECKED_IN) {
        // Absen Masuk - Backend akan cek apakah sudah check-in hari ini
        await dispatch(attendanceCheckInThunk(payload)).unwrap();
        setModalTitle("Absen Masuk Berhasil");
        setModalMessage(
          `Absen masuk berhasil pada pukul ${nowTime}. Selamat bekerja!`
        );
        setShowSuccessModal(true);
      } else {
        // Absen Keluar - Backend akan cek:
        // 1. Apakah sudah check-in hari ini
        // 2. Apakah belum check-out hari ini
        await dispatch(attendanceCheckOutThunk(payload)).unwrap();
        setModalTitle("Absen Keluar Berhasil");
        setModalMessage(
          `Absen keluar berhasil pada pukul ${nowTime}. Terima kasih!`
        );
        setShowSuccessModal(true);
      }
    } catch (err: any) {
      console.error("Attendance error:", err);

      let errorTitle = "Absen Gagal";
      let errorMessage = "Terjadi kesalahan saat melakukan absen. Silakan coba lagi.";

      // Handle specific errors dari backend
      if (err?.message?.toLowerCase().includes("sudah check-in") || 
          err?.message?.toLowerCase().includes("anda sudah check-in")) {
        errorTitle = "Sudah Absen Masuk";
        errorMessage = "Anda sudah melakukan absen masuk hari ini. Tidak dapat melakukan absen masuk lagi.";
      } else if (err?.message?.toLowerCase().includes("belum melakukan check-in") ||
                err?.message?.toLowerCase().includes("belum absen masuk")) {
        errorTitle = "Belum Absen Masuk";
        errorMessage = "Anda belum melakukan absen masuk hari ini. Silakan absen masuk terlebih dahulu.";
      } else if (err?.message?.toLowerCase().includes("sudah check-out") || 
                err?.message?.toLowerCase().includes("anda sudah check-out")) {
        errorTitle = "Sudah Absen Keluar";
        errorMessage = "Anda sudah melakukan absen keluar hari ini. Tidak dapat melakukan absen keluar lagi.";
      } else if (err?.message?.toLowerCase().includes("shift tidak aktif")) {
        errorTitle = "Shift Tidak Aktif";
        errorMessage = "Shift Anda tidak aktif hari ini. Silakan hubungi administrator.";
      } else if (err?.message?.toLowerCase().includes("out of range") ||
                err?.message?.toLowerCase().includes("di luar jangkauan")) {
        errorTitle = "Lokasi Tidak Sesuai";
        errorMessage = "Anda berada di luar radius lokasi kerja yang diizinkan untuk melakukan absen.";
      } else if (err?.message?.toLowerCase().includes("employee tidak ditemukan")) {
        errorTitle = "Karyawan Tidak Ditemukan";
        errorMessage = "Data karyawan tidak ditemukan. Silakan hubungi administrator.";
      } else if (err?.message?.toLowerCase().includes("attendance rule tidak ditemukan")) {
        errorTitle = "Rule Absensi Tidak Ditemukan";
        errorMessage = "Rule absensi perusahaan tidak ditemukan. Silakan hubungi administrator.";
      }

      setModalTitle(errorTitle);
      setModalMessage(errorMessage);
      setShowErrorModal(true);
    } finally {
      setSubmitting(false);
      setShowConfirmModal(false);
    }
  };

  const handleModalConfirm = () => {
    handleSubmit();
  };

  // Get formatted times for display
  const formatTime = (dateTimeString: string | undefined) => {
    if (!dateTimeString) return "-";
    try {
      const date = new Date(dateTimeString);
      return date.toLocaleTimeString("id-ID", { 
        hour: "2-digit", 
        minute: "2-digit",
        hour12: false 
      });
    } catch {
      return "-";
    }
  };

  // Get display text for status
  const getStatusDisplayText = () => {
    switch (attendanceStatus) {
      case ATTENDANCE_STATUS.COMPLETED:
        return "Absensi Selesai";
      case ATTENDANCE_STATUS.CHECKED_IN:
        return "Sudah Absen Masuk";
      case ATTENDANCE_STATUS.NOT_CHECKED_IN:
        return "Belum Absen Masuk";
      default:
        return "Status tidak diketahui";
    }
  };

  // Get status color
  const getStatusColor = () => {
    switch (attendanceStatus) {
      case ATTENDANCE_STATUS.COMPLETED:
        return {
          bg: "bg-green-50/70 border border-green-200",
          text: "text-green-600",
          dot: "bg-green-400"
        };
      case ATTENDANCE_STATUS.CHECKED_IN:
        return {
          bg: "bg-blue-50/70 border border-blue-200",
          text: "text-blue-600",
          dot: "bg-blue-400"
        };
      case ATTENDANCE_STATUS.NOT_CHECKED_IN:
        return {
          bg: "bg-amber-50/70 border border-amber-200",
          text: "text-amber-600",
          dot: "bg-amber-400"
        };
      default:
        return {
          bg: "bg-gray-50/70 border border-gray-200",
          text: "text-gray-600",
          dot: "bg-gray-400"
        };
    }
  };

  // RENDER
  return (
    <>
      <div className="max-w-5xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* TIME CARD */}
          <div className="bg-white/80 backdrop-blur-lg border border-gray-200/50 rounded-2xl p-6 text-center shadow-xl shadow-blue-100/50">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-full mb-4">
              <Clock className="w-7 h-7 text-blue-600" />
            </div>
            <p className="text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-2">
              {nowTime}
            </p>
            <p className="text-sm text-gray-500 font-medium">
              {new Date().toLocaleDateString("id-ID", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>

          {/* LOCATION CARD */}
          <div className="bg-gradient-to-br from-emerald-50 to-white border border-emerald-100 rounded-2xl p-6 shadow-xl shadow-emerald-100/30">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-100 to-green-100 rounded-full flex items-center justify-center">
                  <Navigation className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-800">Lokasi GPS</h3>
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        latitude
                          ? "bg-emerald-500 animate-pulse"
                          : "bg-gray-300"
                      }`}
                    ></div>
                    <span
                      className={`text-xs ${
                        latitude ? "text-emerald-600" : "text-gray-500"
                      }`}
                    >
                      {latitude ? "Lokasi aktif" : "Lokasi belum aktif"}
                    </span>
                  </div>
                </div>
              </div>
              {latitude ? (
                <CheckCircle className="w-5 h-5 text-emerald-500" />
              ) : (
                <XCircle className="w-5 h-5 text-gray-400" />
              )}
            </div>

            <div className="bg-white/70 rounded-xl p-4 mb-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs text-gray-500 font-medium mb-1">
                    Latitude
                  </p>
                  <p className="font-mono font-bold text-gray-800">
                    {latitude?.toFixed(6) || "---.------"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium mb-1">
                    Longitude
                  </p>
                  <p className="font-mono font-bold text-gray-800">
                    {longitude?.toFixed(6) || "---.------"}
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={fetchLocation}
              disabled={loadingLocation || attendanceStatus === ATTENDANCE_STATUS.COMPLETED}
              className="w-full bg-gradient-to-r from-emerald-500 to-green-500 text-white py-3 rounded-xl font-medium hover:from-emerald-600 hover:to-green-600 transition-all duration-300 shadow-md hover:shadow-emerald-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loadingLocation ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Mengambil lokasi...
                </>
              ) : (
                <>
                  <RefreshCw className="w-4 h-4" />
                  Perbarui Lokasi
                </>
              )}
            </button>

            {locationError && (
              <div className="mt-4 p-3 bg-red-50 border border-red-100 rounded-lg">
                <p className="text-red-600 text-sm flex items-center gap-2">
                  <XCircle className="w-4 h-4" />
                  {locationError}
                </p>
              </div>
            )}
          </div>

          {/* STATUS CARD */}
          <div className="bg-gradient-to-br from-purple-50 to-white border border-purple-100 rounded-2xl p-6 shadow-xl shadow-purple-100/30">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-100 to-violet-100 rounded-full flex items-center justify-center">
                <Shield className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h3 className="font-bold text-gray-800">Status Absensi</h3>
                <p className="text-sm text-gray-500">
                  Informasi presensi hari ini
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-white/70 rounded-xl p-4">
                <p className="text-xs text-gray-500 font-medium mb-1">
                  Shift Aktif
                </p>
                <p className="font-bold text-lg text-gray-800">
                  {shiftName || "Tidak ada shift"}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  ID: {shiftId || "Tidak ada"}
                </p>
              </div>

              <div className={`rounded-xl p-4 ${getStatusColor().bg}`}>
                <p className="text-xs text-gray-500 font-medium mb-1">
                  Status Absensi
                </p>
                <div className="flex items-center justify-between mb-2">
                  <p className={`font-bold ${getStatusColor().text}`}>
                    {getStatusDisplayText()}
                  </p>
                  <div className={`w-3 h-3 rounded-full ${getStatusColor().dot}`}></div>
                </div>

                {/* Display check-in time */}
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                  <Briefcase className="w-3 h-3" />
                  <span>Masuk:</span>
                  <span className="font-medium">
                    {formatTime(todayAttendance?.checkInTime) || "-"}
                  </span>
                  {todayAttendance?.checkInNote && (
                    <span className="text-xs text-gray-500 ml-1">
                      ({todayAttendance.checkInNote})
                    </span>
                  )}
                </div>

                {/* Display check-out time */}
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Home className="w-3 h-3" />
                  <span>Keluar:</span>
                  <span className="font-medium">
                    {formatTime(todayAttendance?.checkOutTime) || "-"}
                  </span>
                  {todayAttendance?.checkOutNote && (
                    <span className="text-xs text-gray-500 ml-1">
                      ({todayAttendance.checkOutNote})
                    </span>
                  )}
                </div>

                {/* Display work duration */}
                {todayAttendance?.workDuration && (
                  <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                    <Clock className="w-3 h-3" />
                    <span>Durasi kerja:</span>
                    <span className="font-medium">
                      {todayAttendance.workDuration}
                    </span>
                  </div>
                )}

                {attendanceStatus === ATTENDANCE_STATUS.COMPLETED && (
                  <p className="text-xs text-green-600 font-medium mt-2 flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" />
                    ✓ Absensi hari ini telah selesai
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* MAIN ACTION BUTTON */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200"></div>
          </div>
          <div className="relative flex justify-center">
            <div className="px-8">
              <button
                onClick={showConfirmation}
                disabled={isButtonDisabled()}
                className={`
                  group relative px-16 py-3 rounded-2xl font-bold text-white text-lg
                  bg-gradient-to-r ${action.color}
                  shadow-2xl ${
                    attendanceStatus === ATTENDANCE_STATUS.COMPLETED
                      ? "shadow-gray-200/50"
                      : "shadow-blue-200/50 hover:shadow-xl hover:shadow-blue-300/50"
                  }
                  transition-all duration-300 transform ${
                    attendanceStatus === ATTENDANCE_STATUS.COMPLETED
                      ? ""
                      : "hover:-translate-y-1"
                  }
                  disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:transform-none
                  overflow-hidden flex items-center justify-center gap-3
                `}
              >
                {/* ANIMATED BACKGROUND (only if not completed) */}
                {attendanceStatus !== ATTENDANCE_STATUS.COMPLETED && (
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                )}

                <div className="relative flex items-center justify-center gap-3">
                  {submitting ? (
                    <>
                      <Loader2 className="w-6 h-6 animate-spin" />
                      <span>Memproses...</span>
                    </>
                  ) : attendanceStatus === ATTENDANCE_STATUS.COMPLETED ? (
                    <>
                      <CheckCheck className="w-6 h-6" />
                      <span>Absensi Selesai</span>
                    </>
                  ) : (
                    <>
                      {action.icon}
                      <span>{action.label}</span>
                    </>
                  )}
                </div>
              </button>
            </div>
          </div>

          {/* REQUIREMENT HINTS */}
          {attendanceStatus !== ATTENDANCE_STATUS.COMPLETED && (
            <div className="mt-12 text-center">
              <p className="text-sm text-gray-500 mb-3">
                Syarat untuk melakukan absensi:
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <div
                  className={`flex items-center gap-2 px-4 py-2 rounded-full ${
                    latitude
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-gray-100 text-gray-500"
                  }`}
                >
                  <div
                    className={`w-2 h-2 rounded-full ${
                      latitude ? "bg-emerald-500" : "bg-gray-400"
                    }`}
                  ></div>
                  <span className="text-sm font-medium">Lokasi aktif</span>
                </div>
                <div
                  className={`flex items-center gap-2 px-4 py-2 rounded-full ${
                    !locationError
                      ? "bg-blue-100 text-blue-700"
                      : "bg-gray-100 text-gray-500"
                  }`}
                >
                  <div
                    className={`w-2 h-2 rounded-full ${
                      !locationError ? "bg-blue-500" : "bg-gray-400"
                    }`}
                  ></div>
                  <span className="text-sm font-medium">GPS stabil</span>
                </div>
                {/* PERUBAHAN PENTING: Shift diperlukan untuk BAIK check-in MAUPUN check-out */}
                <div
                  className={`flex items-center gap-2 px-4 py-2 rounded-full ${
                    shiftId
                      ? "bg-purple-100 text-purple-700"
                      : "bg-gray-100 text-gray-500"
                  }`}
                >
                  <div
                    className={`w-2 h-2 rounded-full ${
                      shiftId ? "bg-purple-500" : "bg-gray-400"
                    }`}
                  ></div>
                  <span className="text-sm font-medium">Shift aktif</span>
                </div>
                {attendanceStatus === ATTENDANCE_STATUS.CHECKED_IN && (
                  <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-green-100 text-green-700">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    <span className="text-sm font-medium">
                      Sudah absen masuk
                    </span>
                  </div>
                )}
              </div>
              
              {/* Warning jika tidak ada shift */}
              {!shiftId && (
                <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg max-w-md mx-auto">
                  <p className="text-sm text-yellow-700 text-center">
                    <strong>Peringatan:</strong> Shift aktif tidak ditemukan. 
                    Baik absen masuk maupun keluar membutuhkan shift yang aktif hari ini.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* MODAL ALERTS */}
      <ModalAlert
        open={showConfirmModal}
        type="confirm"
        title={modalTitle}
        message={modalMessage}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={handleModalConfirm}
        confirmText="Ya, Lanjutkan"
        cancelText="Batal"
      />

      <ModalAlert
        open={showSuccessModal}
        type="success"
        title={modalTitle}
        message={modalMessage}
        onClose={() => setShowSuccessModal(false)}
        autoCloseDuration={5000}
      />

      <ModalAlert
        open={showErrorModal}
        type="error"
        title={modalTitle}
        message={modalMessage}
        onClose={() => setShowErrorModal(false)}
        autoCloseDuration={7000}
      />
    </>
  );
};

export default AttendanceForm;