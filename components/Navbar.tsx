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
  const [menuOpen, setMenuOpen] = useState(false);

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
              <>
                <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100 border border-slate-200">
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
                  className="hidden md:flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-red-500 hover:text-red-700 hover:bg-red-50 transition-all"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
                <button
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="md:hidden p-2 rounded-lg text-slate-600 hover:text-[#004892] hover:bg-slate-100 transition-all"
                >
                  {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className="px-4 py-2 rounded-lg bg-[#004892] hover:bg-[#003670] text-white text-sm font-semibold transition-all"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && user && (
        <div className="md:hidden border-t border-gray-200 bg-white px-4 py-3 space-y-1 shadow-lg">
          {visibleLinks.map(({ href, label, icon: Icon }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
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
          <div className="pt-2 border-t border-gray-100 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-slate-500" />
              <span className="text-sm text-slate-700">{profile?.name || 'Student'}</span>
              {isAdmin && (
                <span className="text-[10px] bg-amber-100 text-amber-700 border border-amber-200 rounded px-1.5 py-0.5 font-semibold">
                  ADMIN
                </span>
              )}
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-sm font-semibold text-red-600 hover:text-red-800 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
