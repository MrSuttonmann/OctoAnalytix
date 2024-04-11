import { z } from 'zod';
import { UserId } from 'models/user/user-id';
import { UserEmail } from 'models/user/user-email';
import { ResponseDto } from 'models/dtos/api-response';

export const RegisterUserResultDto = z.object({
  result: z.object({
    id: UserId,
    email: UserEmail,
    name: z.string()
  })
}).merge(ResponseDto);
export type RegisterUserResultDto = z.infer<typeof RegisterUserResultDto>;
