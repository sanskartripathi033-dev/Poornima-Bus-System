import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  where,
  orderBy,
  serverTimestamp,
  Unsubscribe,
} from 'firebase/firestore';
import { db } from './firebase';
import { BusRoute, Bus, BusAlert } from './types';

// ── Routes ──────────────────────────────────────────────────────────────────

export async function getRoutes(): Promise<BusRoute[]> {
  const snap = await getDocs(collection(db, 'routes'));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as BusRoute));
}

export async function getRoute(id: string): Promise<BusRoute | null> {
  const snap = await getDoc(doc(db, 'routes', id));
  return snap.exists() ? ({ id: snap.id, ...snap.data() } as BusRoute) : null;
}

export function subscribeRoute(id: string, callback: (route: BusRoute | null) => void): Unsubscribe {
  let isUnsubscribed = false;
  let retryTimer: NodeJS.Timeout;
  let currentUnsub: Unsubscribe | null = null;

  const startSub = () => {
    if (isUnsubscribed) return;
    currentUnsub = onSnapshot(doc(db, 'routes', id), (snap) => {
      if (!snap.exists()) {
        callback(null);
      } else {
        const data = snap.data() as Record<string, unknown>;
        callback({
          id: snap.id,
          ...data,
          createdAt: (data.createdAt as { toDate?: () => Date })?.toDate?.() || data.createdAt || new Date(),
          updatedAt: (data.updatedAt as { toDate?: () => Date })?.toDate?.() || data.updatedAt || new Date(),
        } as BusRoute);
      }
    }, (error) => {
      console.error("Error subscribing to route, retrying:", error);
      if (currentUnsub) currentUnsub();
      retryTimer = setTimeout(startSub, 2000);
    });
  };
  startSub();

  return () => {
    isUnsubscribed = true;
    if (retryTimer) clearTimeout(retryTimer);
    if (currentUnsub) currentUnsub();
  };
}

export async function addRoute(data: Omit<BusRoute, 'id' | 'createdAt' | 'updatedAt'>) {
  return addDoc(collection(db, 'routes'), {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

export async function updateRoute(id: string, data: Partial<BusRoute>) {
  return updateDoc(doc(db, 'routes', id), { ...data, updatedAt: serverTimestamp() });
}

export async function deleteRoute(id: string) {
  return deleteDoc(doc(db, 'routes', id));
}

export function subscribeRoutes(callback: (routes: BusRoute[]) => void): Unsubscribe {
  let isUnsubscribed = false;
  let retryTimer: NodeJS.Timeout;
  let currentUnsub: Unsubscribe | null = null;

  const startSub = () => {
    if (isUnsubscribed) return;
    currentUnsub = onSnapshot(collection(db, 'routes'), (snap) => {
      callback(snap.docs.map((d) => {
        const data = d.data() as Record<string, unknown>;
        return {
          id: d.id,
          ...data,
          createdAt: (data.createdAt as { toDate?: () => Date })?.toDate?.() || data.createdAt || new Date(),
          updatedAt: (data.updatedAt as { toDate?: () => Date })?.toDate?.() || data.updatedAt || new Date(),
        } as BusRoute;
      }));
    }, (error) => {
      console.error("Error subscribing to routes, retrying:", error);
      if (currentUnsub) currentUnsub();
      retryTimer = setTimeout(startSub, 2000);
    });
  };
  startSub();

  return () => {
    isUnsubscribed = true;
    if (retryTimer) clearTimeout(retryTimer);
    if (currentUnsub) currentUnsub();
  };
}

// ── Buses ────────────────────────────────────────────────────────────────────

export async function getBuses(): Promise<Bus[]> {
  const snap = await getDocs(collection(db, 'buses'));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Bus));
}

export async function updateBusLocation(busId: string, lat: number, lng: number) {
  return updateDoc(doc(db, 'buses', busId), { lat, lng, lastUpdated: serverTimestamp() });
}

export async function addBus(data: Omit<Bus, 'id' | 'lastUpdated'>) {
  return addDoc(collection(db, 'buses'), { ...data, lastUpdated: serverTimestamp() });
}

export async function updateBus(id: string, data: Partial<Bus>) {
  return updateDoc(doc(db, 'buses', id), { ...data, lastUpdated: serverTimestamp() });
}

export async function deleteBus(id: string) {
  return deleteDoc(doc(db, 'buses', id));
}

export function subscribeBuses(callback: (buses: Bus[]) => void): Unsubscribe {
  let isUnsubscribed = false;
  let retryTimer: NodeJS.Timeout;
  let currentUnsub: Unsubscribe | null = null;

  const startSub = () => {
    if (isUnsubscribed) return;
    currentUnsub = onSnapshot(collection(db, 'buses'), (snap) => {
      callback(snap.docs.map((d) => {
        const data = d.data() as Record<string, unknown>;
        return {
          id: d.id,
          ...data,
          lastUpdated: (data.lastUpdated as { toDate?: () => Date })?.toDate?.() || data.lastUpdated || new Date(),
        } as Bus;
      }));
    }, (error) => {
      console.error("Error subscribing to buses, retrying:", error);
      if (currentUnsub) currentUnsub();
      retryTimer = setTimeout(startSub, 2000);
    });
  };
  startSub();

  return () => {
    isUnsubscribed = true;
    if (retryTimer) clearTimeout(retryTimer);
    if (currentUnsub) currentUnsub();
  };
}

// ── Alerts ───────────────────────────────────────────────────────────────────

export async function getActiveAlerts(): Promise<BusAlert[]> {
  const q = query(collection(db, 'alerts'), where('active', '==', true), orderBy('createdAt', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as BusAlert));
}

export async function addAlert(data: Omit<BusAlert, 'id' | 'createdAt'>) {
  return addDoc(collection(db, 'alerts'), { ...data, createdAt: serverTimestamp() });
}

export async function deactivateAlert(id: string) {
  return updateDoc(doc(db, 'alerts', id), { active: false });
}

export function subscribeAlerts(callback: (alerts: BusAlert[]) => void): Unsubscribe {
  let isUnsubscribed = false;
  let retryTimer: NodeJS.Timeout;
  let currentUnsub: Unsubscribe | null = null;

  const startSub = () => {
    if (isUnsubscribed) return;
    const q = query(collection(db, 'alerts'), where('active', '==', true), orderBy('createdAt', 'desc'));
    currentUnsub = onSnapshot(q, (snap) => {
      callback(snap.docs.map((d) => {
        const data = d.data() as Record<string, unknown>;
        return {
          id: d.id,
          ...data,
          createdAt: (data.createdAt as { toDate?: () => Date })?.toDate?.() || data.createdAt || new Date(),
        } as BusAlert;
      }));
    }, (error) => {
      console.error("Error subscribing to alerts, retrying:", error);
      if (currentUnsub) currentUnsub();
      retryTimer = setTimeout(startSub, 2000);
    });
  };
  startSub();

  return () => {
    isUnsubscribed = true;
    if (retryTimer) clearTimeout(retryTimer);
    if (currentUnsub) currentUnsub();
  };
}
