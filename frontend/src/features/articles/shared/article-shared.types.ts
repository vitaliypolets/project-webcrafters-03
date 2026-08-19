import type { Article } from "@/types/article";

export type ArticlesItemAction = "bookmark" | "edit";

export type BookmarkChangeHandler = (articleId: string, isBookmarked: boolean) => void;

export type BookmarkToggleHandler = (isBookmarked: boolean) => void;

export type ArticlesItemProps = {
  article: Article;
  action?: ArticlesItemAction;
  className?: string;
  onBookmarkChange?: BookmarkChangeHandler;
};

export type ArticlesListProps = {
  articles: Article[];
  action?: ArticlesItemAction;
  onBookmarkChange?: BookmarkChangeHandler;
};

export type BookmarkButtonProps = {
  articleId: string;
  isBookmarked: boolean;
  className?: string;
  label?: string;
  onBookmarkChange?: BookmarkChangeHandler;
  onBookmarkToggle?: BookmarkToggleHandler;
};

export type ModalErrorSaveProps = {
  title?: string;
  description: string;
  onClose: () => void;
};
