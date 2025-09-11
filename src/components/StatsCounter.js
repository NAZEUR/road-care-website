export default function StatsCounter({
  total = 0,
  fixed = 0,
  regionsFixed = 0,
}) {
  const items = [
    { label: "Laporan Masuk", value: total, color: "text-primary" },
    { label: "Sudah Diselesaikan", value: fixed, color: "text-success" },
    { label: "Wilayah Diperbaiki", value: regionsFixed, color: "text-primary" },
  ];
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {items.map((it) => (
        <div key={it.label} className="card p-6 text-center">
          <div className={`text-3xl font-bold ${it.color}`}>{it.value}</div>
          <div className="mt-1 text-gray-600">{it.label}</div>
        </div>
      ))}
    </div>
  );
}
