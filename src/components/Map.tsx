import L from "leaflet";
import "leaflet/dist/leaflet.css";
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMapEvent,
  useMap,
} from "react-leaflet";
import { useState } from "react";

const pointerIcon = new L.Icon({
  iconUrl: "/pin.png",
  iconSize: [35, 43],
  iconAnchor: [20, 58],
  popupAnchor: [0, -60],
});

interface MapProps {
  selectedPosition: [string, string];
  onPositionChange: (lat: string, lng: string) => void;
}

const Map: React.FC<MapProps> = ({ selectedPosition, onPositionChange }) => {
  const handleMapClick = (event: any) => {
    const { lat, lng } = event.latlng;
    onPositionChange(lat.toString(), lng.toString());
  };

  return (
    <div className="relative h-full w-full">
      <MapContainer
        center={[
          parseFloat(selectedPosition[0]),
          parseFloat(selectedPosition[1]),
        ]}
        zoom={13}
        scrollWheelZoom={false}
        className="h-full w-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker
          position={[
            parseFloat(selectedPosition[0]),
            parseFloat(selectedPosition[1]),
          ]}
          icon={pointerIcon}
        >
          <Popup>
            Lokasi yang dipilih: <br /> Latitude: {selectedPosition[0]},
            Longitude: {selectedPosition[1]}
          </Popup>
        </Marker>
        <MapClickHandler onClick={handleMapClick} />
        <MyLocationButton onPositionChange={onPositionChange} />
      </MapContainer>
    </div>
  );
};

const MapClickHandler = ({ onClick }: { onClick: (event: any) => void }) => {
  useMapEvent("click", onClick);
  return null;
};

const MyLocationButton: React.FC<{
  onPositionChange: (lat: string, lng: string) => void;
}> = ({ onPositionChange }) => {
  const map = useMap();
  const [loading, setLoading] = useState(false);

  const handleLocateMe = () => {
    setLoading(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          map.setView([latitude, longitude], 13);
          onPositionChange(latitude.toString(), longitude.toString());
          setLoading(false);
        },
        (error) => {
          console.error("Error getting location:", error);
          setLoading(false);
        },
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleLocateMe}
      disabled={loading}
      className="text-md absolute bottom-4 left-4 z-[1000] rounded-md bg-[#37bae3] p-2 font-semibold text-white shadow-md transition duration-300 hover:bg-[##37bae3]"
    >
      {loading ? "Locating..." : "My Location"}
    </button>
  );
};

export default Map;
