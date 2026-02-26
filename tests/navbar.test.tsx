import { describe, it, expect, vi } from 'vitest';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, useNavigate } from 'react-router-dom';
import React from 'react';
import Navbar from '@/components/Navbar';

// Mock icon components to avoid undefined React elements
vi.mock('lucide-react', () => ({
  Menu: (props: Record<string, unknown>) => <svg data-testid="icon-menu" {...props} />,
  X: (props: Record<string, unknown>) => <svg data-testid="icon-x" {...props} />,
}));

vi.mock('framer-motion', () => {
  const createMotionComponent = (element: React.ElementType) =>
    React.forwardRef<HTMLElement, Record<string, unknown>>((props, ref) =>
      React.createElement(element, { ...props, ref }),
    );

  const motion = Object.assign(
    (Component: React.ElementType) =>
      React.forwardRef<HTMLElement, Record<string, unknown>>((props, ref) =>
        React.createElement(Component, { ...props, ref }),
      ),
    {
      div: createMotionComponent('div'),
      button: createMotionComponent('button'),
      nav: createMotionComponent('nav'),
      span: createMotionComponent('span'),
      a: createMotionComponent('a'),
    },
  );

  return {
    __esModule: true,
    motion,
    AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
    useReducedMotion: () => true,
  };
});

vi.mock('@/hooks/usePortfolioData', () => ({
  useProfile: () => ({ data: { name: 'Test User' } }),
}));

vi.mock('@/hooks/useTranslations', () => ({
  useTranslations: () => ({
    nav: {
      home: 'Home',
      portfolio: 'Portfolio',
      about: 'About',
      thoughts: 'Thoughts',
      contact: 'Contact',
      menu: 'Menu',
      closeMenu: 'Close menu',
      openMenu: 'Open menu',
      repositories: 'Repositories',
    },
  }),
}));

vi.mock('@/lib/siteLinks', () => ({
  LINKS: {
    repositories: 'https://github.com/test',
  },
}));

vi.mock('@/components/MobileNavLink', () => ({
  __esModule: true,
  default: ({ to, label, isActive, onClose }: { to: string; label: string; isActive: boolean; onClose: () => void }) => (
    <a href={to} onClick={onClose} className={isActive ? 'active' : ''}>
      {label}
    </a>
  ),
}));

vi.mock('@/components/ThemeToggle', () => {
  const ThemeToggle = (props: { className?: string }) => (
    <button type="button" data-testid="theme-toggle" {...props} />
  );
  return {
    __esModule: true,
    ThemeToggle,
  };
});

vi.mock('@/components/LanguageToggle', () => {
  const LanguageToggle = () => <button type="button" data-testid="language-toggle" />;
  return {
    __esModule: true,
    LanguageToggle,
  };
});

vi.mock('@/components/MonynhaLogo', () => ({
  __esModule: true,
  default: () => <span data-testid="logo">Logo</span>,
}));

describe('Navbar mobile menu', () => {
  const renderNavbar = () =>
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>,
    );

  const NavigationWrapper = () => {
    const navigate = useNavigate();

    return (
      <>
        <Navbar />
        <button type="button" data-testid="navigate" onClick={() => navigate('/about')}>
          Navigate
        </button>
      </>
    );
  };

  it('closes when clicking outside the menu', () => {
    renderNavbar();

    const toggleButton = screen.getByRole('button', { name: /open menu/i });
    fireEvent.click(toggleButton);

    expect(toggleButton.getAttribute('aria-expanded')).toBe('true');

    fireEvent.mouseDown(document.body);

    expect(toggleButton.getAttribute('aria-expanded')).toBe('false');
  });

  it('closes when pressing Escape', () => {
    renderNavbar();

    const toggleButton = screen.getByRole('button', { name: /open menu/i });
    fireEvent.click(toggleButton);

    fireEvent.keyDown(document, { key: 'Escape' });

    expect(toggleButton.getAttribute('aria-expanded')).toBe('false');
  });

  it('closes after navigation changes the route', async () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <NavigationWrapper />
      </MemoryRouter>,
    );

    const toggleButton = screen.getByRole('button', { name: /open menu/i });
    fireEvent.click(toggleButton);

    expect(toggleButton.getAttribute('aria-expanded')).toBe('true');

    fireEvent.click(screen.getByTestId('navigate'));

    await waitFor(() => expect(toggleButton.getAttribute('aria-expanded')).toBe('false'));
  });
});
