import type { CreatorsResponse } from './home.types';

export const getTopCreators = async (): Promise<CreatorsResponse> => {
  const response = await fetch('/api/users?sort=articlesAmount&perPage=6');

  if (!response.ok) {
    throw new Error('Failed to fetch top creators');
  }

  return response.json();
};
