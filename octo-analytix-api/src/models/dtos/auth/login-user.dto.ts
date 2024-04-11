import { z } from 'zod';
import { UserPassword } from 'models/user/user-password';
import { UserEmail } from 'models/user/user-email';

export const LoginUserDto = z.object({
  emailAddress: UserEmail,
  password: UserPassword
});
export type LoginUserDto = z.infer<typeof LoginUserDto>;
