import { api } from '@/lib/api/client';
import type { PublicUser } from '@/types/user';
import { AuthorResponse, AuthorsApiResponse, AuthorsResponse } from './authors.types';


export const getAuthors = async (page = 1): Promise<AuthorsResponse> => {
  const { data } = await api.get<AuthorsApiResponse>(`/users?page=${page}&perPage=20`);

  return {
    authors: data.data.map((author) => ({
      id: author._id,
      name: author.name,
      avatarUrl: author.avatarUrl ?? null,
     articlesAmount: author.articlesAmount,
    })),
    total: data.total,
    page: data.page,
    perPage: data.perPage,
    hasNextPage: data.hasNextPage,
  };
};

export const getAuthorById = async (userId: string): Promise<PublicUser> => {
  const { data } = await api.get<{ data: AuthorResponse }>(`/users/${userId}`);
  return {
    id: data.data.id,
    name: data.data.name,
    avatarUrl: data.data.avatar,
    articlesAmount: data.data.articlesAmount,
  };
};



