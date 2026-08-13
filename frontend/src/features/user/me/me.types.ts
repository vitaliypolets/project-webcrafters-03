import type { User } from "@/types/user";

export type CurrentUserResponse = {
  success: boolean;
  data: User;
};

export type UpdateMeRequest = {
  name?: string;
};

export type UpdateMeResponse = {
  success: boolean;
  data: User;
};
