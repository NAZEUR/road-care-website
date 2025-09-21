import { badgeClass, formatDate } from "../lib/utils";
import { useState } from "react";
import ReportDetail from "./ReportDetail";
import { saveReports } from "../lib/reports";

export default function ReportTable({ reports = [] }) {
  const [selected, setSelected] = useState(null);
  const [data, setData] = useState(reports);

  function handleUpdate(updated) {
    const newList = data.map((r) => (r.id === updated.id ? updated : r));
    setData(newList);
    saveReports(newList);
    setSelected(null);
  }

  function handleDelete(id) {
    const newList = data.filter((r) => r.id !== id);
    setData(newList);
    saveReports(newList);
    setSelected(null);
  }

  return (
    <div className="card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 text-left">
            <tr className="text-gray-700">
              <th className="px-5 py-3">Lokasi</th>
              <th className="px-5 py-3">Deskripsi</th>
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3">Tanggal</th>
              <th className="px-5 py-3">Aksi</th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {data.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-5 py-6 text-center text-gray-600">
                  Belum ada laporan.
                </td>
              </tr>
            ) : (
              data
                .slice()
                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                .map((r) => (
                  <tr key={r.id} className="border-t border-gray-100">
                    <td className="px-5 py-3 whitespace-nowrap">
                      <div className="font-medium">{r.title}</div>
                      <div className="text-gray-600 text-xs">
                        {r.city && r.city.trim() ? r.city : "Tidak diketahui"}
                      </div>
                    </td>
                    <td className="px-5 py-3 max-w-[360px]">
                      <p className="text-gray-700 line-clamp-2">
                        {r.description}
                      </p>
                    </td>
                    <td className="px-5 py-3">
                      <span className={badgeClass(r.status)}>{r.status}</span>
                    </td>
                    <td className="px-5 py-3">{formatDate(r.createdAt)}</td>
                    <td className="px-5 py-3">
                      <button
                        className="inline-flex items-center px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200"
                        onClick={() => setSelected(r)}
                      >
                        Detail
                      </button>
                    </td>
                  </tr>
                ))
            )}
          </tbody>
        </table>
      </div>
      {selected && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full">
            <ReportDetail
              report={selected}
              onUpdate={handleUpdate}
              onDelete={handleDelete}
            />
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              onClick={() => setSelected(null)}
            >
              &times;
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
