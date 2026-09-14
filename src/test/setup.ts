import '@testing-library/jest-dom/vitest';
import React from 'react';
import { vi } from 'vitest';

// Polyfill de matchMedia: lo requieren sonner y algunos primitives de Radix
// (p. ej. useMediaQuery interna) bajo jsdom.
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => undefined,
    removeListener: () => undefined,
    addEventListener: () => undefined,
    removeEventListener: () => undefined,
    dispatchEvent: () => false,
  }),
});

// Compatibilidad con App Router bajo jsdom: la navegación se simula y los
// enlaces se renderizan como <a> simples.
const routerMocks = {
  push: vi.fn(),
  replace: vi.fn(),
  back: vi.fn(),
  forward: vi.fn(),
  prefetch: vi.fn(),
};

vi.mock('next/navigation', () => ({
  useRouter: () => routerMocks,
  usePathname: () => '/',
  useParams: () => ({}),
  useSearchParams: () => new URLSearchParams(),
}));

vi.mock('next/link', () => ({
  default: (props: {
    href: string;
    children?: React.ReactNode;
    [key: string]: unknown;
  }) => {
    const { href, children, ...rest } = props;
    return React.createElement(
      'a',
      { href: typeof href === 'string' ? href : String(href), ...rest },
      children,
    );
  },
}));