import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, it, expect, vi } from 'vitest';
import { useRouter } from 'next/navigation';
import { AuthProvider } from '@/providers';
import { ApiError, authService } from '@/services';
import { LoginPage } from './Login';

vi.mock('@/services', async (importOriginal) => {
  const original = await importOriginal<typeof import('@/services')>();
  return {
    ...original,
    authService: {
      ...original.authService,
      login: vi.fn(),
    },
  };
});

const mockedLogin = vi.mocked(authService.login);

function renderLogin() {
  return render(
    <AuthProvider>
      <LoginPage />
    </AuthProvider>,
  );
}

describe('LoginPage', () => {
  afterEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('muestra los campos de correo y contraseña', () => {
    renderLogin();
    expect(screen.getByLabelText(/Correo electrónico/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Contraseña/i)).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Ingresar' }),
    ).toBeInTheDocument();
  });

  it('valida los campos vacíos sin llamar a la API', async () => {
    const user = userEvent.setup();
    renderLogin();

    await user.click(screen.getByRole('button', { name: 'Ingresar' }));

    expect(
      await screen.findByText('El correo es obligatorio'),
    ).toBeInTheDocument();
    expect(
      screen.getByText('La contraseña es obligatoria'),
    ).toBeInTheDocument();
    expect(mockedLogin).not.toHaveBeenCalled();
  });

  it('muestra el error del servidor cuando el login falla', async () => {
    mockedLogin.mockRejectedValue(
      new ApiError({ message: 'Credenciales inválidas', status: 401 }),
    );
    const user = userEvent.setup();
    renderLogin();

    await user.type(
      screen.getByLabelText(/Correo electrónico/i),
      'admin@examen.com',
    );
    await user.type(screen.getByLabelText(/Contraseña/i), 'Incorrecta123!');
    await user.click(screen.getByRole('button', { name: 'Ingresar' }));

    expect(
      await screen.findByText('Credenciales inválidas'),
    ).toBeInTheDocument();
    expect(mockedLogin).toHaveBeenCalledWith({
      email: 'admin@examen.com',
      password: 'Incorrecta123!',
    });
  });

  it('llama a login y navega a / en caso de éxito', async () => {
    mockedLogin.mockResolvedValue({
      user: {
        id: '1',
        name: 'Admin Examen',
        email: 'admin@examen.com',
        role: 'admin',
        createdAt: new Date().toISOString(),
      },
      accessToken: 'token',
    });
    const router = useRouter();
    const user = userEvent.setup();
    renderLogin();

    await user.type(
      screen.getByLabelText(/Correo electrónico/i),
      'admin@examen.com',
    );
    await user.type(screen.getByLabelText(/Contraseña/i), 'Admin123!');
    await user.click(screen.getByRole('button', { name: 'Ingresar' }));

    await waitFor(() =>
      expect(mockedLogin).toHaveBeenCalledWith({
        email: 'admin@examen.com',
        password: 'Admin123!',
      }),
    );
    expect(router.replace).toHaveBeenCalledWith('/');
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });
});