import Link from 'next/link';
import { Bus, Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#060d1b]">
      <div className="text-center px-4">
        <div className="relative inline-block mb-8">
          <div className="text-9xl font-black gradient-text opacity-30 select-none">404</div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center shadow-2xl shadow-blue-900/50 animate-float">
              <Bus className="w-10 h-10 text-white" />
            </div>
          </div>
        </div>
        <h1 className="text-3xl font-black text-white mb-3">Bus Not Found</h1>
        <p className="text-slate-400 mb-8 max-w-sm mx-auto">
          Looks like this page took a wrong turn. Let&apos;s get you back on route.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-2xl transition-all hover:scale-105 shadow-lg shadow-blue-900/40"
        >
          <Home className="w-5 h-5" />
          Back to Home
        </Link>
      </div>
    </div>
  );
}
