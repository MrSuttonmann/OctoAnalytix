import { z } from 'zod';
import { UserSession } from 'models/user-session/user-session';
import { ResponseDto } from 'models/dtos/api-response';

export const LoginUserResultDto = z.object({
  result: z.object({session: UserSession})
}).merge(ResponseDto);
export type LoginUserResultDto = z.infer<typeof LoginUserResultDto>;
