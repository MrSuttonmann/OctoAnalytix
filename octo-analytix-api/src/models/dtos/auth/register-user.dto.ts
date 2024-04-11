import { z } from 'zod';
import { UserPassword } from 'models/user/user-password';
import { OctopusApiKey } from 'models/user/octopus-api-key';
import { OctopusAccountNumber } from 'models/account/octopus-account-number';
import { UserEmail } from 'models/user/user-email';

export const RegisterUserDto = z.object({
  name: z.string(),
  emailAddress: UserEmail,
  password: UserPassword,
  octopusApiKey: OctopusApiKey,
  octopusAccountNumber: OctopusAccountNumber
});
export type RegisterUserDto = z.infer<typeof RegisterUserDto>;
