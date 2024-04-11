import { OpenAPIRoute } from '@cloudflare/itty-router-openapi';
import { Env } from 'bindings';
import { Context, RequestData } from 'interfaces';
import { LoginUserDto } from 'models/dtos/auth/login-user.dto';
import { UserService } from 'services/user.service';
import { UserSessionService } from 'services/user-session.service';
import { RegisterUserDto } from 'models/dtos/auth/register-user.dto';
import { RegisterUserResultDto } from 'models/dtos/auth/register-user-result.dto';
import { LoginUserResultDto } from 'models/dtos/auth/login-user-result.dto';
import { ErrorResponseDto } from 'models/dtos/api-response';

export class AuthRegister extends OpenAPIRoute {
  static schema = {
    tags: ['Auth'],
    summary: 'Register user',
    requestBody: RegisterUserDto,
    responses: {
      '200': {
        description: 'Successful response',
        schema: RegisterUserResultDto,
      },
      '400': {
        description: 'Error',
        schema: ErrorResponseDto,
      }
    }
  };

  async handle(request: Request, env: Env, context: Context, data: RequestData<RegisterUserDto>) {
    if (!data.body) throw new Error('Invalid body');
    try {
      const userService = new UserService(context.prisma);
      const user = await userService.createUser(data.body);
      await env.POP_ACCOUNT_QUEUE.send({
        user: {
          id: user.id,
          octopusApiKey: data.body.octopusApiKey,
          octopusAccountNumber: user.octopusAccountNumber
        }
      });

      return {
        success: true,
        result: {
          id: user.id,
          email: user.email,
          name: user.name
        }
      };

    } catch (e) {
      return new Response(JSON.stringify({
        success: false,
        errors: e instanceof Error ? e.message : 'An error occurred'
      }), {
        headers: {
          'content-type': 'application/json'
        },
        status: 400
      });
    }
  }
}

export class AuthLogin extends OpenAPIRoute {
  static schema = {
    tags: ['Auth'],
    summary: 'Login user',
    requestBody: LoginUserDto,
    responses: {
      '200': {
        description: 'Successful response',
        schema: LoginUserResultDto
      },
      '400': {
        description: 'Error',
        schema: ErrorResponseDto
      }
    }
  };

  async handle(request: Request, env: Env, context: Context, data: RequestData<LoginUserDto>) {
    if (!data.body) throw new Error('Invalid body');
    const userService = new UserService(context.prisma);
    const userSessionService = new UserSessionService(context.prisma);
    const user = await userService.getUserByEmail(data.body.emailAddress);
    const passwordValid = await userService.verifyUserPassword(user.id, data.body.password);
    console.log(passwordValid);
    if (!passwordValid) {
      return new Response(JSON.stringify({
        success: false,
        errors: 'Invalid password'
      }), {
        headers: {
          'content-type': 'application/json'
        },
        status: 400
      });
    }

    const session = await userSessionService.createUserSession(user.id);
    return {
      success: true,
      result: {
        session
      }
    };
  }
}

export function getBearer(request: Request): null | string {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader || authHeader.substring(0, 6) !== 'Bearer') {
    return null;
  }
  return authHeader.substring(6).trim();
}

export async function authenticateUser(request: Request, env: Env, context: Context, data: unknown) {
  const userSessionService = new UserSessionService(context.prisma);
  const token = getBearer(request);

  if (token) {
    const session = await userSessionService.getUserSession(token);
    if (!token || !session) {
      return new Response(JSON.stringify({
        success: false,
        errors: 'Authentication error'
      }), {
        headers: {
          'content-type': 'application/json'
        },
        status: 401
      });
    }
    env.user_uuid = session.userId;
  }
}
