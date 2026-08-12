// TODO: реалізувати відповідно до docs/OWNERSHIP_MAP.md
import { CreatorsResponse } from './home.types';

export const getTopCreators = async (): Promise<CreatorsResponse> => {
  const response = await fetch('/api/users?sort=popular&perPage=6');

  if (!response.ok) {
    throw new Error('Failed to fetch top creators');
  }

  return response.json();
};
