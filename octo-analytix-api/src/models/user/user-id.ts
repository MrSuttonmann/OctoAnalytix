import { z } from 'zod';

export const UserId = z.number();
export type UserId = z.infer<typeof UserId>;
