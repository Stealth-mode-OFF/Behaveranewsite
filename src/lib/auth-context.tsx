import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from './supabase';
import type { User } from '@supabase/supabase-js';

/* ─── Local fallback credentials (used when Supabase is not configured) ─── */
const LOCAL_ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL || 'admin@behavera.com';
const LOCAL_ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || 'admin123';
const LOCAL_SESSION_KEY = 'behavera_admin_session';

type AuthContextType = {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  user: null,
  isLoading: true,
  login: async () => ({ success: false }),
  logout: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const useSupabase = !!supabase;

  useEffect(() => {
    if (!useSupabase) {
      // Local fallback: check sessionStorage
      const stored = sessionStorage.getItem(LOCAL_SESSION_KEY);
      if (stored) {
        try {
          setUser(JSON.parse(stored));
        } catch { /* ignore */ }
      }
      setIsLoading(false);
      return;
    }

    // Supabase auth
    supabase!.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setIsLoading(false);
    });

    const { data: { subscription } } = supabase!.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, [useSupabase]);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    if (!useSupabase) {
      // Local fallback auth
      if (email === LOCAL_ADMIN_EMAIL && password === LOCAL_ADMIN_PASSWORD) {
        const fakeUser = { id: 'local-admin', email, role: 'admin' } as unknown as User;
        setUser(fakeUser);
        sessionStorage.setItem(LOCAL_SESSION_KEY, JSON.stringify(fakeUser));
        return { success: true };
      }
      return { success: false, error: 'Invalid email or password' };
    }

    const { error } = await supabase!.auth.signInWithPassword({ email, password });
    if (error) {
      return { success: false, error: error.message };
    }
    return { success: true };
  };

  const logout = async () => {
    if (!useSupabase) {
      setUser(null);
      sessionStorage.removeItem(LOCAL_SESSION_KEY);
      return;
    }
    await supabase!.auth.signOut();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{
      isAuthenticated: !!user,
      user,
      isLoading,
      login,
      logout,
    }}>
      {children}
    </AuthContext.Provider>
  );
};
