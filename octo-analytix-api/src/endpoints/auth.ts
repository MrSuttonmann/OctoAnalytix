import { Email, OpenAPIRoute } from '@cloudflare/itty-router-openapi';
import { Env } from 'bindings';
import { Context, RequestBody } from 'interfaces';
import { z } from 'zod';
import { RegisterUserDto } from 'models/dtos/auth/register-user.dto';
import { UserDto } from 'models/dtos/user.dto';
import { UserSessionDto } from 'models/dtos/auth/user-session.dto';
import { LoginUserDto } from 'models/dtos/auth/login-user.dto';

function generateSalt(): string {
  return crypto.randomUUID();
}

async function hashPassword(password: string, salt: string): Promise<string> {
  const utf8 = new TextEncoder().encode(`${salt}:${password}`);
  const hashBuffer = await crypto.subtle.digest({name: 'SHA-256'}, utf8);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray
    .map(bytes => bytes.toString(16).padStart(2, '0'))
    .join('');
}

function generateToken(): string {
  return Array.from(crypto.getRandomValues(new Uint8Array(255)))
    .map(bytes => bytes.toString(16).padStart(2, '0'))
    .join('');
}

export class AuthRegister extends OpenAPIRoute {
  static schema = {
    tags: ['Auth'],
    summary: 'Register user',
    requestBody: RegisterUserDto,
    responses: {
      '200': {
        description: 'Successful response',
        schema: {
          success: Boolean, 
          result: {
            user: UserDto,
          }
        }
      },
      '400': {
        description: 'Error',
        schema: {
          success: Boolean,
          error: String
        }
      }
    }
  }
  
  async handle(request: Request, env: Env, context: Context, data: RequestBody<RegisterUserDto>) {
    try {
      let salt = generateSalt();
      let user = await context.prisma.user.create({
        data: {
          name: data.body.name,
          email: data.body.emailAddress,
          password: await hashPassword(data.body.password, salt),
          salt: salt,
          octopus_api_key: data.body.octopusApiKey,
          octopus_acc_num: data.body.octopusAccountNumber
        }
      });

      return {
        success: true,
        result: {
          email: user.email,
          name: user.name
        }
      }
      
    } catch (e) {
      return new Response(JSON.stringify({
        success: false,
        errors: e.toString()
      }), {
        headers: {
          'content-type': 'application/json'
        },
        status: 400
      })
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
        schema: {
          success: Boolean,
          result: {
            session: UserSessionDto
          }
        }
      },
      '400': {
        description: 'Error',
        schema: {
          success: Boolean, 
          errors: String
        }
      }
    }
  }
  
  async handle(request: Request, env: Env, context: Context, data: RequestBody<LoginUserDto>) {
    const user = await context.prisma.user.findUnique({
      where: {
        email: data.body.emailAddress
      },
      select: {
        id: true,
        salt: true,
        password: true
      }
    });
    
    if (!user || user.password !== await hashPassword(data.body.password, user.salt)) {
      return new Response(JSON.stringify({
        success: false,
        errors: 'Invalid password'
      }), {
        headers: {
          'content-type': 'application/json'
        },
        status: 400
      })
    }
    
    let expiration = new Date();
    expiration.setDate(expiration.getDate() + 7);
    
    const session = await context.prisma.usersSession.create({
      data: {
        user_id: user.id,
        token: generateToken(),
        expires_at: expiration.getTime()
      }
    });
    
    return {
      success: true,
      result: {
        session: {
          token: session.token,
          expires_at: session.expires_at
        }
      }
    }
  }
}

export function getBearer(request: Request): null | string {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader || authHeader.substring(0, 6) !== 'Bearer ') {
    return null;
  }
  return authHeader.substring(6).trim();
}

export async function authenticateUser(request: Request, env: Env, context: Context) {
  const token = getBearer(request);
  
  if (token) {
    const session = await context.prisma.usersSession.findFirst({
      where: {
        token: token,
        expires_at: {
          gt: new Date().getTime()
        }
      },
      select: {
        user_id: true
      }
    });

    if (!token || !session) {
      return new Response(JSON.stringify({
        success: false,
        errors: "Authentication error"
      }), {
        headers: {
          'content-type': 'application/json'
        },
        status: 401
      })
    }
    env.user_uuid = session.user_id;
  }
}