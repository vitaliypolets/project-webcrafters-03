import { api } from '@/lib/api/client';
import type { ApiResponse, PaginationMeta } from '@/types/api';
import type { Article } from '@/types/article';
import type { PublicUser } from '@/types/user';
import type { ArticlesPage } from './my-articles.types';

type ArticleWithoutAuthor = Omit<Article, 'author'> & {
  author?: Article['author'];
};

type ArticlesApiPage = Omit<ApiResponse<ArticleWithoutAuthor[]>, 'message'> &
  PaginationMeta & {
    message?: ApiResponse<ArticleWithoutAuthor[]>['message'];
  };

export async function getMyArticles(
  userId: string,
  author: PublicUser,
  page = 1,
  perPage = 12,
): Promise<ArticlesPage> {
  const response = await api.get<ArticlesApiPage>(`/users/${userId}/articles`, {
    params: { page, perPage },
  });

  return {
    ...response.data,
    data: response.data.data.map((article) => ({
      ...article,
      author: article.author ?? author,
    })),
  };
}
