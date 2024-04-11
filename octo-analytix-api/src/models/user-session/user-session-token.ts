import { z } from 'zod';

export const UserSessionToken = z.string();
export type UserSessionToken = z.infer<typeof UserSessionToken>;
