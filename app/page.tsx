'use client';

import Link from 'next/link';
import { Bus, MapPin, QrCode, Shield, Download, ChevronRight, CheckCircle, Smartphone, Wifi } from 'lucide-react';

const features = [
  {
    icon: MapPin,
    title: 'Live Bus Tracking',
    desc: 'Track your university bus in real-time on an interactive map. Know exactly when it will arrive.',
    color: 'from-blue-600 to-blue-400',
  },
  {
    icon: QrCode,
    title: 'Digital Bus Pass',
    desc: 'Carry your personalized digital pass with a QR code on your phone. No more paper passes.',
    color: 'from-indigo-600 to-indigo-400',
  },
  {
    icon: Shield,
    title: 'Secure & Verified',
    desc: 'Access restricted to Poornima University email accounts only. Your data is safe with Firestore rules.',
    color: 'from-violet-600 to-violet-400',
  },
  {
    icon: Wifi,
    title: 'Real-Time Updates',
    desc: 'Get instant alerts on bus delays, route changes, and cancellations pushed directly to your screen.',
    color: 'from-cyan-600 to-cyan-400',
  },
];

const steps = [
  { step: '01', title: 'Download or open the web app', desc: 'Access via browser on any device' },
  { step: '02', title: 'Sign in with your PU email', desc: 'Use your @poornima.org or @poornima.edu.in account' },
  { step: '03', title: 'View your Digital Pass', desc: 'Your pass is auto-generated with a QR code' },
  { step: '04', title: 'Track your bus live', desc: 'See your bus on the map in real-time' },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      {/* Hero Section */}
      <section className="relative overflow-hidden min-h-[90vh] flex items-center bg-white">
        {/* Subtle Light Accent Background */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-[600px] h-[600px] bg-[#E9F2FF] rounded-full blur-3xl opacity-60 pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-[400px] h-[400px] bg-[#FABE15]/10 rounded-full blur-3xl opacity-60 pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 flex flex-col lg:flex-row items-center gap-16">
          {/* Left: Text */}
          <div className="flex-1 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 bg-[#E9F2FF] border border-[#004892]/20 rounded-full px-4 py-1.5 mb-6 animate-fade-in">
              <div className="w-1.5 h-1.5 bg-[#004892] rounded-full" />
              <span className="text-[#004892] text-xs font-semibold">Poornima University · Jaipur, Rajasthan</span>
            </div>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black leading-[1.1] mb-6">
              <span className="text-[#004892]">Smart</span>{' '}
              <span className="text-[#FABE15]">Bus System</span>
              <br />
              <span className="text-slate-800 text-3xl sm:text-5xl lg:text-6xl">for PU Students</span>
            </h1>

            <p className="text-slate-600 text-lg sm:text-xl max-w-xl mx-auto lg:mx-0 mb-10 leading-relaxed">
              Track university buses live, carry your digital pass on your phone, and get real-time
              delay alerts — all in one secure platform.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start transform-gpu">
              <Link href="/login" className="btn-gold px-8 py-4 text-base">
                Get Started
                <ChevronRight className="w-5 h-5" />
              </Link>
              <a href="#download" className="btn-navy bg-white text-[#004892] border border-[#004892]/20 hover:bg-[#E9F2FF] shadow-sm px-8 py-4 text-base">
                <Download className="w-5 h-5 text-[#004892]" />
                Download APK
              </a>
            </div>
          </div>

          {/* Right: Modern UI mockup */}
          <div className="flex-1 flex justify-center lg:justify-end">
            <div className="relative w-full max-w-sm">
              {/* Mock phone frame */}
              <div className="relative bg-white shadow-2xl rounded-[2.5rem] p-6 border border-gray-100 ring-4 ring-[#E9F2FF]">
                {/* Header Mock */}
                <div className="flex justify-between items-center mb-4 px-2">
                   <div className="w-20 h-4 bg-gray-200 rounded-full"></div>
                   <div className="w-6 h-6 bg-gray-200 rounded-full"></div>
                </div>

                {/* Mock map */}
                <div className="rounded-2xl overflow-hidden mb-4 h-44 bg-[#F8FAFC] border border-gray-200 relative shadow-inner">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-4xl mb-2 text-slate-300">🗺️</div>
                    </div>
                  </div>
                  {/* fake bus dot */}
                  <div className="absolute top-12 left-20 w-8 h-8 bg-[#004892] rounded-full border-2 border-white flex items-center justify-center shadow-md">
                    <Bus className="w-4 h-4 text-white" />
                  </div>
                </div>

                {/* Mock pass info */}
                <div className="bg-[#FAFAFA] border border-gray-100 rounded-xl p-4 mb-3 shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs text-slate-500 font-medium">Digital Bus Pass</p>
                    <span className="text-[10px] bg-green-100 text-green-700 border border-green-200 rounded-full px-2 py-0.5 font-bold">ACTIVE</span>
                  </div>
                  <p className="text-slate-800 font-bold">Rahul Sharma</p>
                  <p className="text-[#004892] text-xs font-semibold">Bus #PU-07 · City Center</p>
                </div>

                <div className="flex gap-2">
                  <div className="flex-1 bg-white border border-gray-100 shadow-sm rounded-xl p-3 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-[#004892]" />
                    <div>
                      <p className="text-[10px] text-slate-500 font-medium">ETA</p>
                      <p className="text-slate-800 text-xs font-bold">8 min</p>
                    </div>
                  </div>
                  <div className="flex-1 bg-white border border-gray-100 shadow-sm rounded-xl p-3 flex items-center gap-2">
                    <Wifi className="w-4 h-4 text-[#FABE15]" />
                    <div>
                      <p className="text-[10px] text-slate-500 font-medium">Status</p>
                      <p className="text-slate-800 text-xs font-bold">On Time</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 relative bg-[#FAFAFA]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-5xl font-black text-slate-900 mb-4">
              Everything you need,{' '}
              <span className="text-[#004892]">in one app</span>
            </h2>
            <div className="section-divider" />
            <p className="text-slate-600 text-lg max-w-xl mx-auto mt-6">
              Built specifically for Poornima University students and staff with security and simplicity in mind.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md hover:border-[#004892]/20 transition-all group duration-300"
                >
                  <div className="w-12 h-12 rounded-xl bg-[#E9F2FF] flex items-center justify-center mb-4 transition-transform text-[#004892]">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-slate-800 font-bold text-lg mb-2">{feature.title}</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">{feature.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 bg-white border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-5xl font-black text-slate-900 mb-4">
              How it <span className="text-[#FABE15]">works</span>
            </h2>
            <div className="section-divider" />
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((s, i) => (
              <div key={s.step} className="relative">
                {i < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-8 left-[60%] right-0 h-0.5 bg-gray-100" />
                )}
                <div className="bg-[#FAFAFA] rounded-2xl p-6 text-center border border-gray-50 relative z-10 shadow-sm">
                  <div className="text-5xl font-black text-[#004892]/20 mb-4">{s.step}</div>
                  <h3 className="text-slate-800 font-bold mb-2">{s.title}</h3>
                  <p className="text-slate-600 text-sm">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Download Section */}
      <section id="download" className="py-24 bg-[#FAFAFA]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-white rounded-3xl p-12 border border-gray-200 relative overflow-hidden shadow-xl">
            <div className="absolute top-0 left-0 w-32 h-32 bg-[#FABE15]/10 rounded-full blur-2xl" />
            <div className="absolute bottom-0 right-0 w-40 h-40 bg-[#004892]/5 rounded-full blur-2xl" />
            
            <div className="relative">
              <Smartphone className="w-16 h-16 text-[#004892] mx-auto mb-6" />
              <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mb-4">
                Download the App
              </h2>
              <p className="text-slate-600 text-lg mb-8 max-w-lg mx-auto">
                Install the PU-BusLink app on your Android device for the best native experience.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button onClick={() => alert('The Android App is currently in development! Please use the "Use Web Version" button to sign in directly from your browser.')} className="btn-navy px-8 py-4 text-base flex items-center justify-center gap-2">
                  <Download className="w-5 h-5" />
                  Download APK (Android)
                </button>
                <Link href="/login" className="btn-gold bg-white text-[#333333] border border-gray-200 hover:bg-gray-50 px-8 py-4 text-base shadow-sm">
                  Use Web Version
                  <ChevronRight className="w-5 h-5" />
                </Link>
              </div>
              <div className="flex flex-wrap justify-center gap-6 mt-8 text-sm text-slate-500 font-medium">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  Free for all PU students
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  No ads, ever
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  Works offline (basic)
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#004892] flex items-center justify-center">
              <Bus className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-[#004892] font-bold text-sm">PU-BusLink</p>
              <p className="text-slate-500 text-xs">© {new Date().getFullYear()} Poornima University</p>
            </div>
          </div>
          <p className="text-slate-500 text-xs text-center">
            For support, contact the IT Department at{' '}
            <a href="mailto:it@poornima.org" className="text-[#004892] font-semibold hover:underline">
              it@poornima.org
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
