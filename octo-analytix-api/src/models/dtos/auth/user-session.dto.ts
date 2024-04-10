import { z } from 'zod';

export const UserSessionDto = z.object({
  token: z.string(),
  expiresIn: z.number().int()
})
export type UserSessionDto = z.infer<typeof UserSessionDto>;