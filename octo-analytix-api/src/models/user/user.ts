import { z } from 'zod';
import { UserId } from 'models/user/user-id';
import { OctopusAccountNumber } from 'models/account/octopus-account-number';
import { OctopusApiKey } from 'models/user/octopus-api-key';
import { UserSession } from 'models/user-session/user-session';
import { OctopusAccount } from 'models/account/octopus-account';
import { HashedUserPassword } from 'models/user/hashed-user-password';

export const User = z.object({
  id: UserId,
  email: z.string().email(),
  password: HashedUserPassword,
  salt: z.string(),
  name: z.string(),
  octopusApiKey: OctopusApiKey,
  octopusAccountNumber: OctopusAccountNumber,
  createdDate: z.date(),
  sessions: z.array(UserSession),
  octopusAccount: OctopusAccount.optional()
});
