import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database.types';
import { logger } from './logger';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_KEY as string | undefined;
const supabaseSchema = import.meta.env.VITE_SUPABASE_SCHEMA as string | undefined;

if (!supabaseUrl || !supabaseAnonKey) {
  logger.warn('Supabase credentials are not defined. Email submissions will be disabled.', {
    component: 'supabaseClient',
  });
}

// Create client with portfolio schema as default
// This allows queries to use .from('table_name') without schema prefix
export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey, {
      db: { schema: supabaseSchema || 'portfolio' }
    })
  : undefined;

// Export the schema for use in queries (portfolio is our main schema)
export const PORTFOLIO_SCHEMA = 'portfolio' as const;
export const PUBLIC_SCHEMA = 'public' as const;
