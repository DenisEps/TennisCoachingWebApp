import { User as SupabaseUser } from '@supabase/supabase-js';

export interface User extends SupabaseUser {
  full_name?: string | null;
  role?: 'coach' | 'client';
  phone?: string | null;
} 