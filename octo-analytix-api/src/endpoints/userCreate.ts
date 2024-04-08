import { OpenAPIRoute, OpenAPIRouteSchema } from "@cloudflare/itty-router-openapi";
import { UserService } from "services/user.service";
import { Env, CreateUserDto, User } from "types";

export class UserCreate extends OpenAPIRoute {
    static schema: OpenAPIRouteSchema = {
        tags: ["Users"],
        summary: "Create a new User",
        requestBody: CreateUserDto,
        responses: {
            "200": {
                description: "Returns the created user",
                schema: {
                    success: Boolean,
                    result: {
                        user: User
                    }
                }
            }
        }
    };

    async handle(
        request: Request,
        env: Env,
        context: any,
        data: Record<string, any>
    ) {
        const userToCreate = data.body;
        const userService = new UserService(env.DB);

        const user = await userService.createUser(await request.json())

        return {
            success: true,
            result: {
                user: user
            }
        }
    }
}