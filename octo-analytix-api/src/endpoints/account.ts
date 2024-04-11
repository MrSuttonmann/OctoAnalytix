import { OpenAPIRoute, OpenAPIRouteSchema, Path, Query } from '@cloudflare/itty-router-openapi';
import { ErrorResponseDto } from 'models/dtos/api-response';
import { Env } from 'bindings';
import { Context, RequestData } from 'interfaces';
import { AccountService } from 'services/account.service';
import { OctopusAccountId } from 'models/account/octopus-account-id';
import { AccountResponseDto } from 'models/dtos/account/account-response.dto';
import { UserId } from 'models/user/user-id';

export class GetAccount extends OpenAPIRoute {
  static schema: OpenAPIRouteSchema = {
    tags: ['Account'],
    summary: 'Get Account',
    parameters: {
      accountId: Path(OctopusAccountId)
    },
    security: [
      {
        bearerAuth: []
      }
    ],
    responses: {
      '200': {
        description: 'Successful response',
        schema: AccountResponseDto
      },
      '400': {
        description: 'Error',
        schema: ErrorResponseDto
      }
    }
  };

  async execute(request: Request, env: Env, context: Context, data: RequestData<void>): Promise<AccountResponseDto | Response> {
    const accountService = new AccountService(context.prisma, context.kraken);
    const account = await accountService.getAccountById(data.params?.accountId);
    if (!account) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Account not found'
      }));
    }
    return {
      success: true,
      result: {
        id: account.id
      }
    };
  }
}

export class CreateAccount extends OpenAPIRoute {
  static schema: OpenAPIRouteSchema = {
    tags: ['Account'],
    summary: 'Fetches data from Octopus Energy and creates an Account. Only use if the automatic creation failed.',
    parameters: {
      userId: Query(UserId)
    },
    security: [
      {
        bearerAuth: []
      }
    ],
    responses: {
      '200': {
        description: 'Successful response',
        schema: AccountResponseDto
      },
      '400': {
        description: 'Error',
        schema: ErrorResponseDto
      }
    }
  };

  async execute(request: Request, env: Env, context: Context, data: RequestData<void>): Promise<AccountResponseDto | Response> {
    const accountService = new AccountService(context.prisma, context.kraken);
    const account = await accountService.createAccount({
      userId: parseInt(new URL(request.url).searchParams.get('userId') ?? '', 10)
    });
    if (!account) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Unable to create account'
      }));
    }
    return {
      success: true,
      result: {
        id: account.id,
      }
    };
  }
}
