import type { Article } from '@/types/article';

export type ArticlesPage = {
  data: Article[];
  page: number;
  perPage: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  message?: string;
};

export type ArticleApiItem = Omit<Article, 'author'> & {
  author?: Article['author'];
  authorId?: string;
  authorName?: string;
};
