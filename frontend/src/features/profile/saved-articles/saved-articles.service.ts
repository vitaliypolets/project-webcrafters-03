import { api } from '@/lib/api/client';
import type { BookmarkMutationResponse, SavedArticlesPage } from './saved-articles.types';

const authHeaders = (accessToken: string) => ({
  Authorization: `Bearer ${accessToken}`,
});

export async function getSavedArticles(accessToken: string, page = 1, perPage = 12) {
  const response = await api.get<SavedArticlesPage>('/users/me/bookmarks', {
    params: { page, perPage },
    headers: authHeaders(accessToken),
  });

  return response.data;
}

export async function addSavedArticle(articleId: string, accessToken: string) {
  const response = await api.post<BookmarkMutationResponse>(
    '/users/me/bookmarks',
    { articleId },
    { headers: authHeaders(accessToken) },
  );

  return response.data;
}

export async function removeSavedArticle(articleId: string, accessToken: string) {
  const response = await api.delete<BookmarkMutationResponse>(`/users/me/bookmarks/${articleId}`, {
    headers: authHeaders(accessToken),
  });

  return response.data;
}
