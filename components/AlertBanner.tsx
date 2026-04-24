'use client';

import { useEffect, useState } from 'react';
import { X, AlertTriangle, Info, XCircle, Siren } from 'lucide-react';
import { BusAlert } from '@/lib/types';
import { subscribeAlerts } from '@/lib/firestore';

const alertConfig = {
  delay: { icon: AlertTriangle, bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-700', label: 'Delay' },
  cancelled: { icon: XCircle, bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-700', label: 'Cancelled' },
  info: { icon: Info, bg: 'bg-[#E9F2FF]', border: 'border-[#004892]/20', text: 'text-[#004892]', label: 'Info' },
  emergency: { icon: Siren, bg: 'bg-red-100', border: 'border-red-300', text: 'text-red-800', label: 'Emergency' },
};

export default function AlertBanner() {
  const [alerts, setAlerts] = useState<BusAlert[]>([]);
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());

  useEffect(() => {
    const unsub = subscribeAlerts(setAlerts);
    return () => unsub();
  }, []);

  const visible = alerts.filter((a) => !dismissed.has(a.id));
  if (visible.length === 0) return null;

  return (
    <div className="space-y-2 mb-4">
      {visible.map((alert) => {
        const cfg = alertConfig[alert.type] || alertConfig.info;
        const Icon = cfg.icon;
        return (
          <div
            key={alert.id}
            className={`flex items-start gap-3 px-4 py-3 rounded-xl border shadow-sm ${cfg.bg} ${cfg.border} animate-fade-in`}
          >
            <Icon className={`w-4 h-4 mt-0.5 flex-shrink-0 ${cfg.text}`} />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <span className={`text-[10px] font-black uppercase tracking-wider ${cfg.text}`}>{cfg.label}</span>
                {alert.routeName && (
                  <span className="text-[10px] font-bold text-slate-500">· {alert.routeName}</span>
                )}
                {alert.busNumber && (
                  <span className="text-[10px] font-bold text-slate-500">Bus #{alert.busNumber}</span>
                )}
              </div>
              <p className="text-sm font-medium text-slate-800">{alert.message}</p>
            </div>
            <button
              onClick={() => setDismissed((prev) => new Set(prev).add(alert.id))}
              className="flex-shrink-0 text-slate-400 hover:text-slate-600 transition-colors"
              aria-label="Dismiss alert"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
