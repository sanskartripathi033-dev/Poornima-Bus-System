'use client';

import { useEffect, useState } from 'react';
import { RefreshCw, Bus, Navigation, Clock, Wifi, WifiOff } from 'lucide-react';
import AuthGuard from '@/components/AuthGuard';
import AlertBanner from '@/components/AlertBanner';
import BusMap from '@/components/BusMap';
import { subscribeBuses } from '@/lib/firestore';
import { Bus as BusType } from '@/lib/types';

// Simulate some buses near PU campus for demo purposes
const DEMO_BUSES: BusType[] = [
  { id: 'bus-1', routeId: 'route-1', busNumber: 'PU-01', driverName: 'Ramesh Kumar', driverPhone: '9876543210', lat: 26.8467, lng: 75.7480, lastUpdated: new Date(), isActive: true, speed: 35 },
  { id: 'bus-2', routeId: 'route-2', busNumber: 'PU-02', driverName: 'Suresh Singh', driverPhone: '9876543211', lat: 26.8510, lng: 75.7520, lastUpdated: new Date(), isActive: true, speed: 25 },
  { id: 'bus-3', routeId: 'route-3', busNumber: 'PU-07', driverName: 'Mahesh Joshi', driverPhone: '9876543212', lat: 26.8430, lng: 75.7440, lastUpdated: new Date(), isActive: false, speed: 0 },
];

function TrackingContent() {
  const [buses, setBuses] = useState<BusType[]>(DEMO_BUSES);
  const [connected, setConnected] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  useEffect(() => {
    // Subscribe to real Firestore buses; fall back to demo data if empty
    const unsub = subscribeBuses((fbBuses) => {
      if (fbBuses.length > 0) {
        setBuses(fbBuses);
        setConnected(true);
      } else {
        setBuses(DEMO_BUSES);
        setConnected(false); // show demo mode
      }
      setLastUpdate(new Date());
    });
    return () => unsub();
  }, []);

  // Animate demo buses to simulate movement
  useEffect(() => {
    if (connected) return;
    const interval = setInterval(() => {
      setBuses((prev) =>
        prev.map((b) =>
          b.isActive
            ? {
                ...b,
                lat: b.lat + (Math.random() - 0.5) * 0.001,
                lng: b.lng + (Math.random() - 0.5) * 0.001,
                lastUpdated: new Date(),
              }
            : b
        )
      );
      setLastUpdate(new Date());
    }, 3000);
    return () => clearInterval(interval);
  }, [connected]);

  const activeBuses = buses.filter((b) => b.isActive);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <AlertBanner />

      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 mb-1">Live Bus Tracking</h1>
          <p className="text-slate-500 font-medium text-sm">Real-time location of university buses</p>
        </div>
        <div className="flex items-center gap-3">
          {!connected && (
            <div className="flex items-center gap-1.5 bg-amber-50 border border-amber-200 rounded-lg px-3 py-1.5 shadow-sm">
              <WifiOff className="w-3.5 h-3.5 text-amber-600" />
              <span className="text-amber-700 text-xs font-bold">Demo Mode</span>
            </div>
          )}
          {connected && (
            <div className="flex items-center gap-1.5 bg-green-50 border border-green-200 rounded-lg px-3 py-1.5 shadow-sm">
              <Wifi className="w-3.5 h-3.5 text-green-600" />
              <span className="text-green-700 text-xs font-bold">Live</span>
            </div>
          )}
          <div className="flex items-center gap-1.5 text-slate-500 font-medium text-xs">
            <RefreshCw className="w-3 h-3 animate-spin text-[#004892]" />
            Updated {lastUpdate.toLocaleTimeString()}
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Map */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-sm" style={{ height: '520px' }}>
            <BusMap buses={buses} />
          </div>
        </div>

        {/* Bus List Sidebar */}
        <div className="space-y-4">
          {/* Stats */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white rounded-xl p-3 border border-gray-200 text-center shadow-sm">
              <p className="text-2xl font-black text-[#004892]">{activeBuses.length}</p>
              <p className="text-slate-500 font-bold text-[10px] uppercase tracking-wider">Active Buses</p>
            </div>
            <div className="bg-white rounded-xl p-3 border border-gray-200 text-center shadow-sm">
              <p className="text-2xl font-black text-slate-900">{buses.length}</p>
              <p className="text-slate-500 font-bold text-[10px] uppercase tracking-wider">Total Buses</p>
            </div>
          </div>

          {/* Bus Cards */}
          <div className="space-y-3">
            <h3 className="text-slate-900 font-bold text-sm bg-gray-100 px-3 py-2 rounded-lg border border-gray-200">All Buses</h3>
            {buses.map((bus) => (
              <div
                key={bus.id}
                className={`bg-white rounded-xl p-4 border transition-all ${
                  bus.isActive ? 'border-gray-200 shadow-sm hover:shadow-md hover:border-[#004892]/30' : 'bg-gray-50 border-gray-200 opacity-70'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center shadow-sm ${bus.isActive ? 'bg-[#E9F2FF] border border-[#004892]/20' : 'bg-white border border-gray-200'}`}>
                      <Bus className={`w-4 h-4 ${bus.isActive ? 'text-[#004892]' : 'text-slate-400'}`} />
                    </div>
                    <div>
                      <p className="text-slate-900 font-black text-sm">{bus.busNumber}</p>
                      <p className="text-slate-500 font-medium text-xs">{bus.driverName}</p>
                    </div>
                  </div>
                  <div className={`w-2 h-2 rounded-full ring-2 ${bus.isActive ? 'bg-green-500 ring-green-100 animate-pulse' : 'bg-slate-300 ring-transparent'}`} />
                </div>
                <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 mt-3 pt-3 border-t border-gray-100">
                  <div className="flex items-center gap-1.5">
                    <Navigation className="w-3.5 h-3.5 text-[#004892]" />
                    <span>{bus.speed ?? 0} km/h</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-[#FABE15]" />
                    <span>{bus.isActive ? 'En Route' : 'Parked'}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {!connected && (
            <p className="text-slate-500 font-medium text-xs text-center leading-relaxed mt-4 bg-gray-50 p-3 rounded-lg border border-dashed border-gray-200">
              🔄 Showing animated demo.<br/>Connect Firebase for real GPS data.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default function TrackingPage() {
  return (
    <AuthGuard>
      <TrackingContent />
    </AuthGuard>
  );
}
