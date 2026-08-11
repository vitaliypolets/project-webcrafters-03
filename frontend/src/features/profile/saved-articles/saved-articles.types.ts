import type { Article } from '@/types/article';
import type { ArticlesPage } from '../my-articles/my-articles.types';

export type SavedArticlesPage = ArticlesPage;
export type SavedArticle = Article & { isBookmarked: true };

export type BookmarkMutationResponse = {
  data: Article | { articleId: string };
  message: string;
};
