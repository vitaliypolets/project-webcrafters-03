import { ArticleEntity } from "@/types/article";

export type ArticleAuthor = {
  id: string;
  name: string;
};

export interface Article extends ArticleEntity {
  id: string;
}

export type RecommendedArticle = {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  publicationDate: string;
  category: string;
  viewsCount: number;
  author: ArticleAuthor | null;
};

export type ArticleDetailsResponse = {
  article: Article;
  author: ArticleAuthor | null;
  isBookmarked: boolean;
  recommendations: RecommendedArticle[];
};
