import { api } from '@/lib/api/client';
import type { PublicUser } from '@/types/user';
import {
  AuthorResponse,
  AuthorsApiResponse,
  AuthorsResponse,
} from './authors.types';

export const getAuthors = async (
  page = 1,
): Promise<AuthorsResponse> => {
  console.log(
    `🌐 getAuthors() REQUEST page=${page}`,
  );

  try {
    const { data } =
      await api.get<AuthorsApiResponse>(
        `/users?page=${page}&perPage=20`,
      );

    console.log(
      `🌐 getAuthors() RAW RESPONSE page=${page}:`,
      data,
    );

    const result: AuthorsResponse = {
      authors: data.data.map((author) => ({
        id: author._id,
        name: author.name,
        avatarUrl: author.avatarUrl ?? null,
        articlesCount: author.articlesCount,
      })),

      total: data.total,
      page: data.page,
      perPage: data.perPage,
      hasNextPage: data.hasNextPage,
    };

    console.log(
      `🌐 getAuthors() MAPPED RESPONSE page=${page}:`,
      result,
    );

    return result;
  } catch (error) {
    console.error(
      `🌐 getAuthors() REQUEST ERROR page=${page}:`,
      error,
    );

    throw error;
  }
};

export const getAuthorById = async (
  userId: string,
): Promise<PublicUser> => {
  const { data } =
    await api.get<{ data: AuthorResponse }>(
      `/users/${userId}`,
    );

  return {
    id: data.data.id,
    name: data.data.name,
    avatarUrl: data.data.avatar,
    articlesCount: data.data.articlesAmount,
  };
};



