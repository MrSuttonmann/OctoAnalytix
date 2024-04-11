import { z } from 'zod';

export const GasMeterPoint = z.object({
  id: z.string(),
  mprn: z.string(),
  status: z.string(),
})
export type ElectricityMeterPoint = z.infer<typeof GasMeterPoint>;