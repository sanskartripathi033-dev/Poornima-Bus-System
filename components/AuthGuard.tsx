'use client';

import { useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import LoadingSpinner from './LoadingSpinner';

interface AuthGuardProps {
  children: ReactNode;
  requireAdmin?: boolean;
}

export default function AuthGuard({ children, requireAdmin = false }: AuthGuardProps) {
  const { user, isAdmin, loading, profileLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.replace('/login');
      } else if (requireAdmin && !profileLoading && !isAdmin) {
        router.replace('/dashboard');
      }
    }
  }, [user, isAdmin, loading, profileLoading, requireAdmin, router]);

  if (loading) return <LoadingSpinner text="Authenticating..." />;
  if (!loading && !user) return null; // useEffect will redirect
  if (requireAdmin && profileLoading) return <LoadingSpinner text="Verifying Access..." />;
  if (requireAdmin && !isAdmin) return <LoadingSpinner text="Access Denied..." />;

  return <>{children}</>;
}
