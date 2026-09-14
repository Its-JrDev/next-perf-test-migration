import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { RootProviders } from '@/app/root-providers';
import { HomePage } from '@/screens/Home';

describe('Home', () => {
  it('muestra el catálogo público a un invitado', () => {
    render(
      <RootProviders>
        <HomePage />
      </RootProviders>,
    );
    expect(screen.getByText(/Gestión de eventos/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Ver eventos/i })).toHaveAttribute(
      'href',
      '/events',
    );
  });
});