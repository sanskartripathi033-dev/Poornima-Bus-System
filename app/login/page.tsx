'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Bus, Eye, EyeOff, Mail, Lock, User, Hash, Route, AlertCircle } from 'lucide-react';
import { signInWithEmail, signInWithGoogle, registerWithEmail } from '@/lib/auth';

type Tab = 'signin' | 'register';

export default function LoginPage() {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [studentId, setStudentId] = useState('');
  const [routeId, setRouteId] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (tab === 'signin') {
        await signInWithEmail(email, password);
      } else {
        await registerWithEmail(email, password, name, studentId, routeId);
      }
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Authentication failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setError('');
    setLoading(true);
    try {
      await signInWithGoogle();
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Google sign-in failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-white">
      {/* Left panel - Branding */}
      <div className="hidden lg:flex flex-1 relative overflow-hidden bg-gradient-to-br from-[#004892] to-[#002D52]">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_70%_at_50%_50%,rgba(250,190,21,0.1),transparent)]" />
        <div className="relative flex flex-col items-center justify-center w-full px-12 text-center z-10">
          <div className="w-24 h-24 rounded-3xl bg-white flex items-center justify-center mb-8 shadow-2xl shadow-[#002D52]/50">
            <Bus className="w-12 h-12 text-[#004892]" />
          </div>
          <h2 className="text-4xl font-black text-white mb-4">PU-BusLink</h2>
          <p className="text-[#FABE15] text-lg font-bold mb-4">Poornima University</p>
          <p className="text-[#E9F2FF] opacity-90 max-w-xs leading-relaxed">
            Your smart, secure university bus management platform — tracking, passes, and alerts all in one.
          </p>
          <div className="mt-12 grid grid-cols-2 gap-4 w-full max-w-xs">
            {[
              { label: 'Active Routes', value: '12+' },
              { label: 'Daily Students', value: '1200+' },
              { label: 'Buses Tracked', value: '8' },
              { label: 'Uptime', value: '99.9%' },
            ].map((stat) => (
              <div key={stat.label} className="bg-white/10 rounded-xl p-4 text-center border border-white/20 backdrop-blur-sm">
                <p className="text-2xl font-black text-white">{stat.value}</p>
                <p className="text-[#E9F2FF] opacity-80 text-xs">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel - Form */}
      <div className="flex-1 flex items-center justify-center px-4 py-12 bg-[#FAFAFA]">
        <div className="w-full max-w-md">
          {/* Logo (mobile) */}
          <div className="flex items-center gap-3 mb-8 lg:hidden">
            <div className="w-10 h-10 rounded-xl bg-[#004892] flex items-center justify-center">
              <Bus className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-[#004892] font-bold">PU-BusLink</p>
              <p className="text-slate-500 text-xs">Poornima University</p>
            </div>
          </div>

          <h1 className="text-3xl font-black text-slate-900 mb-2">
            {tab === 'signin' ? 'Welcome back' : 'Create account'}
          </h1>
          <p className="text-slate-500 mb-8 text-sm">
            {tab === 'signin'
              ? 'Sign in with your Poornima University email'
              : 'Register with your PU email to get started'}
          </p>

          {/* Tabs */}
          <div className="flex rounded-xl bg-gray-200/50 p-1 mb-6 border border-gray-200">
            {(['signin', 'register'] as Tab[]).map((t) => (
              <button
                key={t}
                onClick={() => { setTab(t); setError(''); }}
                className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all ${
                  tab === t 
                    ? 'bg-white text-[#004892] shadow-sm border border-gray-200' 
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                {t === 'signin' ? 'Sign In' : 'Register'}
              </button>
            ))}
          </div>

          {/* Error */}
          {error && (
            <div className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
              <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-red-700 text-sm font-medium">{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {tab === 'register' && (
              <>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="pu-input pl-10"
                  />
                </div>
                <div className="relative">
                  <Hash className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Student ID (e.g. 2022BTECH1234)"
                    value={studentId}
                    onChange={(e) => setStudentId(e.target.value)}
                    required
                    className="pu-input pl-10"
                  />
                </div>
                <div className="relative">
                  <Route className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Route ID (ask your incharge)"
                    value={routeId}
                    onChange={(e) => setRouteId(e.target.value)}
                    className="pu-input pl-10"
                  />
                </div>
              </>
            )}

            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="email"
                placeholder="PU Email (e.g. name@poornima.org)"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="pu-input pl-10"
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type={showPass ? 'text' : 'password'}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="pu-input pl-10 pr-12"
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
              >
                {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-navy justify-center py-3.5 text-base shadow-md mt-2"
            >
              {loading ? 'Please wait...' : tab === 'signin' ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-slate-400 text-xs font-medium uppercase">or continue with</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          {/* Google Sign In */}
          <button
            onClick={handleGoogle}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 py-3.5 bg-white border border-gray-300 hover:bg-gray-50 rounded-xl text-slate-700 font-semibold transition-all shadow-sm"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Sign in with Google
          </button>

          <p className="text-center text-slate-500 text-xs mt-6">
            Only <span className="font-bold text-[#004892]">@poornima.org</span> and{' '}
            <span className="font-bold text-[#004892]">@poornima.edu.in</span> emails are accepted.
          </p>
        </div>
      </div>
    </div>
  );
}
