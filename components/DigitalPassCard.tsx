'use client';

import { useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import { Shield, Bus, MapPin, Calendar } from 'lucide-react';
import { PUUser } from '@/lib/types';

interface DigitalPassCardProps {
  profile: PUUser;
  routeName?: string;
}

export default function DigitalPassCard({ profile, routeName }: DigitalPassCardProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const qrData = JSON.stringify({
    uid: profile.uid,
    studentId: profile.studentId,
    email: profile.email,
    name: profile.name,
    issuer: 'PU-BusLink',
    issuedAt: new Date().toISOString(),
  });

  useEffect(() => {
    if (canvasRef.current) {
      QRCode.toCanvas(canvasRef.current, qrData, {
        width: 130,
        margin: 1,
        color: {
          dark: '#004892',
          light: '#ffffff',
        },
      });
    }
  }, [qrData]);

  const today = new Date().toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

  const validUntil = new Date();
  validUntil.setMonth(validUntil.getMonth() + 6);
  const validUntilStr = validUntil.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  return (
    <div className="relative w-full max-w-sm mx-auto">
      {/* Subtle Glow behind card */}
      <div className="absolute -inset-2 bg-gradient-to-r from-[#004892]/20 to-[#FABE15]/20 rounded-3xl blur-xl" />

      <div className="relative rounded-2xl overflow-hidden border border-gray-200 shadow-xl bg-white">
        {/* Card Header (Poornima Blue) */}
        <div className="bg-[#004892] px-6 pt-6 pb-4 relative">
          {/* Subtle pattern or gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
          
          <div className="relative flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center shadow-sm">
                <Bus className="w-4 h-4 text-[#004892]" />
              </div>
              <div>
                <p className="text-white font-bold text-xs leading-none">PU-BusLink</p>
                <p className="text-white/70 text-[9px]">Poornima University</p>
              </div>
            </div>
            <div className="flex items-center gap-1.5 bg-green-500/20 border border-green-400/40 rounded-full px-2.5 py-1 backdrop-blur-sm">
              <div className="w-1.5 h-1.5 bg-green-300 rounded-full" />
              <span className="text-green-100 text-[10px] font-bold">ACTIVE</span>
            </div>
          </div>

          <div className="relative">
            <p className="text-[#FABE15] text-[10px] uppercase tracking-widest font-bold mb-0.5">Digital Bus Pass</p>
            <h3 className="text-2xl font-black text-white">{profile.name}</h3>
            <p className="text-blue-100 text-sm">{profile.email}</p>
          </div>
        </div>

        {/* Decorative divider (ticket punch effect) */}
        <div className="relative bg-white h-3">
          <div className="absolute -top-1.5 left-0 right-0 flex justify-between px-5 z-10">
            {Array.from({ length: 28 }).map((_, i) => (
              <div key={i} className="w-2 h-2 bg-gray-100 rounded-full border border-gray-200 shadow-inner" />
            ))}
          </div>
        </div>

        {/* Card Body */}
        <div className="bg-white px-6 pb-6 pt-2">
          <div className="flex gap-4">
            {/* Info */}
            <div className="flex-1 space-y-3">
              <div>
                <p className="text-slate-500 text-[10px] uppercase tracking-wider font-bold">Student ID</p>
                <p className="text-slate-900 font-mono font-bold text-sm">{profile.studentId || 'N/A'}</p>
              </div>
              <div>
                <p className="text-slate-500 text-[10px] uppercase tracking-wider font-bold flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-[#004892]" /> Route
                </p>
                <p className="text-slate-900 font-bold text-sm truncate">{routeName || profile.routeId || 'Not Assigned'}</p>
              </div>
              <div>
                <p className="text-slate-500 text-[10px] uppercase tracking-wider font-bold flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-[#004892]" /> Valid Until
                </p>
                <p className="text-slate-900 font-bold text-sm">{validUntilStr}</p>
              </div>
              <div className="flex items-center gap-1.5 mt-2 bg-[#E9F2FF] border border-[#004892]/20 rounded-md px-2 py-1 w-fit">
                <Shield className="w-3 h-3 text-[#004892]" />
                <span className="text-[#004892] text-[9px] font-bold">Verified PU Student</span>
              </div>
            </div>

            {/* QR Code */}
            <div className="flex flex-col items-center justify-center border-l border-dashed border-gray-200 pl-4 py-2">
              <div className="bg-white p-1.5 rounded-xl border border-gray-200 shadow-sm">
                <canvas ref={canvasRef} className="rounded-lg" />
              </div>
              <p className="text-[#004892] text-[9px] font-bold mt-2">Scan to verify</p>
            </div>
          </div>
        </div>

        {/* Bottom accent */}
        <div className="h-1.5 bg-gradient-to-r from-[#004892] via-blue-500 to-[#FABE15]" />
      </div>
    </div>
  );
}
