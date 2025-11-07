'use client';
import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet'; // Import L

// --- This is the standard hack to fix the default icon paths ---
// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;

/* eslint-disable @typescript-eslint/no-require-imports */
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});
/* eslint-enable @typescript-eslint/no-require-imports */
// -----------------------------------------------------------------

interface MapProps {
  center: [number, number];
}

const Map: React.FC<MapProps> = ({ center }) => {
  return (
    <MapContainer
      center={center}
      zoom={13}
      className="h-[350px] w-full rounded-md"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      
      <Marker position={center}>
        <Popup>Your hotel is here!!!</Popup>
      </Marker>
    </MapContainer>
  );
};

export default Map;