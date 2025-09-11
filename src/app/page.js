"use client";

import { useEffect, useState } from "react";
import { ensureSeedData, getReports, getStats } from "../lib/reports";
import StatsCounter from "../components/StatsCounter";
import ReportTable from "../components/ReportTable";
import { useRouter } from "next/navigation";
import heroImg from "../public/images/welcoming-home-page.jpg";

<div
  style={{
    backgroundImage: `url(${heroImg.src})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
  }}
/>;

export default function HomePage() {
  const [reports, setReports] = useState([]);
  const [stats, setStats] = useState({ total: 0, fixed: 0, regionsFixed: 0 });
  const router = useRouter();

  useEffect(() => {
    ensureSeedData(); // seed sekali
    const r = getReports();
    setReports(r);
    setStats(getStats(r));
  }, []);

  return (
    <div>
      {/* Hero */}
      <section
        className="relative h-[360px] md:h-[420px] flex items-center justify-center"
        style={{
          backgroundImage: `url(${heroImg.src})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative z-10 text-center max-w-3xl mx-auto px-6">
          <h1 className="text-3xl md:text-5xl font-bold text-white">
            RoadCare
          </h1>
          <p className="mt-4 text-white/90 text-base md:text-lg">
            Laporkan kerusakan jalan di sekitar Anda. Bersama, kita wujudkan
            infrastruktur yang aman dan nyaman.
          </p>
          <div className="mt-6 flex gap-3 justify-center">
            <button
              onClick={() => router.push("/report")}
              className="px-5 py-2.5 rounded-lg bg-primary text-white font-medium hover:bg-blue-600"
            >
              Tambah Laporan
            </button>
            <button
              onClick={() => router.push("/map")}
              className="px-5 py-2.5 rounded-lg bg-white text-gray-900 font-medium hover:bg-gray-100"
            >
              Lihat Peta Laporan
            </button>
          </div>
        </div>
      </section>

      {/* About */}
      <section className="max-w-6xl mx-auto px-4 md:px-6 py-10 md:py-12">
        <div className="card p-6 md:p-8">
          <h2 className="text-2xl font-semibold">Tentang RoadCare</h2>
          <p className="mt-3 text-gray-700">
            RoadCare adalah platform pelaporan jalan rusak berbasis lokasi.
            Warga dapat melaporkan kondisi jalan, menambahkan foto, dan memantau
            status perbaikan. Data yang masuk membantu pemangku kebijakan
            mengambil keputusan yang lebih cepat dan tepat.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="max-w-6xl mx-auto px-4 md:px-6 pb-8">
        <StatsCounter
          total={stats.total}
          fixed={stats.fixed}
          regionsFixed={stats.regionsFixed}
        />
      </section>

      {/* Tabel Laporan Terbaru */}
      <section className="max-w-6xl mx-auto px-4 md:px-6 pb-16">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl md:text-2xl font-semibold">
            Laporan Kerusakan Terbaru
          </h3>
        </div>
        <ReportTable reports={reports.slice(0, 8)} />
        <div className="mt-6">
          <button
            onClick={() => router.push("/map")}
            className="px-5 py-2.5 rounded-lg bg-primary text-white font-medium hover:bg-blue-600"
          >
            Lihat Semua di Peta
          </button>
        </div>
      </section>
    </div>
  );
}
