import { api } from '@/lib/api/client';
import type { PublicUser } from '@/types/user';
import type { ArticleApiItem, ArticlesPage } from './my-articles.types';

type ArticlesApiPage = Omit<ArticlesPage, 'data'> & { data: ArticleApiItem[] };

export async function getMyArticles(userId: string, author: PublicUser, page = 1, perPage = 12) {
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
