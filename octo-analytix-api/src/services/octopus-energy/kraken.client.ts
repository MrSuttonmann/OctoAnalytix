import { KrakenToken, KrakenTokenMutation } from 'models/octopus-energy/kraken-token';
import { GraphQLClient } from 'graphql-request';
import { Account } from 'models/octopus-energy/account';
import { OctopusApiKey } from 'models/user/octopus-api-key';
import { OctopusAccountNumber } from 'models/account/octopus-account-number';
import { fetchAccountGql } from 'services/octopus-energy/gql/fetch-account.gql';
import { obtainKrakenTokenGql } from 'services/octopus-energy/gql/obtain-kraken-token.gql';
import { refreshKrakenTokenGql } from 'services/octopus-energy/gql/refresh-kraken-token.gql';

export class KrakenClient {

  private readonly client: GraphQLClient;
  private krakenToken: KrakenToken | null = null;

  constructor(endpoint: string) {
    this.client = new GraphQLClient(endpoint, {fetch: fetch});
  }

  public async fetchOctopusAccount(apiKey: OctopusApiKey, accountNumber: OctopusAccountNumber): Promise<Account> {
    await this.obtainKrakenToken(apiKey);
    return await this.client.request<Account>(fetchAccountGql, {accountNumber: accountNumber});
  }

  private async obtainKrakenToken(apiKey: OctopusApiKey): Promise<void> {
    let token = await this.refreshToken();
    if (!token) {
      token = (await this.client.request<KrakenTokenMutation>(obtainKrakenTokenGql, {
        apiKey: apiKey
      })).obtainKrakenToken;
    }
    this.krakenToken = token;
    this.client.setHeader('AUTHORIZATION', this.krakenToken.token);
  }

  private async refreshToken(): Promise<KrakenToken | null> {
    if (!this.krakenToken) return null;
    const now = new Date().getTime();
    const nowMinusOneMinute = now - (60 * 60000);
    // If our token is still valid
    if (this.krakenToken.payload.exp > nowMinusOneMinute) return this.krakenToken;
    // If our token has expired, but we still have a valid refresh token
    if (this.krakenToken.payload.exp < nowMinusOneMinute && this.krakenToken.refreshExpiresIn > nowMinusOneMinute) {
      return await this.client.request<KrakenToken>(refreshKrakenTokenGql, {
        refreshToken: this.krakenToken.refreshToken
      });
    }
    return null;
  }

}
