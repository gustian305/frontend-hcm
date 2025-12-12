import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import { useEffect } from "react";

const markerIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

interface MapSelectorProps {
  latitude: number;
  longitude: number;
  onSelect: (lat: number, lng: number) => void;
}

export default function MapSelector({ latitude, longitude, onSelect }: MapSelectorProps) {

  function LocationPicker() {
    useMapEvents({
      click(e) {
        onSelect(e.latlng.lat, e.latlng.lng);
      },
    });
    return null;
  }

  function RecenterMap({ center }: { center: [number, number] }) {
    const map = useMapEvents({});
    useEffect(() => {
      map.setView(center);
    }, [center, map]);
    return null;
  }

  return (
    <MapContainer
      center={[latitude, longitude]}
      zoom={15}
      scrollWheelZoom={true}
      className="w-full h-64 rounded-lg overflow-hidden"
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <LocationPicker />
      <RecenterMap center={[latitude, longitude]} />

      <Marker position={[latitude, longitude]} icon={markerIcon} />
    </MapContainer>
  );
}
