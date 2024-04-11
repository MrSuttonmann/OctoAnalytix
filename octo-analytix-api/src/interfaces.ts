import { ExecutionContext } from '@cloudflare/workers-types';
import { PrismaClient } from '@prisma/client';
import { KrakenClient } from 'services/octopus-energy/kraken.client';

export interface Context {
  executionContext: ExecutionContext;
  prisma: PrismaClient,
  kraken: KrakenClient
}

export interface RequestData<T> {
  body?: T,
  query?: Record<string, any>,
  params?: Record<string, any>
}
