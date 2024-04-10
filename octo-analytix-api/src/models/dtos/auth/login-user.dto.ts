import { z } from 'zod';

export const LoginUserDto = z.object({
  emailAddress: z.string().email(),
  password: z.string().min(8).max(30)
})
export type LoginUserDto = z.infer<typeof LoginUserDto>;