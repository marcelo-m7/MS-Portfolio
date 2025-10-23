import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_KEY as string | undefined;
const supabaseSchema = import.meta.env.VITE_SUPABASE_SCHEMA as string | undefined;

if (!supabaseUrl || !supabaseAnonKey) {
  if (import.meta.env.DEV) {
    console.warn('Supabase credentials are not defined. Email submissions will be disabled.');
  }
}

export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey, {
      db: {
        schema: supabaseSchema || 'public',
      },
    })
  : undefined;

// Export the schema for use in queries
export const SUPABASE_SCHEMA = supabaseSchema || 'public';
