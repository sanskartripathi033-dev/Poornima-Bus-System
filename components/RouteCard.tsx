'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp, Clock, Bus, MapPin, Circle, CheckCircle2 } from 'lucide-react';
import { BusRoute } from '@/lib/types';

interface RouteCardProps {
  route: BusRoute;
  userRoute?: boolean;
}

export default function RouteCard({ route, userRoute = false }: RouteCardProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
        userRoute
          ? 'border-[#004892]/40 bg-[#E9F2FF] shadow-md shadow-[#004892]/5'
          : 'border-gray-200 bg-white hover:border-[#004892]/30 hover:shadow-md shadow-sm'
      }`}
    >
      {/* Card Header */}
      <div
        className="flex items-center justify-between p-4 cursor-pointer select-none"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-3">
          <div
            className={`w-11 h-11 rounded-xl flex items-center justify-center shadow-sm ${
              route.active ? 'bg-white border border-[#004892]/20' : 'bg-gray-100 border border-gray-200'
            }`}
          >
            <Bus className={`w-5 h-5 ${route.active ? 'text-[#004892]' : 'text-slate-400'}`} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-slate-900 font-bold text-sm">{route.name}</h3>
              {userRoute && (
                <span className="text-[10px] bg-[#004892]/10 text-[#004892] border border-[#004892]/20 rounded-full px-2.5 py-0.5 font-bold tracking-wide">
                  YOUR ROUTE
                </span>
              )}
              {!route.active && (
                <span className="text-[10px] bg-red-50 text-red-600 border border-red-200 rounded-full px-2.5 py-0.5 font-bold">
                  INACTIVE
                </span>
              )}
            </div>
            <p className="text-slate-500 text-xs font-medium mt-0.5">Bus #{route.busNumber} · {route.stops.length} stops</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex flex-col items-end">
            <div className="flex items-center gap-1 text-xs text-slate-700 font-bold">
              <Clock className="w-3.5 h-3.5 text-[#FABE15]" />
              <span>{route.departureTime}</span>
            </div>
            <div className="text-[10px] text-slate-500 font-medium">Return: {route.returnTime}</div>
          </div>
          {expanded ? (
            <ChevronUp className="w-5 h-5 text-slate-400" />
          ) : (
            <ChevronDown className="w-5 h-5 text-slate-400" />
          )}
        </div>
      </div>

      {/* Expandable Stop List */}
      {expanded && (
        <div className="px-4 pb-4 border-t border-gray-100 bg-[#FAFAFA]">
          <div className="mt-3 relative">
            {/* Vertical line */}
            <div className="absolute left-[18px] top-4 bottom-4 w-0.5 bg-gradient-to-b from-[#004892]/40 to-transparent" />

            <div className="space-y-1 relative z-10">
              {route.stops
                .slice()
                .sort((a, b) => a.order - b.order)
                .map((stop, idx) => (
                  <div key={stop.id} className="flex items-center gap-3 py-2 pl-1 bg-[#FAFAFA]">
                    <div className="relative z-10 flex-shrink-0 bg-[#FAFAFA] p-1">
                      {idx === 0 ? (
                        <CheckCircle2 className="w-5 h-5 text-[#004892]" />
                      ) : idx === route.stops.length - 1 ? (
                        <MapPin className="w-5 h-5 text-[#FABE15]" />
                      ) : (
                        <Circle className="w-5 h-5 text-slate-300" />
                      )}
                    </div>
                    <div className="flex-1 flex items-center justify-between min-w-0">
                      <span className={`text-sm truncate ${idx === 0 ? 'text-[#004892] font-black' : idx === route.stops.length - 1 ? 'text-slate-800 font-bold' : 'text-slate-600 font-medium'}`}>
                        {stop.name}
                      </span>
                      <span className="text-xs text-slate-500 font-bold ml-2 flex-shrink-0 border border-gray-200 bg-white rounded-md px-2 py-0.5 shadow-sm">{stop.time}</span>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
