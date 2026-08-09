import { api } from '@/lib/api/client';
import type { PublicUser } from '@/types/user';

type AuthorResponse = {
  id: string;
  name: string;
  avatar: string | null;
  articlesAmount: number;
};

export const getAuthorById = async (
  userId: string,
): Promise<PublicUser> => {
  const { data } = await api.get<{ data: AuthorResponse }>(
    `/users/${userId}`,
  );

  return {
    id: data.data.id,
    name: data.data.name,
    avatarUrl: data.data.avatar,
    articlesCount: data.data.articlesAmount,
  };
};

