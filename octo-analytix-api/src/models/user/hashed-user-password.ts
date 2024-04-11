import { z } from 'zod';

export const HashedUserPassword = z.string();
export type HashedUserPassword = z.infer<typeof HashedUserPassword>;
