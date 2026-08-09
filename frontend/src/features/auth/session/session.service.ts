// frontend\src\features\auth\session\session.service.ts

import { api } from '@/lib/api/client';
import type { SessionResponse } from './session.types';

export async function restoreSession(): Promise<SessionResponse> {
  const response = await api.post<SessionResponse>('/auth/session');

  return response.data;
}
