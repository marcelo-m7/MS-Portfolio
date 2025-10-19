import type { PostgrestError, SupabaseClient } from '@supabase/supabase-js';
import { supabase } from './supabaseClient';

export interface ContactFormPayload {
  name: string;
  email: string;
  company?: string;
  project?: string;
  message: string;
}

export interface LeadRecord extends ContactFormPayload {
  id: string;
  created_at: string;
}

export type SubmitContactResult =
  | { status: 'stored'; lead: LeadRecord }
  | { status: 'fallback' };

export class SupabaseClientUnavailableError extends Error {
  constructor() {
    super('Supabase client is not configured.');
    this.name = 'SupabaseClientUnavailableError';
  }
}

export class ContactSubmissionError extends Error {
  constructor(message: string, options?: { cause?: unknown }) {
    super(message);
    this.name = 'ContactSubmissionError';
    if (options?.cause !== undefined) {
      // Maintain compatibility with environments that do not yet support the Error cause option
      (this as Error & { cause?: unknown }).cause = options.cause;
    }
  }
}

export async function persistLead(
  client: SupabaseClient,
  payload: ContactFormPayload,
): Promise<LeadRecord> {
  const { data, error } = await client
    .from('leads')
    .insert([{ ...payload }])
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data as LeadRecord;
}

export async function triggerFallbackEmail(
  client: SupabaseClient,
  payload: ContactFormPayload,
): Promise<void> {
  const { error } = await client.functions.invoke('send-contact-email', {
    body: {
      name: payload.name,
      email: payload.email,
      message: payload.message,
      company: payload.company,
      project: payload.project,
      to: 'marcelo@monynha.com',
    },
  });

  if (error) {
    throw error;
  }
}

interface SubmitContactOptions {
  supabaseClient?: SupabaseClient;
  fallback?: (client: SupabaseClient, payload: ContactFormPayload) => Promise<void>;
}

export async function submitContact(
  payload: ContactFormPayload,
  options: SubmitContactOptions = {},
): Promise<SubmitContactResult> {
  const client = Object.prototype.hasOwnProperty.call(options, 'supabaseClient')
    ? options.supabaseClient
    : supabase;

  if (!client) {
    throw new SupabaseClientUnavailableError();
  }

  try {
    const lead = await persistLead(client, payload);
    return { status: 'stored', lead };
  } catch (error) {
    const fallback = options.fallback ?? triggerFallbackEmail;

    try {
      await fallback(client, payload);
      return { status: 'fallback' };
    } catch (fallbackError) {
      throw new ContactSubmissionError('Não foi possível registrar o contato.', {
        cause: fallbackError instanceof Error ? fallbackError : error,
      });
    }
  }
}

export function formatSupabaseError(error: PostgrestError | Error): string {
  if ('message' in error && error.message) {
    return error.message;
  }

  return 'Ocorreu um erro inesperado.';
}
