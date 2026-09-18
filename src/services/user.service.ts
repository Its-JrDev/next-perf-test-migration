import api from '@/services/api.client';
import type { User } from '@/types';

export interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
}

export const userService = {
  async getUser(): Promise<User> {
    const { data } = await api.get<User>('/users/me');
    return data;
  },

  async changePassword(payload: ChangePasswordPayload): Promise<void> {
    await api.patch('/users/me/password', payload);
  },
};
