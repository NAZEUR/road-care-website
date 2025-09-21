export function badgeClass(status) {
  const base = "badge";
  if (status === "Belum diperbaiki") return `${base} badge-danger`;
  if (status === "Dalam proses") return `${base} badge-warning`;
  return `${base} badge-success`;
}

export function formatDate(d) {
  const dt = new Date(d);
  if (isNaN(dt.getTime())) return "-";
  return dt.toLocaleDateString("id-ID", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}
