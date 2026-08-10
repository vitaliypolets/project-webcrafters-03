import type { Article } from '@/types/article';
import type { PublicUser } from '@/types/user';

export type AuthorArticlesProps = {
  userId: string;
  author: PublicUser;
};

export type AuthorArticleApiItem = Omit<Article, 'author'> & {
  author?: Article['author'];
  authorId: string;
  viewsCount: number;
  category: string;
};

export type UserArticlesPage = {
  data: AuthorArticleApiItem[];
  page: number;
  perPage: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
};
