import { ElectricityMeterPoint } from 'models/octopus-energy/electricity-meter-point';
import { GasMeterPoint } from 'models/octopus-energy/gas-meter-point';
import { z } from 'zod';

export const Property = z.object({
  id: z.string(),
  address: z.string(),
  wanCoverage: z.string(),
  electricityMeterPoints: z.array(ElectricityMeterPoint).optional(),
  gasMeterPoints: z.array(GasMeterPoint).optional()
});
export type Property = z.infer<typeof Property>;
