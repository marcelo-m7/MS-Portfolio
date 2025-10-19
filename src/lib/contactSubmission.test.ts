/// <reference types="vitest" />

import { describe, expect, it, vi } from 'vitest';
import {
  ContactSubmissionError,
  SupabaseClientUnavailableError,
  persistLead,
  submitContact,
} from './contactSubmission';

const createInsertMock = ({
  singleResult,
}: {
  singleResult: { data: unknown; error: unknown };
}) => {
  const single = vi.fn().mockResolvedValue(singleResult);
  const select = vi.fn().mockReturnValue({ single });
  const insert = vi.fn().mockReturnValue({ select });
  return { insert, select, single };
};

const createSupabaseMock = ({
  singleResult,
}: {
  singleResult: { data: unknown; error: unknown };
}) => {
  const { insert, select, single } = createInsertMock({ singleResult });

  return {
    from: vi.fn().mockReturnValue({ insert }),
    insert,
    select,
    single,
    functions: {
      invoke: vi.fn().mockResolvedValue({ error: null }),
    },
  } as unknown as Parameters<typeof persistLead>[0];
};

describe('persistLead', () => {
  it('stores the lead and returns the created record', async () => {
    const payload = {
      name: 'John Doe',
      email: 'john@example.com',
      company: 'ACME',
      project: 'Website',
      message: 'Hello!',
    };

    const singleResult = {
      data: { id: 'lead-123', ...payload, created_at: new Date().toISOString() },
      error: null,
    };

    const supabaseMock = createSupabaseMock({ singleResult });

    const lead = await persistLead(supabaseMock, payload);

    expect(lead).toEqual(singleResult.data);
    expect(supabaseMock.from).toHaveBeenCalledWith('leads');
  });
});

describe('submitContact', () => {
  const payload = {
    name: 'Jane Doe',
    email: 'jane@example.com',
    company: 'ACME',
    project: 'Mobile App',
    message: 'We need help with our product.',
  };

  it('returns a stored status when Supabase insertion succeeds', async () => {
    const supabaseMock = createSupabaseMock({
      singleResult: {
        data: { id: 'lead-1', ...payload, created_at: new Date().toISOString() },
        error: null,
      },
    });

    const result = await submitContact(payload, { supabaseClient: supabaseMock });

    expect(result.status).toBe('stored');
  });

  it('falls back to email when Supabase insertion fails', async () => {
    const supabaseMock = createSupabaseMock({
      singleResult: {
        data: null,
        error: new Error('database is down'),
      },
    });

    const fallback = vi.fn().mockResolvedValue(undefined);

    const result = await submitContact(payload, {
      supabaseClient: supabaseMock,
      fallback,
    });

    expect(result.status).toBe('fallback');
    expect(fallback).toHaveBeenCalled();
  });

  it('throws a ContactSubmissionError when both Supabase and fallback fail', async () => {
    const supabaseMock = createSupabaseMock({
      singleResult: {
        data: null,
        error: new Error('insert failed'),
      },
    });

    const fallback = vi.fn().mockRejectedValue(new Error('smtp down'));

    await expect(
      submitContact(payload, {
        supabaseClient: supabaseMock,
        fallback,
      }),
    ).rejects.toBeInstanceOf(ContactSubmissionError);
  });

  it('throws a SupabaseClientUnavailableError when no client is configured', async () => {
    await expect(submitContact(payload, { supabaseClient: undefined as never })).rejects.toBeInstanceOf(
      SupabaseClientUnavailableError,
    );
  });
});
