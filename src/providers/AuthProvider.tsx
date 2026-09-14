import { useState, useEffect, type ReactNode } from 'react';
import { authService, AUTH_UNAUTHORIZED_EVENT, TOKEN_KEY } from '@/services';
import { AuthContext } from '@/contexts';
import type { User, LoginPayload, RegisterPayload } from '@/types';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const handleUnauthorized = () => {
      localStorage.removeItem(TOKEN_KEY);
      setUser(null);
      setIsLoading(false);
    };

    window.addEventListener(AUTH_UNAUTHORIZED_EVENT, handleUnauthorized);
    return () => {
      window.removeEventListener(AUTH_UNAUTHORIZED_EVENT, handleUnauthorized);
    };
  }, []);

  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsLoading(false);
      return;
    }

    let active = true;

    (async () => {
      setIsLoading(true);
      try {
        const me = await authService.me();
        if (active) setUser(me);
      } catch {
        if (active) {
          localStorage.removeItem(TOKEN_KEY);
          setUser(null);
        }
      } finally {
        if (active) setIsLoading(false);
      }
    })();

    return () => {
      active = false;
    };
  }, []);

  const login = async (credentials: LoginPayload) => {
    const res = await authService.login(credentials);
    localStorage.setItem(TOKEN_KEY, res.accessToken);
    setUser(res.user);
  };

  const register = async (payload: RegisterPayload) => {
    const res = await authService.register(payload);
    localStorage.setItem(TOKEN_KEY, res.accessToken);
    setUser(res.user);
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch {
      // El logout local se ejecuta igual aunque el servidor falle
    } finally {
      localStorage.removeItem(TOKEN_KEY);
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};