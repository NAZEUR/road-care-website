import { useState } from "react";
import { formatDate } from "../lib/utils";
import { getReports, saveReports } from "../lib/reports";

export default function ReportDetail({ report, onUpdate, onDelete }) {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ ...report });

  function handleUpdate() {
    const updated = { ...form };
    onUpdate(updated);
    setEditing(false);
  }

  function handleDelete() {
    if (confirm("Yakin ingin menghapus laporan ini?")) {
      onDelete(report.id);
    }
  }

  return (
    <div className="p-4">
      {editing ? (
        <div className="space-y-3">
          <input
            className="w-full border rounded p-2"
            value={form.title}
            onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
          />
          <textarea
            className="w-full border rounded p-2"
            value={form.description}
            onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
          />
          <select
            className="w-full border rounded p-2"
            value={form.status}
            onChange={e => setForm(f => ({ ...f, status: e.target.value }))}
          >
            <option>Belum diperbaiki</option>
            <option>Dalam proses</option>
            <option>Sudah diperbaiki</option>
          </select>
          <button className="bg-primary text-white px-4 py-2 rounded" onClick={handleUpdate}>
            Simpan Perubahan
          </button>
          <button className="ml-2 px-4 py-2 rounded bg-gray-200" onClick={() => setEditing(false)}>
            Batal
          </button>
        </div>
      ) : (
        <div>
          <h3 className="font-bold text-lg mb-2">{report.title}</h3>
          <p className="mb-2">{report.description}</p>
          <div className="mb-2">Status: <b>{report.status}</b></div>
          <div className="mb-2">Lokasi: {report.city}</div>
          <div className="mb-2">Tanggal: {formatDate(report.createdAt)}</div>
          <button className="bg-primary text-white px-4 py-2 rounded" onClick={() => setEditing(true)}>
            Update
          </button>
          <button className="ml-2 px-4 py-2 rounded bg-red-500 text-white" onClick={handleDelete}>
            Hapus
          </button>
        </div>
      )}
    </div>
  );
}
