import { DateTime, Str } from "@cloudflare/itty-router-openapi";
import Zod from "zod";

export type Env = {
	DB: D1Database
}

export const Task = {
	name: new Str({ example: "lorem" }),
	slug: String,
	description: new Str({ required: false }),
	completed: Boolean,
	due_date: new DateTime(),
};

export const CreateUserDto = Zod.object({
	emailAddress: Zod.string(),
	password: Zod.string(),
	octopusApiKey: Zod.string(),
	octopusAccountNumber: Zod.string()
});
export type CreateUserDto = Zod.infer<typeof CreateUserDto>;

export const User = Zod.object({
	userId: Zod.number(),
	emailAddress: Zod.string(),
	octopusApiKey: Zod.string(),
	octopusAccountNumber: Zod.string(),
	dateCreated: Zod.date(),
	dateUpdated: Zod.nullable(Zod.date())
});
export type User = Zod.infer<typeof User>;