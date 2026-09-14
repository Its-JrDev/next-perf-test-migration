import { beforeEach, describe, expect, it, vi } from 'vitest';
import api from '@/services/axios.client';
import { favoriteService } from '@/services/favorite.service';

describe('favoriteService', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it('propaga el error cuando la API de favoritos no responde', async () => {
    vi.spyOn(api, 'post').mockRejectedValue(new Error('offline'));

    await expect(favoriteService.addFavorite('evt-1')).rejects.toThrow(
      'offline',
    );
  });
});
