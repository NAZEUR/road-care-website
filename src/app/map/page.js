"use client";

import { useEffect, useState } from "react";
import { getReports } from "../../lib/reports";
import MapView from "../../components/MapView";
import ReportCard from "../../components/ReportCard";

export default function MapPage() {
  const [reports, setReports] = useState([]);

  useEffect(() => {
    setReports(getReports());
  }, []);

  return (
    <div className="relative h-[calc(100vh-72px-64px)] md:h-[calc(100vh-80px-80px)]">
      <div className="absolute inset-0">
        <MapView reports={reports} />
      </div>
      <aside className="absolute right-0 top-0 h-full w-full md:w-[380px] bg-white/90 backdrop-blur-md overflow-y-auto border-l border-gray-200">
        <div className="p-4">
          <h2 className="text-lg font-semibold mb-3">Daftar Laporan</h2>
          <div className="space-y-3">
            {reports.length === 0 ? (
              <p className="text-sm text-gray-600">Belum ada laporan.</p>
            ) : (
              reports
                .slice()
                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                .map((r) => <ReportCard key={r.id} report={r} />)
            )}
          </div>
        </div>
      </aside>
    </div>
  );
}
