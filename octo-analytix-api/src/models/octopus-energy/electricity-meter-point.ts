import { z } from 'zod';

export const ElectricityMeterPoint = z.object({
  id: z.string(),
  mpan: z.string(),
  status: z.string(),
})
export type ElectricityMeterPoint = z.infer<typeof ElectricityMeterPoint>;