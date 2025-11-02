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

// Create client without schema lock - we'll use .schema() method in queries
export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient<Database>(supabaseUrl, supabaseAnonKey)
  : undefined;

// Export the schema for use in queries (portfolio is our main schema)
export const PORTFOLIO_SCHEMA = 'portfolio' as const;
export const PUBLIC_SCHEMA = 'public' as const;
