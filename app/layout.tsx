import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';
import ErrorBoundary from '@/components/ErrorBoundary';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

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
    <html lang="en" className={inter.variable}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800;900&family=Playfair+Display:wght@600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body className="bg-[#FAFAFA] text-[#333333] antialiased">
        <ErrorBoundary>
          <AuthProvider>
            <Navbar />
            <main className="pt-16">{children}</main>
          </AuthProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
