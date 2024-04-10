import {z} from 'zod';

export type Env = {
	DB: D1Database,
	AUTH0_DOMAIN: string, 
	AUTH0_CLIENT_ID: string,
	AUTH0_CLIENT_SECRET: string
}

export const CreateUserDto = z.object({
	name: z.string(),
	emailAddress: z.string().email("That doesn't look like a valid email address."),
	password: z.string().min(8).max(30),
	octopusApiKey: z.string().regex(/^sk_live_[a-zA-Z0-9]{24}$/, "That doesn't look like a valid Octopus API key. It should start with 'sk_live_' followed by 24 numbers and letters."),
	octopusAccountNumber: z.string().regex(/^(A-)([A-Z0-9]){8}$/, "That doesn't look like a valid Octopus account number. It should start with 'A-' followed by 8 number and capital letters."),
});
export type CreateUserDto = z.infer<typeof CreateUserDto>;

export const User = CreateUserDto.merge(z.object({
	userId: z.number().int(),
	dateCreated: z.date().max(new Date()),
}));
export type User = z.infer<typeof User>;