"use client";

import { useEffect, useState } from "react";
import { addReport } from "../lib/reports";
import { getCurrentUser } from "../lib/auth";
import dynamic from "next/dynamic";
import MapView from "../../components/MapView";
import useGeolocation from "../hooks/useGeolocation";
import { v4 as uuidv4 } from "uuid";
import { useRouter } from "next/navigation";

export default function ReportForm() {
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
  });
  const [saving, setSaving] = useState(false);
  const { getMyLocation, coords, error: geoError } = useGeolocation();

  useEffect(() => {
    if (coords) {
      setForm((p) => ({ ...p, lat: coords.lat, lng: coords.lng }));
    }
  }, [coords]);

  function onFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setForm((p) => ({ ...p, image: reader.result }));
    };
    reader.readAsDataURL(file);
  }

  async function onSubmit(e) {
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
      city: form.city.trim() || "—",
      image: form.image || "",
      createdAt: new Date().toISOString(),
      userId: user.id,
    };
    addReport(payload);
    setSaving(false);
    router.replace("/map");
  }

  return (
    <form
      onSubmit={onSubmit}
      className="grid md:grid-cols-2 gap-6 min-h-[420px]"
    >
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Judul Laporan</label>
          <input
            required
            className="mt-1 w-full rounded-lg border-gray-300 focus:ring-2 focus:ring-primary"
            value={form.title}
            onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
          />
        </div>

        <div>
          <label className="block text-sm font-medium">
            Deskripsi Kondisi Jalan
          </label>
          <textarea
            required
            rows={5}
            className="mt-1 w-full rounded-lg border-gray-300 focus:ring-2 focus:ring-primary"
            value={form.description}
            onChange={(e) =>
              setForm((p) => ({ ...p, description: e.target.value }))
            }
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Upload Foto</label>
          <input
            type="file"
            accept="image/*"
            onChange={onFile}
            className="mt-1 w-full rounded-lg border-gray-300"
          />
          {form.image && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={form.image}
              alt="preview"
              className="mt-2 h-28 rounded-md object-cover"
            />
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium">Kota/Wilayah</label>
            <input
              className="mt-1 w-full rounded-lg border-gray-300 focus:ring-2 focus:ring-primary"
              placeholder="cth: Palembang"
              value={form.city}
              onChange={(e) => setForm((p) => ({ ...p, city: e.target.value }))}
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Status</label>
            <select
              className="mt-1 w-full rounded-lg border-gray-300 focus:ring-2 focus:ring-primary"
              value={form.status}
              onChange={(e) =>
                setForm((p) => ({ ...p, status: e.target.value }))
              }
            >
              <option>Belum diperbaiki</option>
              <option>Dalam proses</option>
              <option>Sudah diperbaiki</option>
            </select>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={getMyLocation}
            className="px-3 py-2 rounded-lg bg-gray-100 hover:bg-gray-200"
          >
            Gunakan Lokasi Saya
          </button>
          {geoError && <span className="text-xs text-red-600">{geoError}</span>}
          {form.lat && form.lng && (
            <span className="text-xs text-gray-600">
              Lokasi: {form.lat.toFixed(5)}, {form.lng.toFixed(5)}
            </span>
          )}
        </div>

        <button
          disabled={saving}
          className="px-4 py-2.5 rounded-lg bg-primary text-white hover:bg-blue-600 disabled:opacity-60"
        >
          {saving ? "Menyimpan..." : "Kirim Laporan"}
        </button>
      </div>

      {/* Map picker */}
      <div className="h-[380px] md:h-full rounded-xl overflow-hidden border border-gray-200">
        <MapView
          selectMode
          onSelectLatLng={([lat, lng]) => setForm((p) => ({ ...p, lat, lng }))}
          center={form.lat && form.lng ? [form.lat, form.lng] : undefined}
          zoom={form.lat && form.lng ? 15 : 12}
        />
      </div>
    </form>
  );
}
