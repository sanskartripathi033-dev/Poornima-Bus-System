import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';
import ErrorBoundary from '@/components/ErrorBoundary';
import { Viewport } from 'next';

export const metadata: Metadata = {
  title: 'PU-BusLink — Poornima University Smart Bus System',
  description:
    'Live bus tracking, digital pass, and route management for Poornima University, Jaipur. Secure, real-time, mobile-friendly.',
  keywords: ['Poornima University', 'bus tracking', 'digital pass', 'PU BusLink', 'Jaipur'],
  authors: [{ name: 'Poornima University IT Department' }],
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#004892',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-[#FAFAFA] text-[#333333] antialiased">
        <ErrorBoundary>
          <AuthProvider>
            <Navbar />
            <main className="pt-16 pb-20 md:pb-0">{children}</main>
          </AuthProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
