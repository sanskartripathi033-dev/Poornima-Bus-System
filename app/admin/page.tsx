'use client';

import { useEffect, useState } from 'react';
import {
  Shield, Plus, Edit2, Trash2, Bell, Bus, Route, Save, X,
  Users, TrendingUp, AlertTriangle, CheckCircle2, Send,
} from 'lucide-react';
import AuthGuard from '@/components/AuthGuard';
import {
  subscribeRoutes, addRoute, updateRoute, deleteRoute,
  subscribeBuses, addBus, updateBus, deleteBus,
  addAlert, subscribeAlerts, deactivateAlert,
} from '@/lib/firestore';
import { BusRoute, Bus as BusType, BusAlert } from '@/lib/types';

type AdminTab = 'overview' | 'routes' | 'buses' | 'alerts';

const EMPTY_ROUTE: Omit<BusRoute, 'id' | 'createdAt' | 'updatedAt'> = {
  name: '', busNumber: '', stops: [], active: true, departureTime: '', returnTime: '',
};

function AdminContent() {
  const [tab, setTab] = useState<AdminTab>('overview');
  const [routes, setRoutes] = useState<BusRoute[]>([]);
  const [buses, setBuses] = useState<BusType[]>([]);
  const [alerts, setAlerts] = useState<BusAlert[]>([]);

  // Route form
  const [editingRoute, setEditingRoute] = useState<BusRoute | null>(null);
  const [newRoute, setNewRoute] = useState({ ...EMPTY_ROUTE });

  // Alert form
  const [alertMsg, setAlertMsg] = useState('');
  const [alertType, setAlertType] = useState<BusAlert['type']>('info');
  const [alertBusNum, setAlertBusNum] = useState('');

  // Bus location update
  const [editBusId, setEditBusId] = useState('');
  const [editLat, setEditLat] = useState('');
  const [editLng, setEditLng] = useState('');

  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState('');

  useEffect(() => {
    const u1 = subscribeRoutes(setRoutes);
    const u2 = subscribeBuses(setBuses);
    const u3 = subscribeAlerts(setAlerts);
    return () => { u1(); u2(); u3(); };
  }, []);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  // Route CRUD
  const handleSaveRoute = async () => {
    setSaving(true);
    try {
      if (editingRoute) {
        await updateRoute(editingRoute.id, { name: editingRoute.name, busNumber: editingRoute.busNumber, active: editingRoute.active, departureTime: editingRoute.departureTime, returnTime: editingRoute.returnTime });
        showToast('Route updated successfully!');
      } else {
        await addRoute(newRoute);
        setNewRoute({ ...EMPTY_ROUTE });
        showToast('Route added successfully!');
      }
      setEditingRoute(null);
    } catch (e: any) { showToast('Error: ' + e.message); }
    setSaving(false);
  };

  const handleDeleteRoute = async (id: string) => {
    if (!confirm('Delete this route?')) return;
    await deleteRoute(id);
    showToast('Route deleted.');
  };

  const handleToggleRoute = async (route: BusRoute) => {
    await updateRoute(route.id, { active: !route.active });
    showToast(`Route ${!route.active ? 'activated' : 'deactivated'}.`);
  };

  // Alert broadcast
  const handleBroadcast = async () => {
    if (!alertMsg.trim()) return;
    setSaving(true);
    try {
      await addAlert({ message: alertMsg, type: alertType, busNumber: alertBusNum || undefined, active: true });
      setAlertMsg(''); setAlertBusNum('');
      showToast('Alert broadcast to all students!');
    } catch (e: any) { showToast('Error: ' + e.message); }
    setSaving(false);
  };

  // Bus location update
  const handleUpdateBusLoc = async () => {
    if (!editBusId || !editLat || !editLng) return;
    setSaving(true);
    try {
      const { updateBusLocation } = await import('@/lib/firestore');
      await updateBusLocation(editBusId, parseFloat(editLat), parseFloat(editLng));
      showToast('Bus location updated!');
      setEditBusId(''); setEditLat(''); setEditLng('');
    } catch (e: any) { showToast('Error: ' + e.message); }
    setSaving(false);
  };

  const tabs: { id: AdminTab; label: string; icon: any }[] = [
    { id: 'overview', label: 'Overview', icon: TrendingUp },
    { id: 'routes', label: 'Routes', icon: Route },
    { id: 'buses', label: 'Buses', icon: Bus },
    { id: 'alerts', label: 'Alerts', icon: Bell },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Toast */}
      {toast && (
        <div className="fixed top-20 right-4 z-50 bg-green-600 text-white px-5 py-3 rounded-xl shadow-lg flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4" /> {toast}
        </div>
      )}

      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 rounded-2xl bg-[#004892] flex items-center justify-center shadow-md">
          <Shield className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-black text-slate-900">Admin Dashboard</h1>
          <p className="text-slate-500 font-medium text-sm">Manage routes, buses, and broadcast alerts</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1.5 bg-gray-100 border border-gray-200 rounded-2xl p-1.5 mb-8 overflow-x-auto shadow-inner">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap flex-shrink-0 ${
              tab === id ? 'bg-white text-[#004892] shadow-sm ring-1 ring-black/5' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Icon className="w-4 h-4" />
            {label}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {tab === 'overview' && (
        <div className="space-y-6">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: 'Total Routes', value: routes.length, icon: Route, color: 'text-[#004892]' },
              { label: 'Active Routes', value: routes.filter((r) => r.active).length, icon: CheckCircle2, color: 'text-green-600' },
              { label: 'Total Buses', value: buses.length, icon: Bus, color: 'text-indigo-600' },
              { label: 'Active Alerts', value: alerts.length, icon: AlertTriangle, color: 'text-amber-500' },
            ].map((stat) => {
              const Icon = stat.icon;
              return (
                <div key={stat.label} className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                  <Icon className={`w-8 h-8 ${stat.color} mb-3`} />
                  <p className="text-3xl font-black text-slate-900">{stat.value}</p>
                  <p className="text-slate-500 text-[11px] font-bold uppercase tracking-wider mt-1">{stat.label}</p>
                </div>
              );
            })}
          </div>

          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
            <h3 className="text-slate-900 font-bold mb-4 flex items-center gap-2">
              <Users className="w-5 h-5 text-[#004892]" /> Quick Broadcast
            </h3>
            <p className="text-slate-500 font-medium text-sm mb-4">Send an urgent message to all students right now.</p>
            <div className="flex gap-3">
              <input
                value={alertMsg}
                onChange={(e) => setAlertMsg(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#FABE15]/50 focus:ring-1 focus:ring-[#FABE15]/50"
              />
              <button
                onClick={handleBroadcast}
                disabled={!alertMsg || saving}
                className="px-6 py-3 bg-[#FABE15] hover:bg-[#e0ab13] disabled:bg-gray-200 disabled:text-gray-400 text-slate-900 font-bold rounded-xl transition-all flex items-center gap-2 shadow-sm"
              >
                <Send className="w-4 h-4" /> Send
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Routes Tab */}
      {tab === 'routes' && (
        <div className="space-y-6">
          {/* Add / Edit form */}
          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
            <h3 className="text-slate-900 font-bold mb-4 flex items-center gap-2">
              <Plus className="w-5 h-5 text-[#004892]" />
              {editingRoute ? 'Edit Route' : 'Add New Route'}
            </h3>
            <div className="grid sm:grid-cols-2 gap-4 mb-4">
              <input
                placeholder="Route Name"
                value={editingRoute ? editingRoute.name : newRoute.name}
                onChange={(e) => editingRoute ? setEditingRoute({ ...editingRoute, name: e.target.value }) : setNewRoute({ ...newRoute, name: e.target.value })}
                className="bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#004892]/50 focus:ring-1 focus:ring-[#004892]/50"
              />
              <input
                placeholder="Bus Number (e.g. PU-01)"
                value={editingRoute ? editingRoute.busNumber : newRoute.busNumber}
                onChange={(e) => editingRoute ? setEditingRoute({ ...editingRoute, busNumber: e.target.value }) : setNewRoute({ ...newRoute, busNumber: e.target.value })}
                className="bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#004892]/50 focus:ring-1 focus:ring-[#004892]/50"
              />
              <input
                placeholder="Departure Time (e.g. 07:30 AM)"
                value={editingRoute ? editingRoute.departureTime : newRoute.departureTime}
                onChange={(e) => editingRoute ? setEditingRoute({ ...editingRoute, departureTime: e.target.value }) : setNewRoute({ ...newRoute, departureTime: e.target.value })}
                className="bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#004892]/50 focus:ring-1 focus:ring-[#004892]/50"
              />
              <input
                placeholder="Return Time (e.g. 05:30 PM)"
                value={editingRoute ? editingRoute.returnTime : newRoute.returnTime}
                onChange={(e) => editingRoute ? setEditingRoute({ ...editingRoute, returnTime: e.target.value }) : setNewRoute({ ...newRoute, returnTime: e.target.value })}
                className="bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#004892]/50 focus:ring-1 focus:ring-[#004892]/50"
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleSaveRoute}
                disabled={saving}
                className="flex items-center gap-2 px-6 py-3 bg-[#004892] hover:bg-[#003870] disabled:bg-gray-300 disabled:text-gray-500 text-white font-bold rounded-xl transition-all shadow-sm"
              >
                <Save className="w-4 h-4" />
                {editingRoute ? 'Update Route' : 'Add Route'}
              </button>
              {editingRoute && (
                <button
                  onClick={() => setEditingRoute(null)}
                  className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-200 text-slate-600 font-bold rounded-xl transition-all hover:bg-gray-50 shadow-sm"
                >
                  <X className="w-4 h-4" /> Cancel
                </button>
              )}
            </div>
          </div>

          {/* Routes list */}
          <div className="space-y-3">
            {routes.length === 0 && (
              <div className="text-center py-12 text-slate-400 font-medium bg-white rounded-2xl border border-dashed border-gray-300">
                No routes yet. Add your first route above.
              </div>
            )}
            {routes.map((route) => (
              <div key={route.id} className="bg-white rounded-2xl border border-gray-200 p-4 flex items-center justify-between gap-4 flex-wrap shadow-sm hover:border-[#004892]/30 transition-colors">
                <div>
                  <p className="text-slate-900 font-black">{route.name}</p>
                  <p className="text-slate-500 font-medium text-sm">
                    Bus #{route.busNumber} · {route.stops.length} stops · {route.departureTime} → {route.returnTime}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleToggleRoute(route)}
                    className={`px-3 py-1.5 rounded-lg text-[10px] uppercase tracking-wider font-bold border transition-all ${
                      route.active
                        ? 'bg-green-50 border-green-200 text-green-700 hover:bg-red-50 hover:border-red-200 hover:text-red-700'
                        : 'bg-red-50 border-red-200 text-red-700 hover:bg-green-50 hover:border-green-200 hover:text-green-700'
                    }`}
                  >
                    {route.active ? 'Active' : 'Inactive'}
                  </button>
                  <button
                    onClick={() => setEditingRoute(route)}
                    className="p-2 rounded-lg text-slate-400 hover:text-[#004892] hover:bg-[#E9F2FF] transition-all"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteRoute(route.id)}
                    className="p-2 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Buses Tab */}
      {tab === 'buses' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
            <h3 className="text-slate-900 font-bold mb-4 flex items-center gap-2">
              <Bus className="w-5 h-5 text-indigo-600" /> Update Bus Location
            </h3>
            <div className="grid sm:grid-cols-3 gap-4 mb-4">
              <select
                value={editBusId}
                onChange={(e) => setEditBusId(e.target.value)}
                className="bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 text-slate-900 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 font-medium"
              >
                <option value="">Select Bus</option>
                {buses.map((b) => (
                  <option key={b.id} value={b.id}>{b.busNumber} — {b.driverName}</option>
                ))}
              </select>
              <input
                placeholder="Latitude (e.g. 26.8467)"
                value={editLat}
                onChange={(e) => setEditLat(e.target.value)}
                className="bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 font-medium"
              />
              <input
                placeholder="Longitude (e.g. 75.7480)"
                value={editLng}
                onChange={(e) => setEditLng(e.target.value)}
                className="bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 font-medium"
              />
            </div>
            <button
              onClick={handleUpdateBusLoc}
              disabled={saving || !editBusId}
              className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-300 disabled:text-gray-500 text-white font-bold rounded-xl transition-all shadow-sm"
            >
              <Save className="w-4 h-4" /> Update Location
            </button>
          </div>

          {/* Bus list */}
          <div className="space-y-3">
            {buses.length === 0 && (
              <div className="text-center py-12 text-slate-400 font-medium bg-white rounded-2xl border border-dashed border-gray-300">
                No buses registered yet. Use Firebase Console or Admin SDK to seed bus data.
              </div>
            )}
            {buses.map((bus) => (
              <div key={bus.id} className="bg-white rounded-2xl border border-gray-200 p-4 flex items-center justify-between gap-4 flex-wrap shadow-sm hover:border-indigo-500/30 transition-colors">
                <div className="flex items-center gap-3">
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center shadow-sm ${bus.isActive ? 'bg-indigo-50 border border-indigo-100' : 'bg-gray-100 border border-gray-200'}`}>
                    <Bus className={`w-5 h-5 ${bus.isActive ? 'text-indigo-600' : 'text-slate-400'}`} />
                  </div>
                  <div>
                    <p className="text-slate-900 font-black">Bus #{bus.busNumber}</p>
                    <p className="text-slate-500 text-sm font-medium">Driver: {bus.driverName} · {bus.driverPhone}</p>
                    <p className="text-slate-500 text-xs font-bold mt-0.5">
                      {bus.lat?.toFixed(4)}, {bus.lng?.toFixed(4)} · {bus.speed ?? 0} km/h
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1.5 rounded-lg text-[10px] uppercase tracking-wider font-bold border transition-all ${bus.isActive ? 'bg-green-50 border-green-200 text-green-700' : 'bg-gray-50 border-gray-200 text-slate-500'}`}>
                    {bus.isActive ? 'Active' : 'Parked'}
                  </span>
                  <button
                    onClick={() => updateBus(bus.id, { isActive: !bus.isActive })}
                    className="p-2 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all border border-transparent hover:border-indigo-200"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => { if (confirm('Delete this bus?')) deleteBus(bus.id); }}
                    className="p-2 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-all border border-transparent hover:border-red-200"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Alerts Tab */}
      {tab === 'alerts' && (
        <div className="space-y-6">
          {/* Broadcast form */}
          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
            <h3 className="text-slate-900 font-bold mb-4 flex items-center gap-2">
              <Bell className="w-5 h-5 text-amber-500" /> Broadcast Alert
            </h3>
            <div className="grid sm:grid-cols-2 gap-4 mb-4">
              <select
                value={alertType}
                onChange={(e) => setAlertType(e.target.value as BusAlert['type'])}
                className="bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 text-slate-900 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/50 font-bold"
              >
                <option value="info">ℹ️ Info</option>
                <option value="delay">⚠️ Delay</option>
                <option value="cancelled">❌ Cancelled</option>
                <option value="emergency">🚨 Emergency</option>
              </select>
              <input
                placeholder="Bus number (optional)"
                value={alertBusNum}
                onChange={(e) => setAlertBusNum(e.target.value)}
                className="bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/50 font-medium"
              />
            </div>
            <textarea
              placeholder="Type your alert message..."
              value={alertMsg}
              onChange={(e) => setAlertMsg(e.target.value)}
              rows={3}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/50 resize-none mb-4 font-medium"
            />
            <button
              onClick={handleBroadcast}
              disabled={!alertMsg || saving}
              className="flex items-center gap-2 px-6 py-3 bg-[#FABE15] hover:bg-[#e0ab13] disabled:bg-gray-300 disabled:text-gray-500 text-slate-900 font-black rounded-xl transition-all shadow-sm"
            >
              <Send className="w-4 h-4" /> Broadcast Alert
            </button>
          </div>

          {/* Active alerts */}
          <div className="space-y-3">
            <h3 className="text-slate-900 font-bold text-sm bg-gray-100 px-3 py-2 rounded-lg border border-gray-200 inline-block">Active Alerts ({alerts.length})</h3>
            {alerts.length === 0 && (
              <div className="text-center py-12 text-slate-400 font-medium bg-white rounded-2xl border border-dashed border-gray-300">No active alerts.</div>
            )}
            {alerts.map((alert) => (
              <div key={alert.id} className="bg-white rounded-2xl border border-gray-200 p-4 flex items-start justify-between gap-4 shadow-sm hover:shadow-md transition-shadow">
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-[10px] font-black uppercase text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-2 py-0.5">
                      {alert.type}
                    </span>
                    {alert.busNumber && <span className="text-[11px] font-bold text-slate-500">Bus #{alert.busNumber}</span>}
                  </div>
                  <p className="text-slate-900 font-medium text-sm">{alert.message}</p>
                </div>
                <button
                  onClick={() => deactivateAlert(alert.id)}
                  className="flex-shrink-0 p-2 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-all border border-transparent hover:border-red-200"
                  title="Deactivate alert"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminPage() {
  return (
    <AuthGuard requireAdmin>
      <AdminContent />
    </AuthGuard>
  );
}
