"use client";

import { useCallback, useState } from "react";

export default function useGeolocation() {
  const [coords, setCoords] = useState(null);
  const [error, setError] = useState("");

  const getMyLocation = useCallback(() => {
    if (!("geolocation" in navigator)) {
      setError("Geolokasi tidak didukung browser.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setError("");
        setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
      },
      (err) => {
        setError(err.message || "Gagal mengambil lokasi.");
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  }, []);

  return { getMyLocation, coords, error };
}
