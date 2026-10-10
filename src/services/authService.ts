import { supabase, isSupabaseConfigured, DatabaseProfile } from './supabaseClient';

export interface AuthUser {
  id: string;
  email?: string;
  isGuest: boolean;
  profile?: DatabaseProfile;
}

export const GUEST_USER: AuthUser = {
  id: 'guest-local-user',
  email: undefined,
  isGuest: true,
  profile: {
    id: 'guest-local-user',
    username: 'explorador.aura',
    display_name: 'Explorador Convidado',
    role: 'student',
    current_grade_level: 1,
    total_xp: 0,
    aura_level: 1,
    current_streak_days: 0,
    highest_blitz_score: 0,
    elo: 1200,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
};

export class AuthService {
  /**
   * Realiza cadastro com Email e Senha.
   */
  public async signUp(
    email: string,
    password: string,
    displayName: string,
    username?: string
  ): Promise<{ error: Error | null; user: AuthUser | null }> {
    if (!isSupabaseConfigured || !supabase) {
      return {
        error: new Error('Supabase não configurado. Operando em modo offline.'),
        user: null,
      };
    }

    const uname = username || `aura_${Math.random().toString(36).substring(2, 8)}`;

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          display_name: displayName,
          username: uname,
          role: 'student',
        },
      },
    });

    if (error) {
      return { error, user: null };
    }

    if (!data.user) {
      return { error: new Error('Não foi possível criar o usuário.'), user: null };
    }

    const profile = await this.fetchUserProfile(data.user.id);
    return {
      error: null,
      user: {
        id: data.user.id,
        email: data.user.email,
        isGuest: false,
        profile: profile || undefined,
      },
    };
  }

  /**
   * Realiza login com Email e Senha.
   */
  public async signInWithPassword(
    email: string,
    password: string
  ): Promise<{ error: Error | null; user: AuthUser | null }> {
    if (!isSupabaseConfigured || !supabase) {
      return {
        error: new Error('Supabase não configurado. Operando em modo offline.'),
        user: null,
      };
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return { error, user: null };
    }

    if (!data.user) {
      return { error: new Error('Falha na autenticação.'), user: null };
    }

    const profile = await this.fetchUserProfile(data.user.id);
    return {
      error: null,
      user: {
        id: data.user.id,
        email: data.user.email,
        isGuest: false,
        profile: profile || undefined,
      },
    };
  }

  /**
   * Envia Magic Link sem senha para o email.
   */
  public async signInWithMagicLink(
    email: string
  ): Promise<{ error: Error | null }> {
    if (!isSupabaseConfigured || !supabase) {
      return {
        error: new Error('Supabase não configurado. Operando em modo offline.'),
      };
    }

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: typeof window !== 'undefined' ? window.location.origin : undefined,
      },
    });

    return { error };
  }

  /**
   * Inicia fluxo de autenticação via Google OAuth.
   */
  public async signInWithGoogle(): Promise<{ error: Error | null }> {
    if (!isSupabaseConfigured || !supabase) {
      return {
        error: new Error('Supabase não configurado. Operando em modo offline.'),
      };
    }

    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: typeof window !== 'undefined' ? window.location.origin : undefined,
      },
    });

    return { error };
  }

  /**
   * Encerra a sessão do usuário.
   */
  public async signOut(): Promise<{ error: Error | null }> {
    if (!isSupabaseConfigured || !supabase) {
      return { error: null };
    }

    const { error } = await supabase.auth.signOut();
    return { error };
  }

  /**
   * Busca o perfil do usuário na tabela `profiles`.
   */
  public async fetchUserProfile(userId: string): Promise<DatabaseProfile | null> {
    if (!isSupabaseConfigured || !supabase) {
      return null;
    }

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error || !data) {
        return null;
      }

      return data as DatabaseProfile;
    } catch {
      return null;
    }
  }

  /**
   * Atualiza campos parciais do perfil no Supabase.
   */
  public async updateUserProfile(
    userId: string,
    updates: Partial<DatabaseProfile>
  ): Promise<DatabaseProfile | null> {
    if (!isSupabaseConfigured || !supabase) {
      return null;
    }

    try {
      const { data, error } = await supabase
        .from('profiles')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', userId)
        .select()
        .single();

      if (error || !data) {
        return null;
      }

      return data as DatabaseProfile;
    } catch {
      return null;
    }
  }
}

export const authService = new AuthService();
