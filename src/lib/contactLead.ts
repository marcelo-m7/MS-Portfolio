import type { PostgrestError, SupabaseClient } from '@supabase/supabase-js';

export interface ContactLeadPayload {
  name: string;
  email: string;
  company?: string;
  project?: string;
  message: string;
}

export interface NormalizedContactLead {
  name: string;
  email: string;
  company: string;
  project: string;
  message: string;
  project_source: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type SupabaseLeadsClient = SupabaseClient<any, 'public', any> | undefined;

export type ContactFallbackSender = (
  payload: NormalizedContactLead,
  reason: unknown,
) => Promise<void>;

export type ContactSubmitResult = 'saved' | 'emailed';

const normalize = (payload: ContactLeadPayload): NormalizedContactLead => ({
  name: payload.name.trim(),
  email: payload.email.trim(),
  company: payload.company?.trim() ?? '',
  project: payload.project?.trim() ?? '',
  message: payload.message.trim(),
  project_source: 'portfolio',
});

const runFallbackOrThrow = async (
  fallback: ContactFallbackSender,
  normalized: NormalizedContactLead,
  reason: unknown,
): Promise<ContactSubmitResult> => {
  try {
    await fallback(normalized, reason);
    return 'emailed';
  } catch (fallbackError) {
    const error = new Error(
      'Não foi possível salvar o lead nem enviar o email de fallback.',
    );
    (error as Error & {
      details?: { persistenceError: unknown; fallbackError: unknown };
    }).details = {
      persistenceError: reason,
      fallbackError,
    };
    throw error;
  }
};

export const submitContactLead = async (
  client: SupabaseLeadsClient | undefined,
  payload: ContactLeadPayload,
  fallback: ContactFallbackSender,
): Promise<ContactSubmitResult> => {
  const normalized = normalize(payload);

  if (!client) {
    return runFallbackOrThrow(
      fallback,
      normalized,
      new Error('Supabase client is not configured.'),
    );
  }

  try {
    const builder = client
      .schema('public')
      .from('leads')
      .insert([normalized]);

    // In the browser, avoid chaining .select() on INSERT due to RLS (anon cannot SELECT from leads)
    // Awaiting the insert without .select reduces the chance of a follow-up read request.
    const { error } =
      typeof window !== 'undefined'
        ? await builder
        : await builder.select();

    if (error) {
      return runFallbackOrThrow(fallback, normalized, error);
    }

    return 'saved';
  } catch (reason) {
    return runFallbackOrThrow(fallback, normalized, reason);
  }
};

export const __private__ = {
  normalize,
  runFallbackOrThrow,
};
