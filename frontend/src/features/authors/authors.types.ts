import type { PublicUser } from '@/types/user';

export type AuthorResponse = {
  id: string;
  name: string;
  avatarUrl: string | null;
  articlesAmount: number;
};
export type AuthorsApiResponse = {
  data: {
    _id: string;
    name: string;
    avatarUrl?: string;
    articlesAmount: number;
  }[];
  total: number;
  page: number;
  perPage: number;
  hasNextPage: boolean;
};

export type AuthorsResponse = {
  authors: PublicUser[];
  total: number;
  page: number;
  perPage: number;
  hasNextPage: boolean;
};


