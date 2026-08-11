import { apiRequest } from '@/lib/api/client';
import { ArticleDetailsResponse } from './article-details.types';

const getBaseUrl = () => {
  if (typeof window !== 'undefined') return '';
  return process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
};

export const fetchArticleById = async (articleId: string): Promise<ArticleDetailsResponse> => {
  if (typeof window === 'undefined') {
    const baseUrl = getBaseUrl();
    const res = await fetch(`${baseUrl}/api/articles/${articleId}`, {
      cache: 'no-store',
    });
    
    if (!res.ok) {
      throw new Error(`Failed to fetch article: ${res.status}`);
    }
    
    return res.json();
  }
  return await apiRequest<ArticleDetailsResponse>(`/articles/${articleId}`);
};
