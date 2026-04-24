'use client';

import { useEffect, useState } from 'react';
import { MapPin, Route, Bell, QrCode, RefreshCw } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import AuthGuard from '@/components/AuthGuard';
import AlertBanner from '@/components/AlertBanner';
import DigitalPassCard from '@/components/DigitalPassCard';
import { getRoute } from '@/lib/firestore';
import { BusRoute } from '@/lib/types';

function DashboardContent() {
  const { profile } = useAuth();
  const [route, setRoute] = useState<BusRoute | null>(null);
  const [loadingRoute, setLoadingRoute] = useState(false);

  useEffect(() => {
    if (profile?.routeId) {
      setLoadingRoute(true);
      getRoute(profile.routeId)
        .then(setRoute)
        .finally(() => setLoadingRoute(false));
    }
  }, [profile?.routeId]);

  if (!profile) return null;

  const quickActions = [
    { href: '/tracking', icon: MapPin, label: 'Track My Bus', desc: 'See live location', color: 'from-blue-600 to-blue-500' },
    { href: '/routes', icon: Route, label: 'View Routes', desc: 'All bus routes & stops', color: 'from-indigo-600 to-indigo-500' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Alerts */}
      <AlertBanner />

      {/* Header */}
      <div className="mb-8">
        <p className="text-slate-500 text-sm font-medium mb-1">Good {getGreeting()},</p>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900">
          {profile.name} 👋
        </h1>
        <p className="text-slate-500 text-sm mt-1">{profile.email}</p>
      </div>

      <div className="grid lg:grid-cols-5 gap-8">
        {/* Left: Digital Pass */}
        <div className="lg:col-span-2">
          <div className="flex items-center gap-2 mb-4">
            <QrCode className="w-5 h-5 text-[#004892]" />
            <h2 className="text-slate-900 font-bold text-lg">Your Digital Pass</h2>
          </div>
          <DigitalPassCard profile={profile} routeName={route?.name} />
          <p className="text-center text-slate-500 font-medium text-xs mt-3">
            Show this QR code to the bus conductor for verification
          </p>
        </div>

        {/* Right: Info & Actions */}
        <div className="lg:col-span-3 space-y-6">
          {/* Route Info Card */}
          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-slate-900 font-bold flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#E9F2FF] flex items-center justify-center">
                  <Route className="w-4 h-4 text-[#004892]" />
                </div>
                Your Route
              </h3>
              {loadingRoute && <RefreshCw className="w-4 h-4 text-[#004892] animate-spin" />}
            </div>
            {route ? (
              <div className="space-y-3 mt-2">
                <div className="flex items-center justify-between bg-[#FAFAFA] border border-gray-100 p-4 rounded-xl">
                  <div>
                    <p className="text-slate-900 font-black text-xl">{route.name}</p>
                    <p className="text-slate-500 text-sm font-medium">Bus #{route.busNumber}</p>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-bold border shadow-sm ${route.active ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-700'}`}>
                    {route.active ? 'ACTIVE' : 'INACTIVE'}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3 mt-3">
                  <div className="bg-[#FAFAFA] border border-gray-100 rounded-xl p-3">
                    <p className="text-slate-500 text-[10px] font-bold uppercase tracking-wider">Departure</p>
                    <p className="text-slate-900 font-black mt-0.5">{route.departureTime}</p>
                  </div>
                  <div className="bg-[#FAFAFA] border border-gray-100 rounded-xl p-3">
                    <p className="text-slate-500 text-[10px] font-bold uppercase tracking-wider">Return</p>
                    <p className="text-slate-900 font-black mt-0.5">{route.returnTime}</p>
                  </div>
                </div>
                <div className="bg-[#FAFAFA] border border-gray-100 rounded-xl p-4">
                  <p className="text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-3">Stops ({route.stops.length})</p>
                  <div className="flex flex-wrap gap-2">
                    {route.stops
                      .slice()
                      .sort((a, b) => a.order - b.order)
                      .map((s) => (
                        <span key={s.id} className="text-xs font-medium bg-[#E9F2FF] border border-[#004892]/20 text-[#004892] rounded-lg px-2.5 py-1">
                          {s.name}
                        </span>
                      ))}
                  </div>
                </div>
              </div>
            ) : profile.routeId ? (
              <div className="text-slate-500 text-sm font-medium p-4 bg-gray-50 rounded-xl border border-gray-100">Loading route info...</div>
            ) : (
              <div className="text-center py-6 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                <p className="text-slate-700 font-bold text-sm mb-1">No route assigned yet.</p>
                <p className="text-slate-500 text-xs font-medium">Contact your transport incharge to get a route assigned.</p>
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div>
            <h3 className="text-slate-900 font-bold mb-3 flex items-center gap-2">
              <Bell className="w-5 h-5 text-[#FABE15]" />
              Quick Actions
            </h3>
            <div className="grid sm:grid-cols-2 gap-4">
              {quickActions.map((action) => {
                const Icon = action.icon;
                return (
                  <Link
                    key={action.href}
                    href={action.href}
                    className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm hover:shadow-md hover:border-[#004892]/30 transition-all group hover:-translate-y-0.5 duration-200"
                  >
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${action.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform shadow-md shadow-blue-900/10`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <p className="text-slate-900 font-bold text-sm">{action.label}</p>
                    <p className="text-slate-500 font-medium text-xs mt-0.5">{action.desc}</p>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Student ID Badge */}
          <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-500 font-bold text-[10px] uppercase tracking-wider mb-1">Student ID</p>
                <p className="text-slate-900 font-mono font-black text-lg">{profile.studentId || 'Not Set'}</p>
              </div>
              <div className="text-right">
                <p className="text-slate-500 font-bold text-[10px] uppercase tracking-wider mb-1">Account Type</p>
                <span className="inline-flex items-center gap-1 text-xs font-bold text-[#004892] bg-[#E9F2FF] border border-[#004892]/20 rounded-lg px-2.5 py-1">
                  {profile.role === 'admin' ? '🔑 Admin' : '🎓 Student'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'morning';
  if (h < 17) return 'afternoon';
  return 'evening';
}

export default function DashboardPage() {
  return (
    <AuthGuard>
      <DashboardContent />
    </AuthGuard>
  );
}
