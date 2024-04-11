import { z } from 'zod';

export const ResponseDto = z.object({
  success: z.boolean(),
});
export type ResponseDto = z.infer<typeof ResponseDto>;

export const ErrorResponseDto = z.object({
  error: z.string().nullable()
}).merge(ResponseDto);
export type ErrorResponseDto = z.infer<typeof ErrorResponseDto>;
