'use client';

import dynamic from 'next/dynamic';
import { Bus } from '@/lib/types';

const MapComponent = dynamic(() => import('./MapInner'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-[#0a1628] flex items-center justify-center rounded-xl">
      <div className="text-slate-400 text-sm animate-pulse">Loading Map...</div>
    </div>
  ),
});

interface BusMapProps {
  buses: Bus[];
  center?: [number, number];
  zoom?: number;
}

export default function BusMap({ buses, center = [26.8467, 75.7480], zoom = 14 }: BusMapProps) {
  return (
    <div className="w-full h-full rounded-xl overflow-hidden">
      <MapComponent buses={buses} center={center} zoom={zoom} />
    </div>
  );
}
