import { badgeClass, formatDate } from "../lib/utils";

export default function ReportTable({ reports = [] }) {
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
            {reports.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-5 py-6 text-center text-gray-600">
                  Belum ada laporan.
                </td>
              </tr>
            ) : (
              reports
                .slice()
                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                .map((r) => (
                  <tr key={r.id} className="border-t border-gray-100">
                    <td className="px-5 py-3 whitespace-nowrap">
                      <div className="font-medium">{r.title}</div>
                      <div className="text-gray-600 text-xs">
                        {r.city || "-"}
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
                      <a
                        href="/map"
                        className="inline-flex items-center px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200"
                      >
                        Detail
                      </a>
                    </td>
                  </tr>
                ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
