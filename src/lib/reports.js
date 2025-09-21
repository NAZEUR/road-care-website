import { readJSON, writeJSON } from "./storage";

const REPORTS_KEY = "rdr_reports";
const SEEDED_KEY = "rdr_seeded";

export function getReports() {
  return readJSON(REPORTS_KEY, []);
}

export function saveReports(list) {
  writeJSON(REPORTS_KEY, list);
}

export function addReport(report) {
  const list = getReports();
  list.push(report);
  saveReports(list);
}

export function getReportsByUser(userId) {
  return getReports().filter((r) => r.userId === userId);
}

export function getStats(reports) {
  const total = reports.length;
  const fixed = reports.filter((r) => r.status === "Sudah diperbaiki").length;
  const regionsFixed = new Set(
    reports
      .filter((r) => r.status === "Sudah diperbaiki")
      .map((r) => r.city || "")
  ).size;
  return { total, fixed, regionsFixed };
}

export function ensureSeedData() {
  const seeded = readJSON(SEEDED_KEY, false);
  if (seeded) return;
  const today = new Date().toISOString().slice(0, 10);
  const sample = [
    {
      id: "seed-1",
      title: "Jalan Berlubang",
      description: "Berlubang besar dekat pasar tradisional.",
      status: "Belum diperbaiki",
      lat: -2.9761,
      lng: 104.7754,
      city: "Palembang",
      image: "",
      createdAt: today,
      userId: "user123",
    },
    {
      id: "seed-2",
      title: "Aspal Retak",
      description: "Retak memanjang ±20m, rawan saat hujan.",
      status: "Dalam proses",
      lat: -6.2002,
      lng: 106.8168,
      city: "Jakarta",
      image: "",
      createdAt: today,
      userId: "user123",
    },
    {
      id: "seed-3",
      title: "Lubang Sedang",
      description: "Tepat di tikungan, sudah ditambal.",
      status: "Sudah diperbaiki",
      lat: -7.7972,
      lng: 110.3705,
      city: "Yogyakarta",
      image: "",
      createdAt: today,
      userId: "user999",
    },
    {
      id: "seed-4",
      title: "Trotoar Rusak",
      description: "Trotoar hancur di depan sekolah, membahayakan pejalan kaki.",
      status: "Belum diperbaiki",
      lat: -6.9147,
      lng: 107.6098,
      city: "Bandung",
      image: "",
      createdAt: today,
      userId: "user888",
    },
  ];
  saveReports(sample);
  writeJSON(SEEDED_KEY, true);
}
