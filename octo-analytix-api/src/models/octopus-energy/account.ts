import { Property } from 'models/octopus-energy/property';
import { z } from 'zod';

export const Account = z.object({
  id: z.string(),
  createdAt: z.date(),
  number: z.string(),
  accountType: z.string(),
  status: z.string(),
  properties: z.array(Property).optional(),
});
export type Account = z.infer<typeof Account>;

