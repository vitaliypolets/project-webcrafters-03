// TODO (учасник №5): request validation
import { z } from 'zod';

export const updateMeSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'Name must be at least 2 characters')
    .max(32, 'Name must be at most 32 characters')
    .regex(
      /^[A-Za-zА-Яа-яІіЇїЄєҐґ\s'-]+$/,
      'Name can contain only letters',
    )
    .optional(),
});
