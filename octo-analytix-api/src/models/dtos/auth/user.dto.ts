import { z } from 'zod';
import { UserId } from 'models/user/user-id';
import { UserEmail } from 'models/user/user-email';
import { OctopusAccountNumber } from 'models/account/octopus-account-number';
import { Property } from 'models/octopus-energy/property';

export const UserDto = z.object({
  id: UserId,
  name: z.string(),
  email: UserEmail,
  octopusAccountNumber: OctopusAccountNumber,
  properties: z.array(Property).optional()
});
export type UserDto = z.infer<typeof UserDto>;
