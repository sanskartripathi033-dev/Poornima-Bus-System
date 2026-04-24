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
  const { user, isAdmin, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.replace('/login');
      } else if (requireAdmin && !isAdmin) {
        router.replace('/dashboard');
      }
    }
  }, [user, isAdmin, loading, requireAdmin, router]);

  if (loading) return <LoadingSpinner text="Authenticating..." />;
  if (!user) return <LoadingSpinner text="Redirecting..." />;
  if (requireAdmin && !isAdmin) return <LoadingSpinner text="Access Denied..." />;

  return <>{children}</>;
}
