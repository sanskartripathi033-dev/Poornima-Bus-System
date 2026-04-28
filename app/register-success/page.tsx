'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle, ArrowRight, User as UserIcon, Mail, Hash, Route, Loader2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import AuthGuard from '@/components/AuthGuard';

function RegisterSuccessContent() {
  const { profile, loading } = useAuth();
  const router = useRouter();
  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    if (countdown <= 0) {
      router.push('/dashboard');
      return;
    }

    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [countdown, router]);

  if (loading || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAFAFA]">
        <div className="text-center">
          <Loader2 className="w-10 h-10 text-[#004892] animate-spin mx-auto mb-4" />
          <p className="text-slate-500 font-medium">Preparing your account...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FAFAFA] p-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 animate-slide-up">
        {/* Header Banner */}
        <div className="bg-gradient-to-br from-[#004892] to-[#002D52] p-8 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_70%_at_50%_0%,rgba(250,190,21,0.2),transparent)]" />
          
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 relative z-10 shadow-lg animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <CheckCircle className="w-12 h-12 text-green-500" />
            <div className="absolute inset-0 rounded-full border-4 border-green-500 animate-ping opacity-20" />
          </div>
          
          <h1 className="text-2xl font-black text-white relative z-10">Registration Successful!</h1>
          <p className="text-[#E9F2FF] opacity-90 mt-2 text-sm relative z-10">
            Welcome to PU-BusLink, your smart travel companion.
          </p>
        </div>

        {/* Profile Details */}
        <div className="p-6 sm:p-8 space-y-6">
          <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100 space-y-4 shadow-inner">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0 text-[#004892]">
                <UserIcon className="w-5 h-5" />
              </div>
              <div className="truncate">
                <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Name</p>
                <p className="text-slate-900 font-bold truncate">{profile.name}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0 text-[#004892]">
                <Mail className="w-5 h-5" />
              </div>
              <div className="truncate">
                <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Email</p>
                <p className="text-slate-900 font-bold truncate">{profile.email}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center flex-shrink-0 text-orange-600">
                  <Hash className="w-5 h-5" />
                </div>
                <div className="truncate">
                  <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Student ID</p>
                  <p className="text-slate-900 font-bold truncate">{profile.studentId || 'N/A'}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center flex-shrink-0 text-purple-600">
                  <Route className="w-5 h-5" />
                </div>
                <div className="truncate">
                  <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Route ID</p>
                  <p className="text-slate-900 font-bold truncate">{profile.routeId || 'Unassigned'}</p>
                </div>
              </div>
            </div>
            
            <div className="pt-2 border-t border-gray-200 mt-2 flex justify-between items-center">
               <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Account Role</p>
               <span className={`px-2.5 py-1 rounded-lg text-xs font-bold border ${
                  profile.role === 'admin' 
                    ? 'bg-amber-100 text-amber-700 border-amber-200' 
                    : 'bg-green-100 text-green-700 border-green-200'
               }`}>
                 {profile.role.toUpperCase()}
               </span>
            </div>
          </div>

          <button
            onClick={() => router.push('/dashboard')}
            className="w-full btn-navy justify-center py-4 text-base shadow-md group"
          >
            Go to Dashboard
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
          
          <p className="text-center text-xs font-medium text-slate-400">
            Auto-redirecting in {countdown} seconds...
          </p>
        </div>
      </div>
    </div>
  );
}

export default function RegisterSuccessPage() {
  return (
    <AuthGuard>
      <RegisterSuccessContent />
    </AuthGuard>
  );
}
