import type { getArticlesParams, getArticlesResponse } from './articles-catalog.types';

export const fetchArticles = async (
  params: getArticlesParams = {}
): Promise<getArticlesResponse> => {
  const {
    page = 1,
    perPage = 8,
    filter = 'all',
    authorId,
    excludeId,
    limit,
  } = params;

  const filterString = typeof filter === 'string' ? filter : 'all';

  const searchParams = new URLSearchParams();
  
  searchParams.set('page', String(Math.max(1, page)));
  searchParams.set('perPage', String(Math.max(1, perPage)));
  searchParams.set('filter', filterString);

  if (authorId) searchParams.set('authorId', authorId);
  if (excludeId) searchParams.set('excludeId', excludeId);
  if (limit && limit > 0) searchParams.set('limit', String(limit));

  const queryString = searchParams.toString();
  const endpoint = `/api/articles${queryString ? `?${queryString}` : ''}`;

  const response = await fetch(endpoint, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch articles: ${response.statusText}`);
  }

  const data: getArticlesResponse = await response.json();

  return data;
};
