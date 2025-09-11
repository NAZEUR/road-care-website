import { badgeClass } from "../lib/utils";

export default function ReportCard({ report }) {
  return (
    <div className="card p-4">
      <div className="flex items-start gap-3">
        <div className="w-16 h-16 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
          {/* pakai gambar lokal jika ada, kalau tidak fallback warna */}
          {report.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={report.image}
              alt={report.title}
              className="w-full h-full object-cover"
            />
          ) : null}
        </div>
        <div className="min-w-0">
          <div className="flex items-center justify-between gap-2">
            <h4 className="font-semibold truncate">{report.title}</h4>
            <span className={badgeClass(report.status)}>{report.status}</span>
          </div>
          <p className="text-sm text-gray-600 line-clamp-2 mt-1">
            {report.description}
          </p>
          <div className="mt-2 text-xs text-gray-500">
            {report.city || "-"} • {report.createdAt}
          </div>
        </div>
      </div>
    </div>
  );
}
