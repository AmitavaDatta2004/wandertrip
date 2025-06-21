
import React, { createContext, useState, useContext, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Session, User } from '@supabase/supabase-js';

type UserWithMetadata = User & {
  user_metadata: {
    name?: string;
  }
};

type AuthContextType = {
  user: UserWithMetadata | null;
  session: Session | null;
  loading: boolean;
  error: string | null;
  clearError: () => void;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, metadata?: { name?: string }) => Promise<void>;
  signOut: () => Promise<void>;
  getUserName: () => string;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserWithMetadata | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setUser(session?.user as UserWithMetadata || null);
        setLoading(false);
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user as UserWithMetadata || null);
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const clearError = () => {
    setError(null);
  };

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      clearError();
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        setError(error.message);
        return;
      }
      
      if (data && data.user) {
        setUser(data.user as UserWithMetadata);
        setSession(data.session);
      }
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, metadata: { name?: string } = {}) => {
    try {
      setLoading(true);
      clearError();
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata // Store name in user_metadata
        }
      });
      
      if (error) {
        setError(error.message);
        return;
      }
      
      if (data && data.user) {
        setUser(data.user as UserWithMetadata);
        setSession(data.session);
      }
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      clearError();
      
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        setError(error.message);
        return;
      }
      
      setUser(null);
      setSession(null);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const getUserName = () => {
    if (!user) return "";
    return user.user_metadata?.name || user.email?.split('@')[0] || "User";
  };

  const value: AuthContextType = {
    user,
    session,
    loading,
    error,
    clearError,
    signIn,
    signUp,
    signOut,
    getUserName,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
