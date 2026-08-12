import type { ApiResponse, PaginationMeta } from '@/types/api';
import type { Article } from '@/types/article';

type ProfileArticlesResponse<T> = Omit<ApiResponse<T>, 'message'> & {
  message?: ApiResponse<T>['message'];
};

export type ArticlesPage = ProfileArticlesResponse<Article[]> & PaginationMeta;
