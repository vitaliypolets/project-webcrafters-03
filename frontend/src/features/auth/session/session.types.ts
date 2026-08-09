// frontend\src\features\auth\session\session.types.ts

import type { User } from '@/types/user';

export type SessionResponse = {
  user: User;
  accessToken: string;
};
