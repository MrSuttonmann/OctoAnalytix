import { z } from 'zod';
import { UserSessionToken } from 'models/user-session/user-session-token';
import { PositiveInteger } from 'models/integers';

export const UserSession = z.object({
  token: UserSessionToken,
  expires_at: PositiveInteger,
});
export type UserSession = z.infer<typeof UserSession>;
