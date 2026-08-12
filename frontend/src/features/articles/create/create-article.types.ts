// TODO: реалізувати відповідно до docs/OWNERSHIP_MAP.md

export type CreateArticleFormValues = {
 title: string;
 description: string;
 image: File | null;
 publicationDate: string;
};


export type CreatedArticle = {
 _id: string;
 title: string;
 description: string;
 imageUrl: string;
 publicationDate: string;
 authorId: string;
 authorName: string;
};

export type ArticleDraft = {
  title: string;
  description: string;
  publicationDate: string;
};


export type CreateArticleResponse = CreatedArticle;

