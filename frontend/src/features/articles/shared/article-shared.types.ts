import type { Article } from "@/types/article";

export type ArticlesItemAction = "bookmark" | "edit";

export type ArticlesItemProps = {
  article: Article;
  action?: ArticlesItemAction;
};

export type ArticlesListProps = {
  articles: Article[];
  action?: ArticlesItemAction;
};

export type BookmarkButtonProps = {
  articleId: string;
  isBookmarked: boolean;
  className?: string;
  label?: string;
};

export type ModalErrorSaveProps = {
  title?: string;
  description: string;
  onClose: () => void;
};
