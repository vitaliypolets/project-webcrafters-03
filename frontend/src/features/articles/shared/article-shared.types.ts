import type { Article } from '@/types/article';

export type ArticlesItemProps = {
  article: Article;
};

export type ArticlesListProps = {
  articles: Article[];
};

export type BookmarkButtonProps = {
  isBookmarked: boolean;
  onToggle: () => void;
};

export type ModalErrorSaveProps = {
  message: string;
  onClose: () => void;
};
