'use client';

import { useEffect, useState } from 'react';
import {
  Shield, Plus, Edit2, Trash2, Bell, Bus, Route, Save, X,
  Users, TrendingUp, AlertTriangle, CheckCircle2, Send, Loader2,
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

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : 'Something went wrong.';
}

function AdminStats({ routes, buses, alerts }: { routes: BusRoute[]; buses: BusType[]; alerts: BusAlert[] }) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <div className="stat-grid-card">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#E9F2FF] flex items-center justify-center">
            <Route className="w-5 h-5 text-[#004892]" />
          </div>
          <div>
            <p className="text-2xl font-black text-slate-900">{routes.length}</p>
            <p className="text-slate-500 text-xs font-medium">Total Routes</p>
          </div>
        </div>
      </div>
      <div className="stat-grid-card">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <p className="text-2xl font-black text-green-600">{routes.filter((r) => r.active).length}</p>
            <p className="text-slate-500 text-xs font-medium">Active Routes</p>
          </div>
        </div>
      </div>
      <div className="stat-grid-card">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center">
            <Bus className="w-5 h-5 text-indigo-600" />
          </div>
          <div>
            <p className="text-2xl font-black text-indigo-600">{buses.length}</p>
            <p className="text-slate-500 text-xs font-medium">Total Buses</p>
          </div>
        </div>
      </div>
      <div className="stat-grid-card">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
            <AlertTriangle className="w-5 h-5 text-amber-600" />
          </div>
          <div>
            <p className="text-2xl font-black text-amber-600">{alerts.length}</p>
            <p className="text-slate-500 text-xs font-medium">Active Alerts</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function AdminContent() {
  const [tab, setTab] = useState<AdminTab>('overview');
  const [routes, setRoutes] = useState<BusRoute[]>([]);
  const [buses, setBuses] = useState<BusType[]>([]);
  const [alerts, setAlerts] = useState<BusAlert[]>([]);

  const [editingRoute, setEditingRoute] = useState<BusRoute | null>(null);
  const [newRoute, setNewRoute] = useState({ ...EMPTY_ROUTE });

  const [alertMsg, setAlertMsg] = useState('');
  const [overviewAlertMsg, setOverviewAlertMsg] = useState('');
  const [alertType, setAlertType] = useState<BusAlert['type']>('info');
  const [alertBusNum, setAlertBusNum] = useState('');

  const [editBusId, setEditBusId] = useState('');
  const [editLat, setEditLat] = useState('');
  const [editLng, setEditLng] = useState('');
  const [newBus, setNewBus] = useState({ busNumber: '', routeId: '', driverName: '', driverPhone: '' });

  const [deleteConfirm, setDeleteConfirm] = useState<{type: 'route'|'bus', id: string, name: string} | null>(null);

  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
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
    } catch (error) { showToast(getErrorMessage(error)); }
    setSaving(false);
  };

  const handleDeleteRoute = async () => {
    if (!deleteConfirm) return;
    setDeleteId(deleteConfirm.id);
    try {
      await deleteRoute(deleteConfirm.id);
      showToast('Route deleted.');
      setDeleteConfirm(null);
    } catch (error) {
      showToast(getErrorMessage(error));
    } finally {
      setDeleteId(null);
    }
  };

  const handleToggleRoute = async (route: BusRoute) => {
    try {
      await updateRoute(route.id, { active: !route.active });
      showToast(`Route ${!route.active ? 'activated' : 'deactivated'}.`);
    } catch (error) {
      showToast(getErrorMessage(error));
    }
  };

  const handleBroadcast = async (msg: string = alertMsg, type: BusAlert['type'] = alertType, busNum: string = alertBusNum) => {
    if (!msg.trim()) return;
    setSaving(true);
    try {
      await addAlert({ message: msg, type: type, busNumber: busNum || undefined, active: true });
      if (msg === alertMsg) { setAlertMsg(''); setAlertBusNum(''); }
      if (msg === overviewAlertMsg) { setOverviewAlertMsg(''); }
      showToast('Alert broadcast to all students!');
    } catch (error) { showToast(getErrorMessage(error)); }
    setSaving(false);
  };

  const handleAddBus = async () => {
    if (!newBus.busNumber || !newBus.routeId || !newBus.driverName) return;
    setSaving(true);
    try {
      await addBus({ ...newBus, lat: 0, lng: 0, speed: 0, isActive: false });
      setNewBus({ busNumber: '', routeId: '', driverName: '', driverPhone: '' });
      showToast('Bus added successfully!');
    } catch (error) { showToast(getErrorMessage(error)); }
    setSaving(false);
  };
  
  const handleDeleteBus = async () => {
    if (!deleteConfirm) return;
    setDeleteId(deleteConfirm.id);
    try {
      await deleteBus(deleteConfirm.id);
      showToast('Bus deleted.');
      setDeleteConfirm(null);
    } catch (error) {
      showToast(getErrorMessage(error));
    } finally {
      setDeleteId(null);
    }
  };

  const handleUpdateBusLoc = async () => {
    if (!editBusId || !editLat || !editLng) return;
    setSaving(true);
    try {
      const { updateBusLocation } = await import('@/lib/firestore');
      await updateBusLocation(editBusId, parseFloat(editLat), parseFloat(editLng));
      showToast('Bus location updated!');
      setEditBusId(''); setEditLat(''); setEditLng('');
    } catch (error) { showToast(getErrorMessage(error)); }
    setSaving(false);
  };

  const tabs: { id: AdminTab; label: string; icon: React.ElementType }[] = [
    { id: 'overview', label: 'Overview', icon: TrendingUp },
    { id: 'routes', label: 'Routes', icon: Route },
    { id: 'buses', label: 'Buses', icon: Bus },
    { id: 'alerts', label: 'Alerts', icon: Bell },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Toast */}
      {toast && (
        <div className={`toast-notification`}>
          <CheckCircle2 className="w-5 h-5" />
          {toast}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="modal-overlay">
          <div className="modal-content p-6">
            <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mb-4 mx-auto text-red-600">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-black text-slate-900 text-center mb-2">Delete {deleteConfirm.type === 'route' ? 'Route' : 'Bus'}?</h3>
            <p className="text-slate-500 text-center mb-6">
              Are you sure you want to delete <span className="font-bold text-slate-700">{deleteConfirm.name}</span>?<br />This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirm(null)} className="btn-admin-secondary flex-1">
                Cancel
              </button>
              <button onClick={deleteConfirm.type === 'route' ? handleDeleteRoute : handleDeleteBus} className="btn-admin-danger flex-1" disabled={deleteId !== null}>
                {deleteId !== null ? <><Loader2 className="w-4 h-4 animate-spin mr-1" /> Deleting...</> : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="admin-section-header">
        <div className="admin-section-icon">
          <Shield className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl font-black text-slate-900">Admin Dashboard</h1>
          <p className="text-slate-500 text-sm mt-0.5">Manage routes, buses, and broadcast alerts</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="admin-tabs mb-6 overflow-x-auto">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button key={id} onClick={() => setTab(id)} className={`admin-tab ${tab === id ? 'active' : ''}`}>
            <Icon className="w-4 h-4 inline mr-1.5" /> {label}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {tab === 'overview' && (
        <div>
          <AdminStats routes={routes} buses={buses} alerts={alerts} />

          <div className="admin-card p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-slate-900 font-bold flex items-center gap-2">
                <Users className="w-5 h-5 text-[#004892]" />
                Quick Broadcast
              </h3>
            </div>
            <p className="text-slate-500 text-sm mb-4">Send an urgent message to all students right now.</p>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                value={overviewAlertMsg}
                onChange={(e) => setOverviewAlertMsg(e.target.value)}
                placeholder="Type your message..."
                className="admin-input"
              />
              <button
                onClick={() => handleBroadcast(overviewAlertMsg, 'info', '')}
                disabled={!overviewAlertMsg || saving}
                className="btn-admin-primary whitespace-nowrap"
              >
                <Send className="w-4 h-4" />
                Send
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Routes Tab */}
      {tab === 'routes' && (
        <div className="space-y-6">
          <div className="admin-card p-6">
            <h3 className="text-slate-900 font-bold mb-4 flex items-center gap-2">
              <Plus className="w-5 h-5 text-[#004892]" />
              {editingRoute ? 'Edit Route' : 'Add New Route'}
            </h3>
            <p className="text-slate-500 text-sm mb-4">Route changes save directly to Firestore and update student screens automatically.</p>
            <div className="grid sm:grid-cols-2 gap-4 mb-4">
              <div className="form-group">
                <label>Route Name</label>
                <input
                  placeholder="e.g., City Center Loop"
                  value={editingRoute ? editingRoute.name : newRoute.name}
                  onChange={(e) => editingRoute ? setEditingRoute({ ...editingRoute, name: e.target.value }) : setNewRoute({ ...newRoute, name: e.target.value })}
                  className="admin-input"
                />
              </div>
              <div className="form-group">
                <label>Bus Number</label>
                <input
                  placeholder="e.g., PU-01"
                  value={editingRoute ? editingRoute.busNumber : newRoute.busNumber}
                  onChange={(e) => editingRoute ? setEditingRoute({ ...editingRoute, busNumber: e.target.value }) : setNewRoute({ ...newRoute, busNumber: e.target.value })}
                  className="admin-input"
                />
              </div>
              <div className="form-group">
                <label>Departure Time</label>
                <input
                  placeholder="e.g., 07:30 AM"
                  value={editingRoute ? editingRoute.departureTime : newRoute.departureTime}
                  onChange={(e) => editingRoute ? setEditingRoute({ ...editingRoute, departureTime: e.target.value }) : setNewRoute({ ...newRoute, departureTime: e.target.value })}
                  className="admin-input"
                />
              </div>
              <div className="form-group">
                <label>Return Time</label>
                <input
                  placeholder="e.g., 05:30 PM"
                  value={editingRoute ? editingRoute.returnTime : newRoute.returnTime}
                  onChange={(e) => editingRoute ? setEditingRoute({ ...editingRoute, returnTime: e.target.value }) : setNewRoute({ ...newRoute, returnTime: e.target.value })}
                  className="admin-input"
                />
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={handleSaveRoute} disabled={saving} className="btn-admin-primary">
                {saving ? <><Loader2 className="w-4 h-4 animate-spin mr-1" /> Saving...</> : <><Save className="w-4 h-4" /> {editingRoute ? 'Update Route' : 'Add Route'}</>}
              </button>
              {editingRoute && (
                <button onClick={() => setEditingRoute(null)} className="btn-admin-secondary">
                  <X className="w-4 h-4 mr-1" /> Cancel
                </button>
              )}
            </div>
          </div>

          <div className="space-y-3">
            {routes.length === 0 && (
              <div className="admin-empty-state">
                <Route className="w-16 h-16" />
                <p className="font-bold text-slate-700">No routes yet</p>
                <p className="text-sm">Add your first route above.</p>
              </div>
            )}
            {routes.map((route) => (
              <div key={route.id} className="data-item-card">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <p className="text-slate-900 font-bold text-lg">{route.name}</p>
                    <p className="text-slate-500 text-sm font-medium">Bus #{route.busNumber} • {route.stops.length} stops • {route.departureTime} → {route.returnTime}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => handleToggleRoute(route)} className={`px-3 py-1.5 rounded-lg text-[10px] uppercase tracking-wider font-bold border transition-all ${route.active ? 'status-badge-active' : 'status-badge-inactive'}`}>
                      {route.active ? 'Active' : 'Inactive'}
                    </button>
                    <div className="btn-group">
                      <button onClick={() => setEditingRoute(route)} className="btn-admin-icon-sm tooltip" data-tip="Edit">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button onClick={() => setDeleteConfirm({ type: 'route', id: route.id, name: route.name })} className="btn-admin-icon-sm tooltip" data-tip="Delete">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Buses Tab */}
      {tab === 'buses' && (
        <div className="space-y-6">
          <div className="admin-card p-6">
            <h3 className="text-slate-900 font-bold mb-4 flex items-center gap-2">
              <Plus className="w-5 h-5 text-indigo-600" /> Add New Bus
            </h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              <div className="form-group">
                <label>Bus Number</label>
                <input placeholder="e.g., PU-05" value={newBus.busNumber} onChange={(e) => setNewBus({...newBus, busNumber: e.target.value})} className="admin-input" />
              </div>
              <div className="form-group">
                <label>Route ID</label>
                <input placeholder="e.g., route-1" value={newBus.routeId} onChange={(e) => setNewBus({...newBus, routeId: e.target.value})} className="admin-input" />
              </div>
              <div className="form-group">
                <label>Driver Name</label>
                <input placeholder="Driver name" value={newBus.driverName} onChange={(e) => setNewBus({...newBus, driverName: e.target.value})} className="admin-input" />
              </div>
              <div className="form-group">
                <label>Driver Phone</label>
                <input placeholder="Phone number" value={newBus.driverPhone} onChange={(e) => setNewBus({...newBus, driverPhone: e.target.value})} className="admin-input" />
              </div>
            </div>
            <button onClick={handleAddBus} disabled={saving || !newBus.busNumber || !newBus.routeId || !newBus.driverName} className="btn-admin-primary">
              {saving ? <><Loader2 className="w-4 h-4 animate-spin mr-1" /> Saving...</> : <><Plus className="w-4 h-4" /> Add Bus</>}
            </button>
          </div>

          <div className="admin-card p-6">
            <h3 className="text-slate-900 font-bold mb-4 flex items-center gap-2">
              <Edit2 className="w-5 h-5 text-indigo-600" /> Update Bus Location
            </h3>
            <div className="grid sm:grid-cols-3 gap-4 mb-4">
              <div className="form-group">
                <label>Select Bus</label>
                <select value={editBusId} onChange={(e) => setEditBusId(e.target.value)} className="admin-select">
                  <option value="">Select bus...</option>
                  {buses.map((b) => <option key={b.id} value={b.id}>{b.busNumber} — {b.driverName}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Latitude</label>
                <input placeholder="e.g., 26.8467" value={editLat} onChange={(e) => setEditLat(e.target.value)} className="admin-input" />
              </div>
              <div className="form-group">
                <label>Longitude</label>
                <input placeholder="e.g., 75.7480" value={editLng} onChange={(e) => setEditLng(e.target.value)} className="admin-input" />
              </div>
            </div>
            <button onClick={handleUpdateBusLoc} disabled={saving || !editBusId} className="btn-admin-primary">
              {saving ? <><Loader2 className="w-4 h-4 animate-spin mr-1" /> Saving...</> : 'Update Location'}
            </button>
          </div>

          <div className="space-y-3">
            {buses.length === 0 && (
              <div className="admin-empty-state">
                <Bus className="w-16 h-16" />
                <p className="font-bold text-slate-700">No buses registered</p>
                <p className="text-sm">Add buses using the form above.</p>
              </div>
            )}
            {buses.map((bus) => (
              <div key={bus.id} className="data-item-card">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${bus.isActive ? 'bg-indigo-50' : 'bg-slate-50'}`}>
                      <Bus className={`w-5 h-5 ${bus.isActive ? 'text-indigo-600' : 'text-slate-400'}`} />
                    </div>
                    <div>
                      <p className="text-slate-900 font-black">Bus #{bus.busNumber}</p>
                      <p className="text-slate-500 text-sm font-medium">{bus.driverName} · {bus.driverPhone}</p>
                      <p className="text-slate-500 text-xs font-bold mt-0.5">
                        {bus.lat?.toFixed(4)}, {bus.lng?.toFixed(4)} · {bus.speed ?? 0} km/h
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`status-badge ${bus.isActive ? 'status-badge-active' : 'status-badge-inactive'}`}>
                      {bus.isActive ? 'Active' : 'Parked'}
                    </span>
                    <div className="btn-group">
                      <button onClick={async () => {
                        try {
                          await updateBus(bus.id, { isActive: !bus.isActive });
                          showToast(`Bus ${!bus.isActive ? 'activated' : 'parked'}.`);
                        } catch (error) {
                          showToast(getErrorMessage(error));
                        }
                      }} className="btn-admin-icon-sm tooltip" data-tip="Toggle status">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button onClick={() => setDeleteConfirm({ type: 'bus', id: bus.id, name: bus.busNumber })} className="btn-admin-icon-sm tooltip" data-tip="Delete">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Alerts Tab */}
      {tab === 'alerts' && (
        <div className="space-y-6">
          <div className="admin-card p-6">
            <h3 className="text-slate-900 font-bold mb-4 flex items-center gap-2">
              <Bell className="w-5 h-5 text-amber-600" /> Broadcast Alert
            </h3>
            <div className="grid sm:grid-cols-2 gap-4 mb-4">
              <div className="form-group">
                <label>Alert Type</label>
                <select value={alertType} onChange={(e) => setAlertType(e.target.value as BusAlert['type'])} className="admin-select">
                  <option value="info">Info</option>
                  <option value="delay">Delay</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="emergency">Emergency</option>
                </select>
              </div>
              <div className="form-group">
                <label>Bus Number (optional)</label>
                <input placeholder="e.g., PU-01" value={alertBusNum} onChange={(e) => setAlertBusNum(e.target.value)} className="admin-input" />
              </div>
            </div>
            <div className="form-group">
              <label>Message</label>
              <textarea
                placeholder="Type your alert message..."
                value={alertMsg}
                onChange={(e) => setAlertMsg(e.target.value)}
                rows={3}
                className="admin-textarea"
              />
            </div>
            <button onClick={() => handleBroadcast(alertMsg, alertType, alertBusNum)} disabled={!alertMsg || saving} className="btn-admin-primary">
              {saving ? <><Loader2 className="w-4 h-4 animate-spin mr-1" /> Broadcasting...</> : <><Send className="w-4 h-4" /> Broadcast Alert</>}
            </button>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2 mb-2">
              <span className="status-badge status-badge-info">Active Alerts ({alerts.length})</span>
            </div>
            {alerts.length === 0 && (
              <div className="admin-empty-state">
                <Bell className="w-16 h-16" />
                <p className="font-bold text-slate-700">No active alerts</p>
                <p className="text-sm">Create an alert using the form above.</p>
              </div>
            )}
            {alerts.map((alert) => (
              <div key={alert.id} className="data-item-card">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`status-badge alert-badge-${alert.type}`}>{alert.type.toUpperCase()}</span>
                      {alert.busNumber && <span className="text-slate-500 text-sm">Bus #{alert.busNumber}</span>}
                    </div>
                    <p className="text-slate-900 font-medium">{alert.message}</p>
                  </div>
                  <button
                    onClick={async () => {
                      try {
                        await deactivateAlert(alert.id);
                        showToast('Alert deactivated.');
                      } catch (error) {
                        showToast(getErrorMessage(error));
                      }
                    }}
                    className="btn-admin-icon-sm tooltip" data-tip="Deactivate"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
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
