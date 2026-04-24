'use client';

import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Bus } from '@/lib/types';

// Fix Leaflet's default icon path issue with webpack
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const busIcon = L.divIcon({
  className: '',
  html: `
    <div style="
      width:36px; height:36px; border-radius:50%;
      background:linear-gradient(135deg,#1d4ed8,#3b82f6);
      border:3px solid #60a5fa;
      display:flex; align-items:center; justify-content:center;
      box-shadow:0 0 12px rgba(59,130,246,0.7);
      animation: pulse 2s infinite;
    ">
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="white">
        <path d="M4 16c0 .88.39 1.67 1 2.22V20c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h8v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1.78c.61-.55 1-1.34 1-2.22V6c0-3.5-3.58-4-8-4s-8 .5-8 4v10zm3.5 1c-.83 0-1.5-.67-1.5-1.5S6.67 14 7.5 14s1.5.67 1.5 1.5S8.33 17 7.5 17zm9 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm1.5-6H6V6h12v5z"/>
      </svg>
    </div>
  `,
  iconSize: [36, 36],
  iconAnchor: [18, 18],
  popupAnchor: [0, -20],
});

const puIcon = L.divIcon({
  className: '',
  html: `
    <div style="
      width:44px; height:44px; border-radius:50%;
      background:linear-gradient(135deg,#7c3aed,#a855f7);
      border:3px solid #c084fc;
      display:flex; align-items:center; justify-content:center;
      box-shadow:0 0 14px rgba(168,85,247,0.6);
      font-weight:bold; color:white; font-size:12px;
    ">PU</div>
  `,
  iconSize: [44, 44],
  iconAnchor: [22, 22],
  popupAnchor: [0, -25],
});

interface MapInnerProps {
  buses: Bus[];
  center: [number, number];
  zoom: number;
}

export default function MapInner({ buses, center, zoom }: MapInnerProps) {
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<Record<string, L.Marker>>({});
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = L.map(containerRef.current, {
      center,
      zoom,
      zoomControl: true,
    });

    // Dark-themed tile layer
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
      maxZoom: 20,
    }).addTo(map);

    // PU Campus marker
    L.marker(center, { icon: puIcon })
      .addTo(map)
      .bindPopup(`
        <div style="background:#0d1f3e;color:white;padding:8px 12px;border-radius:8px;min-width:150px;">
          <b style="font-size:14px;">🏫 Poornima University</b>
          <p style="margin:4px 0 0;font-size:11px;color:#93c5fd;">Jaipur, Rajasthan</p>
        </div>
      `, { className: 'custom-popup' });

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Update bus markers when buses data changes
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    // Remove markers for buses no longer present
    Object.keys(markersRef.current).forEach((id) => {
      if (!buses.find((b) => b.id === id)) {
        markersRef.current[id].remove();
        delete markersRef.current[id];
      }
    });

    buses.forEach((bus) => {
      if (!bus.lat || !bus.lng) return;
      const pos: [number, number] = [bus.lat, bus.lng];
      const popup = `
        <div style="background:#0d1f3e;color:white;padding:8px 12px;border-radius:8px;min-width:160px;">
          <b style="font-size:13px;">🚌 Bus ${bus.busNumber}</b>
          <p style="margin:3px 0;font-size:11px;color:#93c5fd;">Driver: ${bus.driverName}</p>
          <p style="margin:3px 0;font-size:10px;color:#64748b;">
            Active: ${bus.isActive ? '✅ Yes' : '❌ No'}
          </p>
        </div>
      `;

      if (markersRef.current[bus.id]) {
        markersRef.current[bus.id].setLatLng(pos);
        markersRef.current[bus.id].setPopupContent(popup);
      } else {
        const marker = L.marker(pos, { icon: busIcon }).addTo(map).bindPopup(popup, { className: 'custom-popup' });
        markersRef.current[bus.id] = marker;
      }
    });
  }, [buses]);

  return (
    <div
      ref={containerRef}
      style={{ width: '100%', height: '100%', minHeight: '400px', zIndex: 0 }}
    />
  );
}
