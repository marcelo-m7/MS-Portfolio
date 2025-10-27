import { describe, expect, it, vi } from 'vitest';

import {
  __private__,
  submitContactLead,
  type ContactFallbackSender,
  type ContactLeadPayload,
  type NormalizedContactLead,
  type SupabaseLeadsClient,
} from './contactLead';

const createSupabaseMock = (
  options: {
    error?: unknown;
    throwOnSelect?: boolean;
  } = {},
): SupabaseLeadsClient => {
  const select = vi.fn(async () => {
    if (options.throwOnSelect) {
      throw options.error ?? new Error('unexpected');
    }

    return {
      error: (options.error ?? null) as unknown,
    };
  });

  const insert = vi.fn(() => ({ select }));
  const from = vi.fn(() => ({ insert }));
  const schema = vi.fn(() => ({ from }));

  return {
    schema,
  } as unknown as SupabaseLeadsClient;
};

describe('normalize', () => {
  it('trims values and ensures optional fields become empty strings', () => {
    const payload: ContactLeadPayload = {
      name: ' John ',
      email: ' john@example.com ',
      company: '  ',
      project: undefined,
      message: ' Hello world ',
    };

    const normalized = __private__.normalize(payload);

    expect(normalized).toEqual<NormalizedContactLead>({
      name: 'John',
      email: 'john@example.com',
      company: '',
      project: '',
      message: 'Hello world',
      project_source: 'portfolio',
    });
  });
});

describe('submitContactLead', () => {
  const payload: ContactLeadPayload = {
    name: 'John',
    email: 'john@example.com',
    company: 'Acme',
    project: 'Website',
    message: 'Hi there',
  };

  it('saves the lead when Supabase succeeds', async () => {
    const client = createSupabaseMock();
    const fallback = vi.fn<ContactFallbackSender>();

    const result = await submitContactLead(client, payload, fallback);

    expect(result).toBe('saved');
    expect(fallback).not.toHaveBeenCalled();
  });

  it('runs the fallback when Supabase returns an error', async () => {
    const persistenceError = new Error('fail');
    const client = createSupabaseMock({ error: persistenceError });
    const fallback = vi.fn<ContactFallbackSender>().mockResolvedValue();

    const result = await submitContactLead(client, payload, fallback);

    expect(result).toBe('emailed');
    expect(fallback).toHaveBeenCalledTimes(1);
    expect(fallback).toHaveBeenCalledWith(
      {
        name: 'John',
        email: 'john@example.com',
        company: 'Acme',
        project: 'Website',
        message: 'Hi there',
        project_source: 'portfolio',
      },
      persistenceError,
    );
  });

  it('throws when fallback fails after a persistence error', async () => {
    const persistenceError = new Error('supabase failure');
    const client = createSupabaseMock({ error: persistenceError });
    const fallbackError = new Error('mail failure');
    const fallback = vi
      .fn<ContactFallbackSender>()
      .mockRejectedValue(fallbackError);

    await expect(submitContactLead(client, payload, fallback)).rejects.toMatchObject({
      message: 'Não foi possível salvar o lead nem enviar o email de fallback.',
      details: { persistenceError, fallbackError },
    });
  });

  it('uses the fallback when the Supabase client is unavailable', async () => {
    const fallback = vi.fn<ContactFallbackSender>().mockResolvedValue();

    const result = await submitContactLead(undefined, payload, fallback);

    expect(result).toBe('emailed');
    expect(fallback).toHaveBeenCalledTimes(1);
  });

  it('uses the fallback when Supabase throws unexpectedly', async () => {
    const thrown = new Error('network');
    const client = createSupabaseMock({ throwOnSelect: true, error: thrown });
    const fallback = vi.fn<ContactFallbackSender>().mockResolvedValue();

    const result = await submitContactLead(client, payload, fallback);

    expect(result).toBe('emailed');
    expect(fallback).toHaveBeenCalledWith(
      {
        name: 'John',
        email: 'john@example.com',
        company: 'Acme',
        project: 'Website',
        message: 'Hi there',
        project_source: 'portfolio',
      },
      thrown,
    );
  });
});
