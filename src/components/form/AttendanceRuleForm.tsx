import React, { useState } from "react";
import MapSelector from "../MapSelector";
import Button from "../button/Button";
import { Search } from "lucide-react";

interface Props {
  values: any;
  setValues: (v: any) => void;
}

const AttendanceRuleForm: React.FC<Props> = ({ values, setValues }) => {
  const [search, setSearch] = useState("");
  const [searching, setSearching] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const [showMap, setShowMap] = useState(false);

  const handleSearch = async () => {
    if (!search.trim()) return;

    setValues({
      ...values,
      officeLatitude: null,
      officeLongitude: null,
    });

    setSearching(true);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
          search
        )}&format=json&limit=6`
      );
      const json = await res.json();
      setResults(Array.isArray(json) ? json : []);
    } catch (e) {
      console.error("Search error:", e);
    } finally {
      setSearching(false);
    }
  };

  const pickLocation = (item: any) => {
    setValues({
      ...values,
      officeLatitude: parseFloat(item.lat),
      officeLongitude: parseFloat(item.lon),
    });

    setSearch("");
    setResults([]);
  };

  return (
    <div className="space-y-6">
      {/* Search Input */}
      <div className="flex gap-2">
        <input
          className="border px-3 py-2 rounded-lg flex-1"
          placeholder="Cari lokasi kantor…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Button
          className="flex items-center px-4 py-2 rounded-lg text-white hover:opacity-70 transition-all"
          icon={<Search size={18} />}
          bgColor="#189AB4"
          onClick={handleSearch}
        />
      </div>

      {/* Results Dropdown */}
      {results.length > 0 && (
        <div className="border rounded-lg bg-white shadow p-3 space-y-2">
          {results.map((item, idx) => (
            <button
              key={idx}
              type="button"
              className="w-full text-left p-2 hover:bg-gray-100 rounded"
              onClick={() => pickLocation(item)}
            >
              <div className="font-medium">{item.display_name}</div>
              <div className="text-xs text-gray-500">
                lat: {item.lat}, lon: {item.lon}
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Map Preview */}
      <div className="space-y-2">
        <button
          type="button"
          className="px-3 py-2 border rounded-lg text-sm"
          onClick={() => setShowMap(!showMap)}
        >
          {showMap ? "Tutup Map" : "Buka Map"}
        </button>

        {showMap && (
          <MapSelector
            latitude={values.officeLatitude ?? 0}
            longitude={values.officeLongitude ?? 0}
            onSelect={(lat: number, lng: number) =>
              setValues({
                ...values,
                officeLatitude: lat,
                officeLongitude: lng,
              })
            }
          />
        )}
      </div>

      {/* Latitude & Longitude */}
      <div className="flex gap-4">
        <label className="flex flex-col gap-1 flex-1">
          <span className="text-sm font-medium text-gray-700">
            Office Latitude
          </span>
          <input
            type="number"
            value={values.officeLatitude ?? ""}
            onChange={(e) =>
              setValues({
                ...values,
                officeLatitude: e.target.value
                  ? parseFloat(e.target.value)
                  : null,
              })
            }
            className="border px-3 py-2 rounded-lg"
          />
        </label>

        <label className="flex flex-col gap-1 flex-1">
          <span className="text-sm font-medium text-gray-700">
            Office Longitude
          </span>
          <input
            type="number"
            value={values.officeLongitude ?? ""}
            onChange={(e) =>
              setValues({
                ...values,
                officeLongitude: e.target.value
                  ? parseFloat(e.target.value)
                  : null,
              })
            }
            className="border px-3 py-2 rounded-lg"
          />
        </label>
      </div>

      {/* Radius */}
      <label className="flex flex-col gap-1">
        <span className="text-sm font-medium text-gray-700">
          Radius Absensi (meter)
        </span>
        <input
          type="number"
          value={values.radiusMeters ?? ""}
          onChange={(e) =>
            setValues({
              ...values,
              radiusMeters: e.target.value ? parseInt(e.target.value) : null,
            })
          }
          className="border px-3 py-2 rounded-lg"
        />
      </label>

      {/* Max Late Minutes */}
      <label className="flex flex-col gap-1">
        <span className="text-sm font-medium text-gray-700">
          Toleransi Keterlambatan (menit)
        </span>
        <input
          type="number"
          value={values.maxLateMinutes ?? ""}
          onChange={(e) =>
            setValues({
              ...values,
              maxLateMinutes: e.target.value ? parseInt(e.target.value) : null,
            })
          }
          className="border px-3 py-2 rounded-lg"
        />
      </label>

      {/* Max Late Check-In */}
      <label className="flex flex-col gap-1">
        <span className="text-sm font-medium text-gray-700">
          Batas Waktu Check-In (sebelum jam kerja)
        </span>
        <input
          type="number"
          value={values.maxLateCheckIn ?? ""}
          onChange={(e) =>
            setValues({
              ...values,
              maxLateCheckIn: e.target.value ? parseInt(e.target.value) : 0,
            })
          }
          className="border px-3 py-2 rounded-lg"
        />
        <p className="text-xs">Menit sebelum shift selesai</p>
      </label>

      {/* Max Late Check-Out */}
      <label className="flex flex-col gap-1">
        <span className="text-sm font-medium text-gray-700">
          Batas Waktu Check-Out (setelah jam kerja)
        </span>
        <input
          type="number"
          value={values.maxLateCheckOut ?? ""}
          onChange={(e) =>
            setValues({
              ...values,
              maxLateCheckOut: e.target.value ? parseInt(e.target.value) : 0,
            })
          }
          className="border px-3 py-2 rounded-lg"
        />
        <p className="text-xs">Menit setelah shift selesai</p>
      </label>
    </div>
  );
};

export default AttendanceRuleForm;
