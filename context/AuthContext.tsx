'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User } from 'firebase/auth';
import { onAuthChange, subscribeUserProfile } from '@/lib/auth';
import { PUUser } from '@/lib/types';

interface AuthContextType {
  user: User | null;
  profile: PUUser | null;
  loading: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  loading: true,
  isAdmin: false,
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<PUUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let profileUnsub: (() => void) | undefined;
    const authUnsub = onAuthChange((firebaseUser: User | null) => {
      setUser(firebaseUser);
      if (profileUnsub) {
        profileUnsub();
        profileUnsub = undefined;
      }
      if (firebaseUser) {
        // Safety timeout increased to 15 seconds for slow rural connections
        const timeout = setTimeout(() => {
          console.warn("Profile fetch timeout reached (15s)");
          setLoading(false);
        }, 15000);

        profileUnsub = subscribeUserProfile(firebaseUser.uid, (p: PUUser | null) => {
          clearTimeout(timeout);
          setProfile(p);
          setLoading(false);
        });
      } else {
        setProfile(null);
        setLoading(false);
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
