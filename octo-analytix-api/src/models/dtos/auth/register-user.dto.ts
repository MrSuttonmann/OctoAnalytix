import { z } from 'zod';

export const RegisterUserDto = z.object({
  name: z.string(),
  emailAddress: z.string().email('That doesn\'t look like a valid email address.'),
  password: z.string().min(8).max(30),
  octopusApiKey: z.string().regex(/^sk_live_[a-zA-Z0-9]{24}$/),
  octopusAccountNumber: z.string().regex(/^(A-)([A-Z0-9]){8}$/),
})
export type RegisterUserDto = z.infer<typeof RegisterUserDto>;