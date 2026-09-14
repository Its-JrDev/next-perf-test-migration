import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect } from 'vitest';
import { AuthProvider } from '@/providers/AuthProvider';
import { FavoritesProvider } from '@/providers/FavoritesProvider';
import { EventDetailTemplate } from '@/components/templates';

const mockEvent = {
  id: 'evt-1',
  name: 'Festival de Verano',
  description: 'Un evento con música y arte en la plaza central.',
  date: '2026-09-15T20:00:00.000Z',
  location: 'Bogotá',
  price: 45000,
  capacity: 200,
  categoryId: 'cat-1',
  category: {
    id: 'cat-1',
    name: 'Música',
    description: 'Eventos musicales',
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
  },
  images: [
    { id: 'img-1', url: 'https://example.com/1.jpg', order: 1, eventId: 'evt-1' },
    { id: 'img-2', url: 'https://example.com/2.jpg', order: 2, eventId: 'evt-1' },
  ],
  createdAt: '2024-01-01T00:00:00.000Z',
  updatedAt: '2024-01-01T00:00:00.000Z',
};

describe('EventDetailTemplate', () => {
  it('muestra la información principal y cierra el modal al cancelar', async () => {
    const user = userEvent.setup();

    render(
      <AuthProvider>
        <FavoritesProvider>
          <EventDetailTemplate
            event={mockEvent}
            isLoading={false}
            error={null}
            canEdit={true}
            deleting={false}
            onBack={() => {}}
            onEdit={() => {}}
            onDelete={() => {}}
          />
        </FavoritesProvider>
      </AuthProvider>,
    );

    expect(screen.getByText(/Bogotá/i)).toBeInTheDocument();
    expect(screen.getByText(/Fecha/i)).toBeInTheDocument();
    expect(screen.getByText(/Lugar/i)).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /eliminar/i }));
    expect(screen.getByText(/seguro que deseas eliminar/i)).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /cancelar/i }));
    expect(
      screen.queryByText(/seguro que deseas eliminar/i),
    ).not.toBeInTheDocument();
  });
});