// TODO: реалізувати відповідно до docs/OWNERSHIP_MAP.md

export type CreateArticleFormValues = {
  title: string;
  article: string;
  image: File | null;
  publicationDate: string;
};

export type CreatedArticle = {
  id: string;
  title: string;
  description: string;
  article: string;
  imageUrl: string;
  publicationDate: string;
  authorId: string;
  authorName: string;
  viewsCount: number;
  category: 'popular' | 'general';
};

export type CreateArticleResponse = CreatedArticle;

export type ArticleDraft = {
  title: string;
  article: string;
  publicationDate: string;
};

