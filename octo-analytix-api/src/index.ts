import { OpenAPIRouter } from '@cloudflare/itty-router-openapi';
import { Env } from 'bindings';
import { Context } from 'interfaces';
import { authenticateUser, AuthLogin, AuthRegister } from 'endpoints/auth';
import { PrismaD1 } from '@prisma/adapter-d1';
import { PrismaClient } from '@prisma/client';
import { ExecutionContext, MessageBatch } from '@cloudflare/workers-types';
import { KrakenClient } from 'services/octopus-energy/kraken.client';
import { CreateAccountDto } from 'models/dtos/account/create-account.dto';
import { AccountService } from 'services/account.service';
import { CreateAccount, GetAccount } from 'endpoints/account';

export const router = OpenAPIRouter({
  schema: {
    info: {
      title: 'OctoAnalytix API',
      version: '1.0',
    },
  },
  docs_url: '/',
});

router.registry.registerComponent('securitySchemes', 'bearerAuth', {
  type: 'http',
  scheme: 'bearer'
});

// Endpoints that don't require auth
router.post('/api/auth/register', AuthRegister);
router.post('/api/auth/login', AuthLogin);

// Authentication middleware
router.all('/api/*', authenticateUser);

// Endpoints that require auth
router.get('/api/account/create', CreateAccount);
router.get('/api/account/:id', GetAccount);

// 404 for everything else
router.all('*', () =>
  Response.json(
    {
      success: false,
      error: 'Route not found',
    },
    {status: 404}
  )
);

const calculateExponentialBackoff = (attempts: number, baseDelaySeconds: number) => {
  return baseDelaySeconds ** attempts;
};
export default {
  fetch: async (request: Request, env: Env, executionContext: ExecutionContext) => {
    const adapter = new PrismaD1(env.DB);
    const prisma = new PrismaClient({adapter, log: ['info']});
    const kraken = new KrakenClient(env.OCTOPUS_GRAPHQL_ENDPOINT);
    return router.handle(request, env, {
      executionContext,
      prisma,
      kraken
    } satisfies Context);
  },
  queue: async (batch: MessageBatch, env: Env, executionContext: ExecutionContext) => {
    const BASE_DELAY_SECONDS = 30;
    switch (batch.queue) {
      case 'pop-account-queue':
        const prisma = new PrismaClient({adapter: new PrismaD1(env.DB)});
        const kraken = new KrakenClient(env.OCTOPUS_GRAPHQL_ENDPOINT);
        const accountService = new AccountService(prisma, kraken);
        for (const message of batch.messages) {
          let model = message.body as CreateAccountDto;
          try {
            await accountService.createAccount(model);
          } catch {
            message.retry({delaySeconds: calculateExponentialBackoff(message.attempts, BASE_DELAY_SECONDS)});
          }
        }
    }
  }
};
