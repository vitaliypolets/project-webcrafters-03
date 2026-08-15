import { api } from '@/lib/api/client';
import type { CreatorsResponse, ArticlesResponse } from './home.types';

export const getTopCreators = async (): Promise<CreatorsResponse> => {
  const response = await api.get<CreatorsResponse>('/users', {
    params: { sort: 'articlesAmount', perPage: 6 },
  });

  return response.data;
};

export const getPopularArticles = async (perPage = 4): Promise<ArticlesResponse> => {
  const response = await api.get<ArticlesResponse>('/articles', {
    params: { filter: 'popular', perPage },
  });

  return response.data;
};
