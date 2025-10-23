import type { PostgrestError } from '@supabase/supabase-js';

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

export type SupabaseLeadsClient = {
  from: (
    table: 'leads',
  ) => {
    insert: (
      values: NormalizedContactLead[],
    ) => {
      select: () => Promise<{ error: PostgrestError | null }>;
    };
  };
};

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
    const { error } = await client
      .from('leads')
      .insert([normalized])
      .select();

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
