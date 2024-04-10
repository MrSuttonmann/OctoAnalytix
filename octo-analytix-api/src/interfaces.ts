import { PrismaClient } from '@prisma/client';

export interface Context {
  executionContext: ExecutionContext;
  prisma: PrismaClient
}