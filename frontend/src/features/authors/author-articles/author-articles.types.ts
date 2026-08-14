import type { Article } from '@/types/article';
import type { PublicUser } from '@/types/user';

export type AuthorArticlesProps = {
  userId: string;
  author: PublicUser;
};

export type AuthorArticleApiItem = Pick<
  Article,
  'id' | 'title' | 'description' | 'imageUrl' | 'publicationDate'
>;

export type UserArticlesPage = {
  data: AuthorArticleApiItem[];
  page: number;
  perPage: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
};
