'use client';

import dynamic from 'next/dynamic';

// Leaflet requires window object, so we must disable SSR for the map component
const MapComponent = dynamic(() => import('./MapComponent'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex flex-col items-center justify-center bg-slate-50 text-slate-400">
      <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
      <div className="text-xs font-bold uppercase tracking-widest">Memuat Peta Satelit...</div>
    </div>
  )
});

export default function IndonesiaMap() {
  return (
    <div className="w-full h-full relative z-0">
      <MapComponent />
    </div>
  );
}
