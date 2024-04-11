import { z } from 'zod';

export const OctopusApiKey = z.string().regex(/^sk_live_[a-zA-Z0-9]{24}$/);
export type OctopusApiKey = z.infer<typeof OctopusApiKey>;
