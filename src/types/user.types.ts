export type Role = 'admin' | 'user';

import type { ISODateString } from '@/types';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  createdAt: ISODateString | string;
}
