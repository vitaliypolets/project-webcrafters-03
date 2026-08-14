import { api } from '@/lib/api/client';

import type { ProfileDetails, ProfileDetailsApiResponse } from './profile.types';

export async function getProfileDetails(userId: string): Promise<ProfileDetails> {
  const { data } = await api.get<ProfileDetailsApiResponse>(`/users/${userId}`);

  return {
    id: data.data.id,
    name: data.data.name,
    avatarUrl: data.data.avatar,
    articlesAmount: data.data.articlesAmount,
  };
}
