import { z } from 'zod';

export const PositiveInteger = z.number().int().min(0);
export type PositiveInteger = z.infer<typeof PositiveInteger>;
