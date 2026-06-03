'use client';

import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, CircleMarker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { vendors } from '@/lib/mockData';

// Fix Leaflet's default icon path issues in Next.js
const customMarkerIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

export default function MapComponent() {
  // Center of Indonesia
  const center: [number, number] = [-0.7893, 113.9213];

  return (
    <div className="w-full h-full relative z-0">
      <MapContainer 
        center={center} 
        zoom={5} 
        scrollWheelZoom={false}
        className="w-full h-full z-0"
        style={{ background: '#f8fafc' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          opacity={0.8}
        />
        
        {vendors.map((vendor) => {
          const isAnomaly = vendor.anomali.length > 0;
          const color = isAnomaly ? '#ef4444' : (vendor.risikoSkor >= 50 ? '#eab308' : '#3b82f6');
          
          return (
            <CircleMarker 
              key={vendor.id}
              center={[vendor.lat, vendor.lng]}
              radius={isAnomaly ? 10 : 7}
              pathOptions={{
                color: color,
                fillColor: color,
                fillOpacity: 0.8,
                weight: 2
              }}
            >
              <Popup>
                <div className="font-sans text-xs">
                  <div className="font-bold text-slate-800 text-sm mb-1">{vendor.nama}</div>
                  <div className="text-slate-600 mb-1">{vendor.kota}, {vendor.provinsi}</div>
                  <div className="font-bold uppercase text-[10px] tracking-wider mb-2">
                    Skor Risiko: <span className={isAnomaly ? 'text-red-600' : 'text-emerald-600'}>{vendor.risikoSkor}</span>
                  </div>
                  {isAnomaly && (
                    <div className="text-red-600 font-medium">
                      Anomali: {vendor.anomali.length} kasus
                    </div>
                  )}
                </div>
              </Popup>
            </CircleMarker>
          );
        })}
      </MapContainer>

      {/* Legend */}
      <div className="absolute bottom-6 right-4 bg-white/90 backdrop-blur p-3 rounded-lg border border-slate-200 shadow-sm text-[10px] font-semibold text-slate-700 uppercase tracking-wider flex flex-col gap-2 z-[400]">
        <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-blue-500 shadow-sm"></span> Operasional Normal</div>
        <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-yellow-500 shadow-sm"></span> Peringatan Ringan</div>
        <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-red-500 shadow-sm animate-pulse"></span> Anomali Kritis</div>
      </div>
    </div>
  );
}
