"use client";
import { useEffect, useState } from "react";

const useCurrentLocation = () => {
  const [currentLat, setCurrentLat] = useState<string>("");
  const [currentLng, setCurrentLng] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude.toString();
          const long = position.coords.longitude.toString();

          setCurrentLat(lat);
          setCurrentLng(long);
        },
        (error) => {
          console.error("Gagal mendapatkan lokasi: ", error);
          setError("Tidak bisa mendapatkan lokasi.");
        },
      );
    } else {
      setError("Geolocation tidak didukung oleh browser ini.");
    }
  };

  useEffect(() => {
    getCurrentLocation();
  }, []);

  return { currentLat, currentLng, error };
};

export default useCurrentLocation;
