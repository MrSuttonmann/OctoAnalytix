import { z } from 'zod';
import { ResponseDto } from 'models/dtos/api-response';

export const AccountResponseDto = z.object({
  result: z.object({
    id: z.string(),
  })
}).merge(ResponseDto);
export type AccountResponseDto = z.infer<typeof AccountResponseDto>;
