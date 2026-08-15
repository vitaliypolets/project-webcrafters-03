import type { Article } from '@/types/article';

export interface Creator {
  id: string;
  name: string;
  avatarUrl: string | null;
  articlesAmount: number;
}

export interface CreatorsResponse {
  data: Creator[];
  total: number;
  page: number;
  perPage: number;
  hasNextPage: boolean;
}

export interface ArticlesResponse {
  articles: Article[];
  page: number;
  perPage: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
}
