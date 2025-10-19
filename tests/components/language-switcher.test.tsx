import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import LanguageSwitcher from '@/components/language-switcher';
import ptMessages from '@/locales/pt-PT.json';

vi.mock('@/components/ui/dropdown-menu', () => {
  const React = require('react');
  return {
    DropdownMenu: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
    DropdownMenuTrigger: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
    DropdownMenuContent: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
    DropdownMenuLabel: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
    DropdownMenuSeparator: () => <hr />,
    DropdownMenuItem: ({
      children,
      onSelect,
    }: {
      children: React.ReactNode;
      onSelect: (event: { preventDefault: () => void }) => void;
    }) => (
      <button type="button" onClick={() => onSelect?.({ preventDefault: () => {} })}>
        {children}
      </button>
    ),
  };
});

const replaceMock = vi.fn();
const refreshMock = vi.fn();

vi.mock('next/navigation', async (importOriginal) => {
  const actual = (await importOriginal()) as Record<string, unknown>;
  return {
    __esModule: true,
    ...actual,
    useRouter: () => ({
      replace: replaceMock,
      refresh: refreshMock,
    }),
    usePathname: () => '/pt-PT',
  };
});

describe('LanguageSwitcher', () => {
  beforeEach(() => {
    replaceMock.mockClear();
    refreshMock.mockClear();
    document.cookie = '';
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('updates the locale cookie and navigates to the selected language', async () => {
    render(
      <NextIntlClientProvider locale="pt-PT" messages={ptMessages}>
        <LanguageSwitcher currentLocale="pt-PT" />
      </NextIntlClientProvider>,
    );

    const trigger = screen.getByRole('button', { name: /alterar idioma/i });
    fireEvent.click(trigger);

    const englishOption = screen.getByText('English');
    fireEvent.click(englishOption);

    await waitFor(() => expect(replaceMock).toHaveBeenCalledWith('/en'));
    expect(refreshMock).toHaveBeenCalled();
    expect(document.cookie).toContain('locale=en');
  });
});
