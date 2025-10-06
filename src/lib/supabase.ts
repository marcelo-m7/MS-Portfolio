import { createClient } from '@supabase/supabase-js';

type LeadPayload = {
  name: string;
  email: string;
  message: string;
  company?: string | null;
  project?: string | null;
};

const supabaseUrl = import.meta.env.VITE_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_PUBLIC_SUPABASE_ANON_KEY;

export const supabase =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;

export async function createLead(payload: LeadPayload) {
  if (!supabase) {
    throw new Error('Supabase client is not configured.');
  }

  const { error } = await supabase.from('leads').insert({
    name: payload.name,
    email: payload.email,
    message: payload.message,
    company: payload.company ?? null,
    project: payload.project ?? null,
  });

  if (error) {
    throw error;
  }
}
