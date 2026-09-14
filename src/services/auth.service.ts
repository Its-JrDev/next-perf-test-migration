import api from '@/services/axios.client';
import type {
  AuthResponse,
  LoginPayload,
  RegisterPayload,
  User,
} from '@/types';

export const authService = {
  async register(payload: RegisterPayload): Promise<AuthResponse> {
    const { data } = await api.post<AuthResponse>('/auth/register', payload);
    return data;
  },

  async login(payload: LoginPayload): Promise<AuthResponse> {
    const { data } = await api.post<AuthResponse>('/auth/login', payload);
    return data;
  },

  async logout(): Promise<void> {
    await api.post('/auth/logout');
  },

  async me(): Promise<User> {
    const { data } = await api.get<User>('/users/me');
    return data;
  },
};
