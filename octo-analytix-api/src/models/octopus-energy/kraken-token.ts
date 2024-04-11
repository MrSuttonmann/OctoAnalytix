import { z } from 'zod';
import { PositiveInteger } from 'models/integers';

export const KrakenToken = z.object({
  token: z.string(),
  payload: z.object({
    sub: z.string(),
    gty: z.string(),
    email: z.string().email(),
    tokenUse: z.string(),
    iss: PositiveInteger,
    iat: PositiveInteger,
    exp: PositiveInteger,
    origIat: PositiveInteger,
  }),
  refreshToken: z.string(),
  refreshExpiresIn: PositiveInteger,
});
export type KrakenToken = z.infer<typeof KrakenToken>;

export const KrakenTokenMutation = z.object({
  obtainKrakenToken: KrakenToken
});
export type KrakenTokenMutation = z.infer<typeof KrakenTokenMutation>;
