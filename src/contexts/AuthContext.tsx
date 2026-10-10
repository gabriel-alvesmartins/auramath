import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase, isSupabaseConfigured, DatabaseProfile } from '../services/supabaseClient';
import { authService, AuthUser, GUEST_USER } from '../services/authService';
import { cloudSync } from '../services/cloudSync';

interface AuthContextValue {
  user: AuthUser;
  isLoading: boolean;
  isAuthModalOpen: boolean;
  openAuthModal: () => void;
  closeAuthModal: () => void;
  signInWithPassword: (email: string, pass: string) => Promise<{ error: Error | null }>;
  signUp: (email: string, pass: string, displayName: string, username?: string) => Promise<{ error: Error | null }>;
  signInWithMagicLink: (email: string) => Promise<{ error: Error | null }>;
  signInWithGoogle: () => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser>(GUEST_USER);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);

  const refreshProfile = async () => {
    if (user.isGuest || !user.id) return;
    const profile = await authService.fetchUserProfile(user.id);
    if (profile) {
      setUser((prev) => ({ ...prev, profile }));
    }
  };

  useEffect(() => {
    let isMounted = true;

    async function initAuth() {
      if (!isSupabaseConfigured || !supabase) {
        setIsLoading(false);
        return;
      }

      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user && isMounted) {
          const profile = await authService.fetchUserProfile(session.user.id);
          setUser({
            id: session.user.id,
            email: session.user.email,
            isGuest: false,
            profile: profile || undefined,
          });
          cloudSync.setAuthenticatedUser(session.user.id);
          cloudSync.migrateGuestDataToCloud(session.user.id);
        }
      } catch (err) {
        console.warn('Erro ao inicializar sessão auth', err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    initAuth();

    if (isSupabaseConfigured && supabase) {
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        async (event, session) => {
          if (!isMounted) return;

          if (session?.user) {
            const profile = await authService.fetchUserProfile(session.user.id);
            setUser({
              id: session.user.id,
              email: session.user.email,
              isGuest: false,
              profile: profile || undefined,
            });
            cloudSync.setAuthenticatedUser(session.user.id);
            cloudSync.migrateGuestDataToCloud(session.user.id);
          } else {
            setUser(GUEST_USER);
            cloudSync.setAuthenticatedUser(null);
          }
        }
      );

      return () => {
        isMounted = false;
        subscription.unsubscribe();
      };
    }

    return () => {
      isMounted = false;
    };
  }, []);

  const openAuthModal = () => setIsAuthModalOpen(true);
  const closeAuthModal = () => setIsAuthModalOpen(false);

  const handleSignInWithPassword = async (email: string, pass: string) => {
    const res = await authService.signInWithPassword(email, pass);
    if (res.user) {
      setUser(res.user);
      cloudSync.setAuthenticatedUser(res.user.id);
      cloudSync.migrateGuestDataToCloud(res.user.id);
      closeAuthModal();
    }
    return { error: res.error };
  };

  const handleSignUp = async (email: string, pass: string, displayName: string, username?: string) => {
    const res = await authService.signUp(email, pass, displayName, username);
    if (res.user) {
      setUser(res.user);
      cloudSync.setAuthenticatedUser(res.user.id);
      cloudSync.migrateGuestDataToCloud(res.user.id);
      closeAuthModal();
    }
    return { error: res.error };
  };

  const handleSignInWithMagicLink = async (email: string) => {
    return await authService.signInWithMagicLink(email);
  };

  const handleSignInWithGoogle = async () => {
    return await authService.signInWithGoogle();
  };

  const handleSignOut = async () => {
    await authService.signOut();
    cloudSync.setAuthenticatedUser(null);
    setUser(GUEST_USER);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthModalOpen,
        openAuthModal,
        closeAuthModal,
        signInWithPassword: handleSignInWithPassword,
        signUp: handleSignUp,
        signInWithMagicLink: handleSignInWithMagicLink,
        signInWithGoogle: handleSignInWithGoogle,
        signOut: handleSignOut,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
}
