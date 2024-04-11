import { z } from 'zod';

export const OctopusAccountNumber = z.string().regex(/^(A-)([A-Z0-9]){8}$/);
export type OctopusAccountNumber = z.infer<typeof OctopusAccountNumber>;
