"use client";

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";
import { useEffect, useMemo, useState } from "react";

// Fix marker icon path issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

function ClickSetter({ onSet }) {
  useMapEvents({
    click(e) {
      if (onSet) onSet([e.latlng.lat, e.latlng.lng]);
    },
  });
  return null;
}

/**
 * MapView
 * @param {{reports: any[], selectMode?: boolean, onSelectLatLng?: (latlng: [number,number])=>void, center?: [number,number], zoom?: number}}
 */
export default function MapView({
  reports = [],
  selectMode = false,
  onSelectLatLng,
  center,
  zoom,
}) {
  const defaultCenter = useMemo(() => center || [-2.9761, 104.7754], [center]);
  const [mapCenter] = useState(defaultCenter);

  // Prevent SSR issues
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return <div className="w-full h-full bg-gray-100" />;

  return (
    <MapContainer
      center={mapCenter}
      zoom={zoom || 12}
      className="w-full h-full z-0"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/">OSM</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {selectMode && <ClickSetter onSet={onSelectLatLng} />}

      {!selectMode &&
        reports.map((r) => (
          <Marker key={r.id} position={[r.lat, r.lng]}>
            <Popup>
              <div className="text-sm">
                <div className="font-semibold mb-1">{r.title}</div>
                <div className="text-gray-700 mb-1">{r.description}</div>
                <div className="text-gray-600">
                  Status: <b>{r.status}</b>
                </div>
                <div className="text-gray-600">Lokasi: {r.city || "-"}</div>
                <div className="text-gray-500 text-xs mt-1">{r.createdAt}</div>
              </div>
            </Popup>
          </Marker>
        ))}
    </MapContainer>
  );
}
