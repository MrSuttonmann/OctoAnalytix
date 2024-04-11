import { CreateAccountDto } from 'models/dtos/account/create-account.dto';

export type Env = {
  DB: D1Database,
  user_uuid?: number
  OCTOPUS_GRAPHQL_ENDPOINT: string;
  POP_ACCOUNT_QUEUE: Queue<CreateAccountDto>;
};
