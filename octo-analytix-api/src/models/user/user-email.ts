import { z } from 'zod';

export const UserEmail = z.string().email();
export type UserEmail = z.infer<typeof UserEmail>;
