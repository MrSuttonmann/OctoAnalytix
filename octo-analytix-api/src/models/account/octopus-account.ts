import { z } from 'zod';
import { OctopusAccountId } from 'models/account/octopus-account-id';
import { OctopusAccountNumber } from 'models/account/octopus-account-number';
import { Property } from 'models/octopus-energy/property';

export const OctopusAccount = z.object({
  id: OctopusAccountId,
  number: OctopusAccountNumber,
  type: z.string(),
  status: z.string(),
  createdAt: z.date(),
  properties: z.array(Property)
});
export type OctopusAccount = z.infer<typeof OctopusAccount>;
