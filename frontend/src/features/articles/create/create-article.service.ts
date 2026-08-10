// TODO: реалізувати відповідно до docs/OWNERSHIP_MAP.md
import axios from 'axios';

import type {
  CreateArticleFormValues,
  CreateArticleResponse,
} from './create-article.types';

export const createArticle = async (
  values: CreateArticleFormValues,
): Promise<CreateArticleResponse> => {
  const formData = new FormData();

  formData.append('title', values.title);
  formData.append('description', values.description);
  formData.append('publicationDate', values.publicationDate);

  if (values.image) {
    formData.append('image', values.image);
  }

  const response = await axios.post<CreateArticleResponse>(
    '/api/articles',
    formData,
  );

  return response.data;
};
