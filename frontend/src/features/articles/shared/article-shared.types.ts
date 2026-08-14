import type { Article } from '@/types/article';

export type ArticlesItemProps = {
  article: Article;
};

export type ArticlesListProps = {
  articles: Article[];
};

export type BookmarkButtonProps = {
  articleId: string;
  isBookmarked: boolean;
  className?: string;
};

export type ModalErrorSaveProps = {
  title?: string;
  description: string;
  onClose: () => void;
};
