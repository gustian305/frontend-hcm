import React, { useEffect, useState } from "react";
import { AttendanceRequest } from "../../service/attendanceService";
import { MapPin, RefreshCw, Clock, Shield, Calendar } from "lucide-react";

interface AttendanceFormProps {
  employeeId: string;
  shiftId?: string | null;
  shiftName?: string | null;
  lastAttendanceToday?: string | null;
  todayAttendance?: any;
  onSubmit: (payload: AttendanceRequest) => Promise<void>;
}

const AttendanceForm: React.FC<AttendanceFormProps> = ({
  employeeId,
  shiftId,
  shiftName,
  lastAttendanceToday,
  todayAttendance,
  onSubmit,
}) => {
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [nowTime, setNowTime] = useState<string>("00:00:00");
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Determine button label and action
  const getAttendanceAction = () => {
    if (!lastAttendanceToday || lastAttendanceToday === "CHECK_OUT") {
      return {
        label: "Absen Masuk",
        type: "CHECK_IN",
        color: "bg-blue-600 hover:bg-blue-700",
        icon: "👋",
      };
    } else if (lastAttendanceToday === "CHECK_IN") {
      return {
        label: "Absen Keluar",
        type: "CHECK_OUT",
        color: "bg-green-600 hover:bg-green-700",
        icon: "🚪",
      };
    } else {
      return {
        label: "Absen",
        type: "CHECK_IN",
        color: "bg-gray-600 hover:bg-gray-700",
        icon: "📝",
      };
    }
  };

  const action = getAttendanceAction();

  // Update clock every second
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

  // Get current location
  const fetchLocation = () => {
    if (!navigator.geolocation) {
      setLocationError("Browser tidak mendukung geolocation.");
      return;
    }

    setLoadingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLatitude(pos.coords.latitude);
        setLongitude(pos.coords.longitude);
        setLoadingLocation(false);
        setLocationError(null);

        // Log accuracy for debugging
        console.log("Location accuracy:", pos.coords.accuracy, "meters");
      },
      (error) => {
        let errorMessage = "Gagal mendapatkan lokasi.";
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage =
              "Akses lokasi ditolak. Izinkan akses lokasi di pengaturan browser.";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = "Informasi lokasi tidak tersedia.";
            break;
          case error.TIMEOUT:
            errorMessage = "Permintaan lokasi timeout.";
            break;
        }
        setLocationError(errorMessage);
        setLoadingLocation(false);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
    );
  };

  // Initial location fetch
  useEffect(() => {
    fetchLocation();
  }, []);

  // Calculate if button should be disabled
  const isDisabled = () => {
    return (
      submitting ||
      loadingLocation ||
      !!locationError ||
      !latitude ||
      !longitude ||
      latitude === 0 ||
      longitude === 0
    );
  };

  const handleSubmit = async () => {
    if (isDisabled()) return;

    const payload: AttendanceRequest = {
      employeeId,
      shiftId: shiftId || undefined,
      latitude,
      longitude,
    };

    setSubmitting(true);
    try {
      await onSubmit(payload);
    } catch (error) {
      console.error("Attendance submission failed:", error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white border border-gray-200 rounded-xl shadow-lg space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-xl font-bold text-gray-800">Sistem Absensi</h2>
        <p className="text-gray-600 mt-1">
          Pastikan lokasi Anda aktif untuk melakukan absensi
        </p>
      </div>

      {/* Information Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Time Card */}
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-5 flex flex-col items-center justify-center">
          <div className="flex items-center gap-3 mb-3">
            <Clock className="w-6 h-6 text-blue-600" />
            <p className="text-blue-700 font-medium">Waktu Saat Ini</p>
          </div>
          <p className="text-4xl font-bold text-blue-900 tracking-wider">
            {nowTime}
          </p>
          <p className="text-sm text-blue-600 mt-2">
            {new Date().toLocaleDateString("id-ID", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>

        {/* Location Card */}
        <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 border border-emerald-200 rounded-xl p-5">
          <div className="flex items-center gap-3 mb-4">
            <MapPin className="w-6 h-6 text-emerald-600" />
            <p className="text-emerald-700 font-medium">Lokasi GPS</p>
          </div>

          {loadingLocation ? (
            <div className="flex items-center gap-2">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-emerald-600"></div>
              <p className="text-emerald-600">Mendeteksi lokasi...</p>
            </div>
          ) : locationError ? (
            <div className="space-y-2">
              <p className="text-red-600 text-sm">{locationError}</p>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <p className="text-sm text-gray-600">Latitude:</p>
                <p className="font-medium text-gray-800">
                  {latitude?.toFixed(6)}
                </p>
              </div>
              <div className="flex justify-between items-center">
                <p className="text-sm text-gray-600">Longitude:</p>
                <p className="font-medium text-gray-800">
                  {longitude?.toFixed(6)}
                </p>
              </div>
              {shiftId && (
                <div className="flex justify-between items-center mt-3 pt-3 border-t border-emerald-200">
                  <p className="text-sm text-gray-600">Shift ID:</p>
                  <p className="font-medium text-gray-800">{shiftId}</p>
                </div>
              )}
            </div>
          )}

          <button
            type="button"
            onClick={fetchLocation}
            disabled={loadingLocation}
            className={`mt-4 w-full px-4 py-2 rounded-lg font-medium flex items-center justify-center gap-2 transition ${
              loadingLocation
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-emerald-600 text-white hover:bg-emerald-700"
            }`}
          >
            <RefreshCw
              className={`w-4 h-4 ${loadingLocation ? "animate-spin" : ""}`}
            />
            {loadingLocation ? "Mengupdate..." : "Update Lokasi"}
          </button>
        </div>

        {/* Status Card */}
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-xl p-5">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="w-6 h-6 text-purple-600" />
            <p className="text-purple-700 font-medium">Status Absensi</p>
          </div>

          <div className="space-y-3">
            {shiftName && (
              <div className="flex items-center gap-2 mb-3 p-2 bg-white rounded-lg">
                <Calendar className="w-4 h-4 text-purple-600" />
                <div>
                  <p className="text-sm font-medium text-gray-800">
                    {shiftName}
                  </p>
                  {shiftId && (
                    <p className="text-xs text-gray-500">ID: {shiftId}</p>
                  )}
                </div>
              </div>
            )}
            <div className="flex justify-between items-center">
              <p className="text-sm text-gray-600">Status Hari Ini:</p>
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  !lastAttendanceToday || lastAttendanceToday === "CHECK_OUT"
                    ? "bg-gray-100 text-gray-800"
                    : "bg-blue-100 text-blue-800"
                }`}
              >
                {!lastAttendanceToday || lastAttendanceToday === "CHECK_OUT"
                  ? "Belum Absen"
                  : "Sudah Absen"}
              </span>
            </div>

            {todayAttendance?.checkInTime && (
              <div className="flex justify-between items-center">
                <p className="text-sm text-gray-600">Check In:</p>
                <p className="font-medium text-gray-800">
                  {todayAttendance.checkInTime}
                </p>
              </div>
            )}

            {todayAttendance?.checkOutTime && (
              <div className="flex justify-between items-center">
                <p className="text-sm text-gray-600">Check Out:</p>
                <p className="font-medium text-gray-800">
                  {todayAttendance.checkOutTime}
                </p>
              </div>
            )}

            <div className="pt-3 border-t border-purple-200 mt-3">
              <p className="text-xs text-purple-600">
                {action.type === "CHECK_IN"
                  ? "Silakan tekan tombol untuk absen masuk"
                  : "Silakan tekan tombol untuk absen keluar"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="text-center pt-4">
        <button
          type="button"
          onClick={handleSubmit}
          disabled={isDisabled()}
          className={`px-10 py-4 text-lg rounded-xl font-bold transition-all duration-300 flex items-center justify-center gap-3 mx-auto ${
            isDisabled()
              ? "bg-gray-400 cursor-not-allowed"
              : action.color +
                " shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          }`}
        >
          <span className="text-xl">{action.icon}</span>
          {submitting ? "Memproses..." : action.label}
        </button>

        <div className="mt-4 space-y-2">
          {isDisabled() && (
            <p className="text-sm text-gray-500">
              {locationError
                ? locationError
                : "Lokasi diperlukan untuk absensi"}
            </p>
          )}

          <p className="text-xs text-gray-400">
            Pastikan Anda berada di lokasi kerja yang ditentukan
          </p>
        </div>
      </div>
    </div>
  );
};

export default AttendanceForm;
