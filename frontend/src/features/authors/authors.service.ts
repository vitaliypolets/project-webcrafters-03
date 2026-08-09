
import type { PublicUser } from '@/types/user';

type BackendUserResponse = {
  id: string;
  name: string;
  avatar: string | null;
  articlesAmount: number;
};

export const getAuthorById = async (userId: string): Promise<PublicUser> => {
  const response = await fetch(`/api/users/${userId}`);

  if (!response.ok) {
    throw new Error('Failed to fetch author');
  }

  const { data }: { data: BackendUserResponse } = await response.json();

  return {
    id: data.id,
    name: data.name,
    avatarUrl: data.avatar,
    articlesCount: data.articlesAmount,
  };
};
