'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { Bus, MapPin, Route, LayoutDashboard, Shield, Menu, X, LogOut, User } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { logOut } from '@/lib/auth';

const navLinks = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, auth: true, adminOnly: false },
  { href: '/tracking', label: 'Live Tracking', icon: MapPin, auth: true, adminOnly: false },
  { href: '/routes', label: 'Routes', icon: Route, auth: true, adminOnly: false },
  { href: '/admin', label: 'Admin', icon: Shield, auth: true, adminOnly: true },
];

export default function Navbar() {
  const { user, profile, isAdmin } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false); // Used for profile dropdown on mobile

  const handleLogout = async () => {
    await logOut();
    router.push('/login');
  };

  const visibleLinks = navLinks.filter((l) => {
    if (!l.auth || !user) return false;
    if (l.adminOnly && !isAdmin) return false;
    return true;
  });

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href={user ? '/dashboard' : '/'} className="flex items-center gap-2 sm:gap-3 group flex-shrink-0">
            <div className="w-9 h-9 rounded-lg bg-[#004892] flex items-center justify-center shadow-md group-hover:scale-105 transition-transform flex-shrink-0">
              <Bus className="w-5 h-5 text-white" />
            </div>
            <div className="flex-shrink-0">
              <span className="font-bold text-[#004892] text-sm sm:text-base leading-none block">PU-BusLink</span>
              <p className="text-[10px] text-slate-500 leading-none mt-0.5 hidden sm:block">Poornima University</p>
            </div>
          </Link>

          {/* Desktop Nav */}
          {user && (
            <div className="hidden md:flex items-center gap-1">
              {visibleLinks.map(({ href, label, icon: Icon }) => {
                const active = pathname === href;
                return (
                  <Link
                    key={href}
                    href={href}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      active
                        ? 'bg-blue-50 text-[#004892] border border-blue-100'
                        : 'text-slate-600 hover:text-[#004892] hover:bg-slate-50'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {label}
                  </Link>
                );
              })}
            </div>
          )}

          {/* Right side */}
          <div className="flex items-center gap-3">
            {user ? (
              <div className="relative">
                {/* Desktop Profile Info & Logout */}
                <div className="hidden md:flex items-center gap-3">
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100 border border-slate-200">
                    <User className="w-4 h-4 text-slate-500" />
                    <span className="text-sm text-slate-700 max-w-[140px] truncate">
                      {profile?.name || user.displayName || 'Student'}
                    </span>
                    {isAdmin && (
                      <span className="text-[10px] bg-amber-100 text-amber-700 border border-amber-200 rounded px-1.5 py-0.5 font-semibold">
                        ADMIN
                      </span>
                    )}
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-red-500 hover:text-red-700 hover:bg-red-50 transition-all font-semibold"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </div>

                {/* Mobile Profile Trigger */}
                <button
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="md:hidden w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center border border-slate-200 active:scale-95 transition-transform"
                >
                  <User className="w-5 h-5 text-slate-600" />
                </button>

                {/* Mobile Profile Dropdown */}
                {menuOpen && (
                  <>
                    <div className="fixed inset-0 z-40 md:hidden" onClick={() => setMenuOpen(false)} />
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 z-50 md:hidden overflow-hidden animate-fade-in">
                      <div className="p-4 bg-slate-50 border-b border-gray-100">
                        <p className="font-bold text-slate-900 truncate">{profile?.name || 'Student'}</p>
                        <p className="text-xs text-slate-500 truncate mt-0.5">{profile?.email || user.email}</p>
                        {isAdmin && (
                          <span className="inline-block mt-2 text-[10px] bg-amber-100 text-amber-700 border border-amber-200 rounded px-1.5 py-0.5 font-bold tracking-wider">
                            ADMIN
                          </span>
                        )}
                      </div>
                      <div className="p-2">
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <LogOut className="w-4 h-4" />
                          Log Out
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <Link
                href="/login"
                className="px-5 py-2.5 rounded-xl bg-[#004892] hover:bg-[#003670] text-white text-sm font-bold transition-all shadow-md active:scale-95"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* --- Mobile Bottom Navigation Bar --- */}
      {user && (
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 pb-safe z-50 shadow-[0_-4px_12px_rgba(0,0,0,0.03)]">
          <div className="flex justify-around items-center h-16 px-2">
            {visibleLinks.map(({ href, label, icon: Icon }) => {
              const active = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-all active:scale-95 ${
                    active ? 'text-[#004892]' : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  <div className={`p-1.5 rounded-xl transition-colors ${active ? 'bg-blue-50' : 'bg-transparent'}`}>
                    <Icon className="w-5 h-5 sm:w-6 sm:h-6" strokeWidth={active ? 2.5 : 2} />
                  </div>
                  <span className={`text-[9px] sm:text-[10px] font-bold ${active ? 'text-[#004892]' : 'text-slate-500'}`}>
                    {label}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </nav>
  );
}
