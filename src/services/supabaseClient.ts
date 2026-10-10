import { createClient, SupabaseClient } from '@supabase/supabase-js';

export interface DatabaseProfile {
  id: string;
  username: string;
  display_name: string;
  role: 'student' | 'teacher' | 'admin';
  current_grade_level: number;
  total_xp: number;
  aura_level: number;
  current_streak_days: number;
  highest_blitz_score: number;
  elo: number;
  created_at: string;
  updated_at: string;
}

export interface DatabaseNodeProgress {
  id: string;
  user_id: string;
  node_id: string;
  stars_earned: number;
  best_accuracy: number;
  average_speed_ms: number;
  completed_at: string;
}

export interface DatabaseCognitiveRadar {
  id: string;
  user_id: string;
  speed_score: number;
  fermi_score: number;
  flexibility_score: number;
  stamina_score: number;
  memory_score: number;
  archetype_title: string;
  computed_at: string;
}

export interface DatabaseMatchRecord {
  id: string;
  user_id: string;
  game_mode: string;
  seed: string;
  score: number;
  max_streak: number;
  total_questions: number;
  correct_answers: number;
  average_reaction_ms: number;
  timeline_events: any[];
  technique_breakdown: Record<string, any>;
  flagged_suspicious: boolean;
  created_at: string;
}

export interface DatabaseGhostRun {
  id: string;
  user_id: string;
  game_mode: string;
  elo: number;
  seed: string;
  total_score: number;
  duration_ms: number;
  timeline_events: any[];
  created_at: string;
}

export interface DatabaseUserAchievement {
  id: string;
  user_id: string;
  achievement_id: string;
  unlocked: boolean;
  progress: number;
  unlocked_at: string;
}

export interface DatabaseUserUnlockedBadge {
  id: string;
  user_id: string;
  badge_id: string;
  unlocked_at: string;
}

export interface DatabaseSchema {
  public: {
    Tables: {
      profiles: {
        Row: DatabaseProfile;
        Insert: Partial<DatabaseProfile> & { id: string; username: string; display_name: string };
        Update: Partial<DatabaseProfile>;
      };
      user_node_progress: {
        Row: DatabaseNodeProgress;
        Insert: Omit<DatabaseNodeProgress, 'id'> & { id?: string };
        Update: Partial<DatabaseNodeProgress>;
      };
      cognitive_radars: {
        Row: DatabaseCognitiveRadar;
        Insert: Omit<DatabaseCognitiveRadar, 'id'> & { id?: string };
        Update: Partial<DatabaseCognitiveRadar>;
      };
      match_records: {
        Row: DatabaseMatchRecord;
        Insert: Omit<DatabaseMatchRecord, 'id'> & { id?: string };
        Update: Partial<DatabaseMatchRecord>;
      };
      ghost_runs: {
        Row: DatabaseGhostRun;
        Insert: Omit<DatabaseGhostRun, 'id'> & { id?: string };
        Update: Partial<DatabaseGhostRun>;
      };
      user_achievements: {
        Row: DatabaseUserAchievement;
        Insert: Omit<DatabaseUserAchievement, 'id'> & { id?: string };
        Update: Partial<DatabaseUserAchievement>;
      };
      user_unlocked_badges: {
        Row: DatabaseUserUnlockedBadge;
        Insert: Omit<DatabaseUserUnlockedBadge, 'id'> & { id?: string };
        Update: Partial<DatabaseUserUnlockedBadge>;
      };
    };
  };
}

// Environment variables check
const supabaseUrl = (typeof import.meta !== 'undefined' && (import.meta as any)?.env?.VITE_SUPABASE_URL) || '';
const supabaseAnonKey = (typeof import.meta !== 'undefined' && (import.meta as any)?.env?.VITE_SUPABASE_ANON_KEY) || '';

export const isSupabaseConfigured: boolean = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  supabaseUrl.startsWith('http') &&
  !supabaseUrl.includes('placeholder')
);

export const supabase: SupabaseClient<any> | null = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  : null;
