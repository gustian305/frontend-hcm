import React from "react";
import { CheckCircle, XCircle } from "lucide-react";
import pricingPlans from "../data/pricingPlan";

const features = [
  "Jumlah User",
  "Akses Absensi",
  "Rekap Absensi",
  "Log Activity",
  "Reminder Jadwal Otomatis",
  "Eksport / Import Laporan",
];

const ComparisonSection: React.FC = () => {
  return (
    <section id="comparison" className="bg-white py-20 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Title */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-2">
            Comparison Plan
          </h2>
          <p className="text-gray-600 max-w-xl mx-auto">
            Lihat perbedaan fitur di setiap paket untuk memilih yang paling
            sesuai dengan kebutuhan tim Anda.
          </p>
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-xl shadow-md">
          <table className="min-w-full border-collapse table-auto">
            <thead className="bg-gray-50">
              <tr>
                <th className="font-bold text-left px-4 py-3 border-b">Fitur</th>
                {pricingPlans.map((plan) => (
                  <th
                    key={plan.id}
                    className={`text-center font-bold px-4 py-3 border-b ${
                      plan.highlight ? "text-teal-600" : "text-gray-900"
                    }`}
                  >
                    <div className="flex items-center justify-center gap-2">
                      {plan.name}
                      {plan.highlight && (
                        <span className="bg-teal-600 text-white text-xs font-semibold px-2 py-0.5 rounded-full">
                          Most Popular
                        </span>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {features.map((feature, idx) => (
                <tr key={idx} className="even:bg-gray-50">
                  <td className="font-semibold px-4 py-3 border-b">{feature}</td>
                  {pricingPlans.map((plan) => (
                    <td key={plan.id} className="text-center px-4 py-3 border-b">
                      {plan.features.some((f) =>
                        f.toLowerCase().includes(feature.toLowerCase())
                      ) ? (
                        <CheckCircle className="text-teal-600 w-5 h-5 mx-auto" />
                      ) : (
                        <XCircle className="text-gray-300 w-5 h-5 mx-auto" />
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

export default ComparisonSection;
