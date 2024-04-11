import { z } from 'zod';

export const OctopusAccountId = z.string();
export type OctopusAccountId = z.infer<typeof OctopusAccountId>;
