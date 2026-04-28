'use client';

import { useEffect, useState } from 'react';
import { Search, Bus, Filter } from 'lucide-react';
import AuthGuard from '@/components/AuthGuard';
import AlertBanner from '@/components/AlertBanner';
import RouteCard from '@/components/RouteCard';
import { subscribeRoutes } from '@/lib/firestore';
import { useAuth } from '@/context/AuthContext';
import { BusRoute } from '@/lib/types';

const DEMO_ROUTES: BusRoute[] = [
  {
    id: 'route-1', name: 'Route A - City Center', busNumber: 'PU-01', active: true,
    departureTime: '07:30 AM', returnTime: '05:30 PM',
    createdAt: new Date(), updatedAt: new Date(),
    stops: [
      { id: 's1', name: 'Poornima University', time: '07:30 AM', lat: 26.8467, lng: 75.748, order: 1 },
      { id: 's2', name: 'Sitapura Bypass', time: '07:45 AM', lat: 26.84, lng: 75.77, order: 2 },
      { id: 's3', name: 'Tonk Road', time: '08:00 AM', lat: 26.855, lng: 75.788, order: 3 },
      { id: 's4', name: 'Sindhi Camp', time: '08:20 AM', lat: 26.922, lng: 75.817, order: 4 },
      { id: 's5', name: 'City Center', time: '08:40 AM', lat: 26.93, lng: 75.82, order: 5 },
    ],
  },
  {
    id: 'route-2', name: 'Route B - Vaishali Nagar', busNumber: 'PU-02', active: true,
    departureTime: '07:45 AM', returnTime: '05:15 PM',
    createdAt: new Date(), updatedAt: new Date(),
    stops: [
      { id: 's6', name: 'Poornima University', time: '07:45 AM', lat: 26.8467, lng: 75.748, order: 1 },
      { id: 's7', name: 'Patrakar Colony', time: '08:00 AM', lat: 26.86, lng: 75.73, order: 2 },
      { id: 's8', name: 'Vaishali Nagar', time: '08:20 AM', lat: 26.897, lng: 75.725, order: 3 },
      { id: 's9', name: 'Mansarovar', time: '08:35 AM', lat: 26.864, lng: 75.764, order: 4 },
    ],
  },
  {
    id: 'route-3', name: 'Route C - Malviya Nagar', busNumber: 'PU-07', active: false,
    departureTime: '08:00 AM', returnTime: '05:00 PM',
    createdAt: new Date(), updatedAt: new Date(),
    stops: [
      { id: 's10', name: 'Poornima University', time: '08:00 AM', lat: 26.8467, lng: 75.748, order: 1 },
      { id: 's11', name: 'Durgapura', time: '08:15 AM', lat: 26.858, lng: 75.797, order: 2 },
      { id: 's12', name: 'Malviya Nagar', time: '08:30 AM', lat: 26.852, lng: 75.812, order: 3 },
    ],
  },
  {
    id: 'route-4', name: 'Route D - Sodala Express', busNumber: 'PU-04', active: true,
    departureTime: '07:15 AM', returnTime: '05:45 PM',
    createdAt: new Date(), updatedAt: new Date(),
    stops: [
      { id: 's13', name: 'Poornima University', time: '07:15 AM', lat: 26.8467, lng: 75.748, order: 1 },
      { id: 's14', name: 'Gandhi Nagar', time: '07:35 AM', lat: 26.906, lng: 75.791, order: 2 },
      { id: 's15', name: 'Sodala', time: '07:50 AM', lat: 26.917, lng: 75.767, order: 3 },
      { id: 's16', name: 'Raja Park', time: '08:05 AM', lat: 26.9, lng: 75.807, order: 4 },
    ],
  },
];

function RoutesContent() {
  const { profile } = useAuth();
  const [routes, setRoutes] = useState<BusRoute[] | null>(null);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'inactive'>('all');

  useEffect(() => {
    const unsub = subscribeRoutes((fbRoutes) => {
      setRoutes(fbRoutes.length > 0 ? fbRoutes : DEMO_ROUTES);
    });
    return () => unsub();
  }, []);

  const visibleRoutes = routes ?? DEMO_ROUTES;
  const loading = routes === null;

  const filtered = visibleRoutes.filter((route) => {
    const matchSearch =
      route.name.toLowerCase().includes(search.toLowerCase()) ||
      route.busNumber.toLowerCase().includes(search.toLowerCase()) ||
      route.stops.some((stop) => stop.name.toLowerCase().includes(search.toLowerCase()));

    const matchFilter =
      filter === 'all' ||
      (filter === 'active' && route.active) ||
      (filter === 'inactive' && !route.active);

    return matchSearch && matchFilter;
  });

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <AlertBanner />

      <div className="mb-8">
        <h1 className="text-3xl font-black text-slate-900 mb-1">Bus Routes</h1>
        <p className="text-slate-500 font-medium text-sm">{visibleRoutes.length} routes | Updated daily</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search routes, buses, or stops..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white border border-gray-300 shadow-sm rounded-xl py-3 pl-10 pr-4 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#004892]/50 focus:ring-1 focus:ring-[#004892]/50 transition-all font-medium"
          />
        </div>
        <div className="flex items-center gap-1 bg-white border border-gray-300 shadow-sm rounded-xl p-1.5">
          <Filter className="w-4 h-4 text-slate-400 ml-2 mr-1" />
          {(['all', 'active', 'inactive'] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => setFilter(mode)}
              className={`px-3 py-1.5 rounded-lg text-sm font-bold transition-all capitalize ${
                filter === mode ? 'bg-[#004892] text-white shadow-md' : 'text-slate-500 hover:text-slate-700 hover:bg-gray-50'
              }`}
            >
              {mode}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="bg-white rounded-xl p-3 text-center border border-gray-200 shadow-sm">
          <p className="text-xl font-black text-slate-900">{visibleRoutes.length}</p>
          <p className="text-slate-500 font-bold text-[10px] uppercase tracking-wider">Total Routes</p>
        </div>
        <div className="bg-white rounded-xl p-3 text-center border border-gray-200 shadow-sm">
          <p className="text-xl font-black text-green-600">{visibleRoutes.filter((route) => route.active).length}</p>
          <p className="text-slate-500 font-bold text-[10px] uppercase tracking-wider">Active</p>
        </div>
        <div className="bg-white rounded-xl p-3 text-center border border-gray-200 shadow-sm">
          <p className="text-xl font-black text-[#004892]">
            {visibleRoutes.reduce((acc, route) => acc + route.stops.length, 0)}
          </p>
          <p className="text-slate-500 font-bold text-[10px] uppercase tracking-wider">Total Stops</p>
        </div>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 bg-gray-100 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-gray-300">
          <Bus className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500 font-medium">No routes match your search.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((route) => (
            <RouteCard
              key={route.id}
              route={route}
              userRoute={profile?.routeId === route.id}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function RoutesPage() {
  return (
    <AuthGuard>
      <RoutesContent />
    </AuthGuard>
  );
}
