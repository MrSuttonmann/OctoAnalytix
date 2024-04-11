import { z } from 'zod';
import { OctopusApiKey } from 'models/user/octopus-api-key';
import { OctopusAccountNumber } from 'models/account/octopus-account-number';

export const UserOctopusApiDetails = z.object({
  apiKey: OctopusApiKey,
  accountNumber: OctopusAccountNumber
});
export type UserOctopusApiDetails = z.infer<typeof UserOctopusApiDetails>;
