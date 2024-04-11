import { z } from 'zod';

export const UserSalt = z.string();
export type UserSalt = z.infer<typeof UserSalt>;
