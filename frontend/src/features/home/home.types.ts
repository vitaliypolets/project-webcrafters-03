import type { Article } from "@/types/article";
import type { PaginatedResponse } from "@/types/api";

export interface Creator {
  id: string;
  name: string;
  avatarUrl: string | null;
  articlesAmount: number;
}

export type CreatorsResponse = PaginatedResponse<Creator>;
export type ArticlesResponse = PaginatedResponse<Article>;
