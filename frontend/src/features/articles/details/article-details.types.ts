import { ArticleEntity } from "@/types/article";

export type ArticleAuthor = {
  _id: string;
  name: string;
};

export type RecommendedArticle = {
  _id: string;
  title: string;
  description: string;
  imageUrl: string;
  publicationDate: string;
  category: string;
  viewsCount: number;
  author: ArticleAuthor | null;
};

export type ArticleDetailsResponse = {
  article: ArticleEntity;
  author: ArticleAuthor | null;
  isBookmarked: boolean;
  recommendations: RecommendedArticle[];
};
