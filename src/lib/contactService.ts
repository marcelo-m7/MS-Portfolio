import type {
  FunctionsError,
  PostgrestError,
  SupabaseClient,
} from '@supabase/supabase-js';
import { supabase } from './supabaseClient';
import { logger } from './logger';

export interface ContactFormData {
  name: string;
  email: string;
  company?: string;
  project?: string;
  message: string;
}

export type ContactSubmissionResult =
  | { status: 'stored'; leadId?: string }
  | { status: 'fallback'; leadId?: string };

const CONTACT_TABLE = 'leads';
const CONTACT_FALLBACK_FUNCTION = 'send-contact-email';
const FALLBACK_EMAIL = 'marcelo@monynha.com';

interface FallbackResponse {
  data: unknown;
  error: FunctionsError | null;
}

const buildFallbackPayload = (payload: ContactFormData) => ({
  to: FALLBACK_EMAIL,
  subject: 'Novo contato via Monynha Portfolio',
  message: [
    `Nome: ${payload.name}`,
    `Email: ${payload.email}`,
    payload.company ? `Empresa: ${payload.company}` : null,
    payload.project ? `Projeto: ${payload.project}` : null,
    '',
    payload.message,
  ]
    .filter(Boolean)
    .join('\n'),
});

export class ContactSubmissionError extends Error {
  constructor(message: string, public cause?: unknown) {
    super(message);
    this.name = 'ContactSubmissionError';
  }
}

const assertSupabaseClient = (client?: SupabaseClient) => {
  const resolved = client ?? supabase;

  if (!resolved) {
    throw new ContactSubmissionError('Supabase client is not configured.');
  }

  return resolved;
};

const sendFallbackEmail = async (
  payload: ContactFormData,
  client: SupabaseClient,
): Promise<FallbackResponse> => {
  const { data, error } = await client.functions.invoke(CONTACT_FALLBACK_FUNCTION, {
    body: buildFallbackPayload(payload),
  });

  return { data, error };
};

const persistLead = async (payload: ContactFormData, client: SupabaseClient) => {
  // In the browser, avoid .select() on INSERT due to RLS (anon users cannot SELECT from leads).
  // Use minimal returning so the insert succeeds without requiring SELECT privileges.
  const isBrowser = typeof window !== 'undefined';

  const insertPayload = {
    name: payload.name,
    email: payload.email,
    company: payload.company ?? null,
    project: payload.project ?? null,
    message: payload.message,
    // Ensure RLS policy WITH CHECK passes explicitly
    project_source: 'portfolio',
  } as const;

  // Build insert query once
  const builder = client.from(CONTACT_TABLE).insert([insertPayload]);

  if (isBrowser) {
    // Avoid .select() in browser to reduce chance of SELECT-related RLS errors
    const { error } = await builder;
    return { data: null, error } as { data: Array<{ id?: string }> | null; error: PostgrestError | null };
  }

  // In tests/server environments keep the original behavior for compatibility
  const { data, error } = await builder.select();
  return { data, error };
};

export const submitContact = async (
  payload: ContactFormData,
  options?: { client?: SupabaseClient },
): Promise<ContactSubmissionResult> => {
  const client = assertSupabaseClient(options?.client);
  const { data, error } = await persistLead(payload, client);

  if (!error) {
    const leadId = Array.isArray(data) && data.length > 0 ? data[0]?.id : undefined;
    return { status: 'stored', leadId };
  }

  logger.error('Failed to persist lead to Supabase', { component: 'contactService' }, error);

  const fallback = await sendFallbackEmail(payload, client);

  if (fallback.error) {
    logger.error('Fallback email dispatch failed', { component: 'contactService' }, fallback.error);

    throw new ContactSubmissionError('Não foi possível enviar sua mensagem.', {
      persistError: error,
      fallbackError: fallback.error,
    });
  }

  const leadId = Array.isArray(data) && data.length > 0 ? data[0]?.id : undefined;
  return { status: 'fallback', leadId };
};

export const __internal = {
  buildFallbackPayload,
  sendFallbackEmail,
  persistLead,
  assertSupabaseClient,
};
