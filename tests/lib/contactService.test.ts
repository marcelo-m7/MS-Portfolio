import { describe, expect, it, vi } from 'vitest'

import {
  submitContact,
  ContactSubmissionError,
  type ContactFormData,
} from '../../src/lib/contactService'

const createClient = (options?: { insertError?: unknown }) => {
  const selectMock = vi.fn().mockResolvedValue({
    data: options?.insertError ? null : [{ id: '123' }],
    error: options?.insertError ?? null,
  })

  // Make builder thenable - this is what gets called in happy-dom tests
  const builder = {
    select: selectMock,
    then: (resolve: (value: { error: unknown; data: unknown }) => void) => {
      resolve({ error: options?.insertError ?? null, data: options?.insertError ? null : null })
    },
  }

  const insertMock = vi.fn(() => builder)
  const fromMock = vi.fn(() => ({ insert: insertMock }))
  const invokeMock = vi.fn()

  const client = {
    from: fromMock,
    functions: { invoke: invokeMock },
  } as const

  return {
    client: client as never,
    fromMock,
    insertMock,
    selectMock,
    invokeMock,
  }
}

const buildPayload = (overrides: Partial<ContactFormData> = {}): ContactFormData => ({
  name: 'John Doe',
  email: 'john@example.com',
  company: 'Acme Inc.',
  project: 'Landing page',
  message: 'Hello from tests',
  ...overrides,
})

describe('submitContact', () => {
  it('persists the lead when Supabase insert succeeds', async () => {
    const mocks = createClient()

    const result = await submitContact(buildPayload(), {
      client: mocks.client as never,
    })

    expect(mocks.fromMock).toHaveBeenCalledWith('leads')
    expect(mocks.insertMock).toHaveBeenCalledTimes(1)
    expect(mocks.invokeMock).not.toHaveBeenCalled()
    expect(result).toEqual({ status: 'stored', leadId: undefined })
  })

  it('falls back to sending an email when Supabase insert fails', async () => {
    const mocks = createClient({ insertError: new Error('insert fail') })
    mocks.invokeMock.mockResolvedValueOnce({ data: { ok: true }, error: null })

    const result = await submitContact(buildPayload(), {
      client: mocks.client as never,
    })

    expect(mocks.invokeMock).toHaveBeenCalledWith('send-contact-email', {
      body: expect.objectContaining({ to: 'marcelo@monynha.com' }),
    })
    expect(result).toEqual({ status: 'fallback', leadId: undefined })
  })

  it('throws a ContactSubmissionError when both persistence and fallback fail', async () => {
    const mocks = createClient({ insertError: new Error('insert fail') })
    mocks.invokeMock.mockResolvedValueOnce({ data: null, error: new Error('fallback fail') })

    await expect(
      submitContact(buildPayload(), {
        client: mocks.client as never,
      }),
    ).rejects.toBeInstanceOf(ContactSubmissionError)
  })
})
