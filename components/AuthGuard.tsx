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
    // Wait until auth state is fully resolved before acting
    if (loading) return;

    if (!user) {
      router.replace('/login');
      return;
    }

    // For admin-only pages: wait for profile to load before checking role
    if (requireAdmin && !profileLoading && !isAdmin) {
      router.replace('/dashboard');
    }
  }, [user, isAdmin, loading, profileLoading, requireAdmin, router]);

  // 1. Auth session still resolving
  if (loading) return <LoadingSpinner text="Authenticating..." />;

  // 2. Not signed in — redirect will fire via useEffect above
  if (!user) return null;

  // 3. For admin pages: wait for profile so we know the role
  if (requireAdmin && profileLoading) return <LoadingSpinner text="Verifying access..." />;

  // 4. Profile loaded but not an admin
  if (requireAdmin && !isAdmin) return <LoadingSpinner text="Access denied..." />;

  // 5. For regular protected pages: also wait for profile to fully load
  //    This prevents children from seeing profile=null while it&apos;s still fetching
  if (!requireAdmin && profileLoading) return <LoadingSpinner text="Loading your profile..." />;

  return <>{children}</>;
}
