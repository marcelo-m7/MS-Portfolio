import React from 'react';
import { render, screen } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';
import { describe, expect, it } from 'vitest';

import FallbackAlert from '@/components/fallback-alert';

const messages = {
  fallback: {
    badge: 'Auto-fallback',
    description: '{count} missing',
  },
  __meta: {
    fallbackKeys: ['home.bio', 'home.subtitle'],
  },
};

describe('FallbackAlert', () => {
  it('renders notice when fallback keys exist', () => {
    render(
      <NextIntlClientProvider locale="en" messages={messages}>
        <FallbackAlert />
      </NextIntlClientProvider>,
    );

    expect(screen.getByText('Auto-fallback')).toBeInTheDocument();
    expect(screen.getByText(/missing/)).toBeInTheDocument();
  });

  it('hides notice when no fallback keys', () => {
    render(
      <NextIntlClientProvider locale="en" messages={{ ...messages, __meta: { fallbackKeys: [] } }}>
        <FallbackAlert />
      </NextIntlClientProvider>,
    );

    expect(screen.queryByText('Auto-fallback')).toBeNull();
  });
});
