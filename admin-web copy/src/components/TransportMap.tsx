'use client';

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default Leaflet icon paths in Next.js
const iconOptions = {
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41] as [number, number],
  iconAnchor: [12, 41] as [number, number],
  popupAnchor: [1, -34] as [number, number],
  shadowSize: [41, 41] as [number, number]
};

// Create a custom Bus Icon using a div to match our UI
const createBusIcon = () => {
  return L.divIcon({
    className: 'custom-bus-marker',
    html: `
      <div style="
        width: 40px; height: 40px; 
        background: white; 
        border: 2px solid #6366f1; 
        border-radius: 50%; 
        display: flex; 
        align-items: center; 
        justify-content: center;
        box-shadow: 0 10px 25px rgba(99,102,241,0.5);
      ">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6366f1" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M8 6v6"/>
          <path d="M15 6v6"/>
          <path d="M2 12h19.6"/>
          <path d="M18 18h3s.5-1.7.8-2.8c.1-.4.2-.8.2-1.2 0-.4-.1-.8-.2-1.2l-1.4-5C20.1 6.8 19.1 6 18 6H4a2 2 0 0 0-2 2v10h3"/>
          <circle cx="7" cy="18" r="2"/>
          <path d="M9 18h5"/>
          <circle cx="16" cy="18" r="2"/>
        </svg>
      </div>
      <div style="
        position: absolute;
        top: -4px; right: -4px; right: -4px; bottom: -4px; left: -4px;
        border: 2px solid #3b82f6;
        border-radius: 50%;
        animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;
        opacity: 0.2;
      </div>
    `,
    iconSize: [40, 40],
    iconAnchor: [20, 20]
  });
};

interface TransportMapProps {
  busLocation: { lat: number; lng: number };
  routeName: string;
}

// A helper component to smoothly pan the map when the bus moves
function MapUpdater({ center }: { center: { lat: number; lng: number } }) {
  const map = useMap();
  useEffect(() => {
    map.setView([center.lat, center.lng], map.getZoom(), {
      animate: true,
      duration: 1.5 // Smooth panning duration
    });
  }, [center, map]);
  return null;
}

export default function TransportMap({ busLocation, routeName }: TransportMapProps) {
  const [icon, setIcon] = useState<L.DivIcon | null>(null);

  useEffect(() => {
    setIcon(createBusIcon());
  }, []);

  if (!icon) return <div className="w-full h-full bg-[#e5e3df] dark:bg-[#242f3e] animate-pulse"></div>;

  return (
    <div className="w-full h-full relative" style={{ minHeight: '350px' }}>
      <MapContainer 
        center={[busLocation.lat, busLocation.lng]} 
        zoom={14} 
        style={{ height: '100%', width: '100%', zIndex: 0 }}
        zoomControl={false}
      >
        {/* Using a sleek, minimal OpenStreetMap theme variant */}
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        />
        
        <MapUpdater center={busLocation} />

        <Marker position={[busLocation.lat, busLocation.lng]} icon={icon}>
          <Popup className="font-bold text-sm">
            {routeName}
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}
