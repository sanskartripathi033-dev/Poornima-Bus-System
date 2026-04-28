'use client';

import { useEffect, useState } from 'react';
import { Search, Bus, Filter, RefreshCw } from 'lucide-react';
import AuthGuard from '@/components/AuthGuard';
import AlertBanner from '@/components/AlertBanner';
import RouteCard from '@/components/RouteCard';
import { subscribeRoutes } from '@/lib/firestore';
import { useAuth } from '@/context/AuthContext';
import { BusRoute } from '@/lib/types';

function RoutesContent() {
  const { profile } = useAuth();
  // null = still loading from Firestore, [] = loaded but empty, [...] = has data
  const [routes, setRoutes] = useState<BusRoute[] | null>(null);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'inactive'>('all');

  useEffect(() => {
    // Real-time subscription: updates instantly when admin changes any route
    const unsub = subscribeRoutes((fbRoutes) => {
      setRoutes(fbRoutes); // always use real data — no demo fallback
    });
    return () => unsub();
  }, []);

  const loading = routes === null;

  const filtered = (routes ?? []).filter((route) => {
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

  const totalRoutes = routes?.length ?? 0;
  const activeRoutes = routes?.filter((r) => r.active).length ?? 0;
  const totalStops = routes?.reduce((acc, r) => acc + r.stops.length, 0) ?? 0;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24 md:pb-8">
      <AlertBanner />

      <div className="mb-8">
        <h1 className="text-3xl font-black text-slate-900 mb-1">Bus Routes</h1>
        <p className="text-slate-500 font-medium text-sm">
          {loading ? 'Loading routes...' : `${totalRoutes} route${totalRoutes !== 1 ? 's' : ''} · Live from admin panel`}
        </p>
      </div>

      {/* Search & Filter */}
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

      {/* Stats row */}
      {!loading && (
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="bg-white rounded-xl p-3 text-center border border-gray-200 shadow-sm">
            <p className="text-xl font-black text-slate-900">{totalRoutes}</p>
            <p className="text-slate-500 font-bold text-[10px] uppercase tracking-wider">Total Routes</p>
          </div>
          <div className="bg-white rounded-xl p-3 text-center border border-gray-200 shadow-sm">
            <p className="text-xl font-black text-green-600">{activeRoutes}</p>
            <p className="text-slate-500 font-bold text-[10px] uppercase tracking-wider">Active</p>
          </div>
          <div className="bg-white rounded-xl p-3 text-center border border-gray-200 shadow-sm">
            <p className="text-xl font-black text-[#004892]">{totalStops}</p>
            <p className="text-slate-500 font-bold text-[10px] uppercase tracking-wider">Total Stops</p>
          </div>
        </div>
      )}

      {/* Content */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 bg-gray-100 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : routes!.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-300">
          <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Bus className="w-8 h-8 text-slate-300" />
          </div>
          <p className="text-slate-700 font-bold text-lg mb-1">No Routes Added Yet</p>
          <p className="text-slate-400 font-medium text-sm max-w-xs mx-auto">
            Routes are set up by the transport admin. Check back shortly — changes appear here instantly.
          </p>
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

      {/* Live sync indicator */}
      {!loading && (
        <div className="mt-6 flex items-center justify-center gap-2 text-slate-400 text-xs font-medium">
          <RefreshCw className="w-3 h-3" />
          Live — updates in real-time as admin makes changes
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
