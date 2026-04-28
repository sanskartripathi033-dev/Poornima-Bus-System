'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User } from 'firebase/auth';
import { onAuthChange, subscribeUserProfile } from '@/lib/auth';
import { PUUser } from '@/lib/types';

interface AuthContextType {
  user: User | null;
  profile: PUUser | null;
  loading: boolean;        // true only while Firebase resolves the persisted auth session
  profileLoading: boolean; // true while the Firestore user profile is being fetched
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  loading: true,
  profileLoading: true,
  isAdmin: false,
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<PUUser | null>(null);
  const [loading, setLoading] = useState(true);          // auth state
  const [profileLoading, setProfileLoading] = useState(true); // profile fetch

  useEffect(() => {
    let profileUnsub: (() => void) | undefined;

    const authUnsub = onAuthChange((firebaseUser: User | null) => {
      setUser(firebaseUser);
      setLoading(false); // ✅ Auth state is now known — stop blocking the guard

      if (profileUnsub) {
        profileUnsub();
        profileUnsub = undefined;
      }

      if (firebaseUser) {
        setProfileLoading(true);
        profileUnsub = subscribeUserProfile(firebaseUser.uid, (p: PUUser | null) => {
          setProfile(p);
          setProfileLoading(false);
        });
      } else {
        setProfile(null);
        setProfileLoading(false);
      }
    });

    return () => {
      authUnsub();
      if (profileUnsub) profileUnsub();
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        profileLoading,
        isAdmin: profile?.role === 'admin',
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
