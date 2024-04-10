import { z } from 'zod';

export const UserDto = z.object({
  name: z.string(),
  emailAddress: z.string().email(),
  password: z.string().min(8).max(30),
  octopusApiKey: z.string().regex(/^sk_live_[a-zA-Z0-9]{24}$/),
  octopusAccountNumber: z.string().regex(/^(A-)([A-Z0-9]){8}$/),
})
export type UserDto = z.infer<typeof UserDto>;