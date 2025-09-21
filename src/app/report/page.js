"use client";
import { useState, useEffect, useCallback } from "react";
import dynamic from "next/dynamic";
const MapView = dynamic(() => import("../../components/MapView"), {
  ssr: false,
});
import { useRouter } from "next/navigation";
import { addReport } from "../../lib/reports";
import { getCurrentUser } from "../../lib/auth";
import { v4 as uuidv4 } from "uuid";
import useGeolocation from "../../hooks/useGeolocation";

export default function ReportPage() {
  const user = getCurrentUser();
  const router = useRouter();
  const [form, setForm] = useState({
    title: "",
    description: "",
    status: "Belum diperbaiki",
    city: "",
    image: "",
    lat: null,
    lng: null,
    date: new Date().toISOString().slice(0, 10),
  });
  const [saving, setSaving] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const { getMyLocation, coords } = useGeolocation();

  useEffect(() => {
    if (coords && (!form.lat || !form.lng)) {
      setForm((p) => ({ ...p, lat: coords.lat, lng: coords.lng }));
    }
  }, [coords]);

  const handleFile = useCallback((e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setForm((p) => ({ ...p, image: reader.result }));
    };
    reader.readAsDataURL(file);
  }, []);

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      setDragActive(false);
      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        handleFile({ target: { files: e.dataTransfer.files } });
      }
    },
    [handleFile]
  );

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setDragActive(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setDragActive(false);
  }, []);

  const handleLocation = useCallback(() => {
    getMyLocation();
  }, [getMyLocation]);

  const handleMapClick = useCallback(() => {
    setShowMap(true);
  }, []);

  const handleSelectLatLng = useCallback(([lat, lng]) => {
    setForm((f) => ({ ...f, lat, lng }));
    setShowMap(false);
  }, []);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  }, []);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      if (!user) {
        alert("Silakan login terlebih dahulu.");
        return;
      }
      if (!form.lat || !form.lng) {
        alert(
          "Tentukan lokasi terlebih dahulu (Gunakan Lokasi Saya atau klik peta)."
        );
        return;
      }
      setSaving(true);
      const payload = {
        id: uuidv4(),
        title: form.title.trim(),
        description: form.description.trim(),
        status: form.status,
        lat: form.lat,
        lng: form.lng,
        city: form.city,
        image: form.image,
        userId: user.id,
        date: form.date,
      };
      await addReport(payload);
      setSaving(false);
      router.push("/profile");
    },
    [form, user, router]
  );

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-xl mx-auto">
        <h2 className="text-3xl font-bold mb-2">Buat Laporan Baru</h2>
        <p className="text-gray-500 mb-8">
          Sampaikan laporan Anda agar dapat segera ditindaklanjuti.
        </p>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="title">
              Judul Laporan
            </label>
            <input
              id="title"
              name="title"
              type="text"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Contoh: Jalan berlubang di depan Balai Desa"
              value={form.title}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="date">
              Tanggal Laporan
            </label>
            <input
              id="date"
              name="date"
              type="date"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              value={form.date}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label
              className="block text-sm font-medium mb-1"
              htmlFor="description"
            >
              Deskripsi Kondisi Jalan
            </label>
            <textarea
              id="description"
              name="description"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              rows={4}
              placeholder="Jelaskan detail kerusakan, perkiraan ukuran, kedalaman, dan potensi bahaya bagi pengguna jalan."
              value={form.description}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Foto Kerusakan
            </label>
            <div
              className={`border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center gap-2 ${
                dragActive
                  ? "border-primary bg-primary/5"
                  : "border-gray-300 bg-white"
              }`}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
            >
              {form.image ? (
                <img
                  src={form.image}
                  alt="Preview"
                  className="max-h-40 mb-2 rounded-lg"
                />
              ) : (
                <>
                  <svg
                    width="40"
                    height="40"
                    fill="none"
                    stroke="#2563eb"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 16v-4m0 0l-2 2m2-2l2 2m-6 4h12a2 2 0 002-2V7a2 2 0 00-2-2H6a2 2 0 00-2 2v7a2 2 0 002 2z" />
                  </svg>
                  <span
                    className="text-primary font-medium cursor-pointer underline"
                    onClick={() =>
                      document.getElementById("file-upload").click()
                    }
                  >
                    Unggah file
                  </span>{" "}
                  <span className="text-gray-400">atau seret dan lepas</span>
                  <div className="text-xs text-gray-400 mt-1">
                    PNG, JPG, GIF hingga 10MB
                  </div>
                  <input
                    id="file-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFile}
                  />
                </>
              )}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Lokasi</label>
            <div className="flex gap-2">
              <button
                type="button"
                className="flex-1 px-4 py-2 border rounded-lg flex items-center gap-2 bg-white hover:bg-gray-100"
                onClick={handleMapClick}
              >
                <svg
                  width="20"
                  height="20"
                  fill="none"
                  stroke="#2563eb"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
                  <circle cx="12" cy="9" r="2.5" />
                </svg>
                Pilih lokasi di peta
              </button>
              <button
                type="button"
                className="px-4 py-2 border rounded-lg flex items-center gap-2 bg-white hover:bg-gray-100"
                onClick={handleLocation}
              >
                <svg
                  width="20"
                  height="20"
                  fill="none"
                  stroke="#2563eb"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 2v2m0 16v2m10-10h-2M4 12H2" />
                </svg>
                Gunakan Lokasi Saya
              </button>
            </div>
            {form.lat && form.lng && (
              <div className="text-xs text-gray-500 mt-2">
                Koordinat: {form.lat}, {form.lng}
              </div>
            )}
          </div>
          {showMap && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center">
              <div className="absolute inset-0 bg-black/40" />
              <div
                className="bg-white rounded-xl shadow-lg p-0 w-full max-w-xl relative overflow-hidden flex flex-col"
                style={{ maxHeight: "90vh" }}
              >
                <button
                  className="absolute top-2 right-2 text-gray-400 hover:text-primary z-10"
                  onClick={() => setShowMap(false)}
                >
                  <svg
                    width="28"
                    height="28"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
                <h3 className="text-lg font-semibold mb-2 px-6 pt-6">
                  Pilih Lokasi di Peta
                </h3>
                <div
                  className="w-full flex-1 px-6 pb-2"
                  style={{ minHeight: 400, height: 400, display: "flex" }}
                >
                  <div style={{ flex: 1, height: "100%" }}>
                    <MapView
                      selectMode={true}
                      onSelectLatLng={handleSelectLatLng}
                      center={
                        form.lat && form.lng ? [form.lat, form.lng] : undefined
                      }
                      customMarker={
                        form.lat && form.lng ? [form.lat, form.lng] : null
                      }
                    />
                  </div>
                </div>
                <div className="text-xs text-gray-500 px-6 pb-4">
                  Klik pada peta untuk memilih lokasi.
                </div>
              </div>
            </div>
          )}
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="status">
              Status
            </label>
            <select
              id="status"
              name="status"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              value={form.status}
              onChange={handleChange}
            >
              <option value="Belum diperbaiki">Belum diperbaiki</option>
              <option value="Sudah diperbaiki">Sudah diperbaiki</option>
            </select>
          </div>
          <button
            type="submit"
            className="w-full py-3 bg-primary text-white rounded-lg font-semibold text-lg hover:bg-blue-600 transition"
            disabled={saving}
          >
            {saving ? "Mengirim..." : "Kirim Laporan"}
          </button>
        </form>
      </div>
    </div>
  );
}
