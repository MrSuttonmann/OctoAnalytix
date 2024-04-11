import { z } from 'zod';
import { UserSessionToken } from 'models/user-session/user-session-token';
import { UserId } from 'models/user/user-id';

export const UserSessionDto = z.object({
  token: UserSessionToken,
  expiresAt: z.number().int(),
  userId: UserId.optional()
});
export type UserSessionDto = z.infer<typeof UserSessionDto>;
