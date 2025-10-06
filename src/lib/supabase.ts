import { createClient } from '@supabase/supabase-js';

type ContactEmailPayload = {
  name: string;
  email: string;
  message: string;
  to?: string;
};

const supabaseUrl = import.meta.env.VITE_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_PUBLIC_SUPABASE_ANON_KEY;

export const supabase =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;

export async function sendContactEmail(payload: ContactEmailPayload) {
  if (!supabase) {
    throw new Error('Supabase client is not configured.');
  }

  const { data, error } = await supabase.functions.invoke('send-contact-email', {
    body: {
      ...payload,
      to: payload.to ?? 'hello@monynha.com',
    },
  });

  if (error) {
    throw error;
  }

  return data;
}
