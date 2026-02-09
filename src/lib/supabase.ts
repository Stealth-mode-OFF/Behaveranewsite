import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

/**
 * Shared Supabase client instance.
 * Returns null if env vars are not configured or still have placeholder values.
 */
const isConfigured =
  supabaseUrl &&
  supabaseAnonKey &&
  !supabaseAnonKey.includes('your_') &&
  supabaseAnonKey.length > 20;

export const supabase = isConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;
