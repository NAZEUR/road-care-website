import {
  GoogleMap,
  Marker,
  InfoWindow,
  useJsApiLoader,
} from "@react-google-maps/api";
import { useState, useMemo } from "react";

const containerStyle = {
  width: "100%",
  height: "100%",
  borderRadius: "0.75rem",
};

const DEFAULT_CENTER = { lat: -2.9761, lng: 104.7754 };

export default function MapView({
  reports = [],
  selectMode = false,
  onSelectLatLng,
  center,
  zoom = 12,
  customMarker,
}) {
  const mapCenter = useMemo(() => {
    if (center && Array.isArray(center)) {
      return { lat: center[0], lng: center[1] };
    }
    return DEFAULT_CENTER;
  }, [center]);

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: apiKey,
  });

  if (!apiKey) {
    return <div className="w-full h-full flex items-center justify-center text-red-500">API key Google Maps tidak ditemukan di environment.</div>;
  }

  const [activeReport, setActiveReport] = useState(null);

  if (!isLoaded) return <div className="w-full h-full flex items-center justify-center text-gray-400">Loading map...</div>;

  function handleMapClick(e) {
    if (selectMode && onSelectLatLng) {
      const lat = e.latLng.lat();
      const lng = e.latLng.lng();
      onSelectLatLng([lat, lng]);
    }
  }

  return (
    <div style={{ width: "100%", height: "100%", minHeight: 300 }}>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={mapCenter}
        zoom={zoom}
        onClick={handleMapClick}
        options={{
          streetViewControl: false,
          mapTypeControl: false,
          fullscreenControl: false,
        }}
      >
      {selectMode && customMarker && (
        <Marker position={{ lat: customMarker[0], lng: customMarker[1] }} />
      )}
      {!selectMode &&
        reports.map((r) => (
          <Marker
            key={r.id}
            position={{ lat: r.lat, lng: r.lng }}
            onClick={() => setActiveReport(r.id)}
          >
            {activeReport === r.id && (
              <InfoWindow onCloseClick={() => setActiveReport(null)}>
                <div className="text-sm min-w-[180px]">
                  <div className="font-semibold mb-1">{r.title}</div>
                  <div className="text-gray-700 mb-1">{r.description}</div>
                  <div className="text-gray-600">
                    Status: <b>{r.status}</b>
                  </div>
                  <div className="text-gray-600">Lokasi: {r.city || "-"}</div>
                  <div className="text-gray-500 text-xs mt-1">
                    {r.createdAt}
                  </div>
                </div>
              </InfoWindow>
            )}
          </Marker>
        ))}
      </GoogleMap>
    </div>
  );
}
