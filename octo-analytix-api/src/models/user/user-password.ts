import { z } from 'zod';

export const UserPassword = z.string().min(8).max(30);
export type UserPassword = z.infer<typeof UserPassword>;
