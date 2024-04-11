import { z } from 'zod';
import { UserId } from 'models/user/user-id';

export const CreateAccountDto = z.object({
  userId: UserId,
});
export type CreateAccountDto = z.infer<typeof CreateAccountDto>;


