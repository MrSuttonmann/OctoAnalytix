import { gql } from 'graphql-request';

export const obtainKrakenTokenGql = gql`
    mutation obtainKrakenToken($apiKey: String!) {
        obtainKrakenToken(input: {APIKey: $apiKey}) {
            token
            payload
            refreshToken
            refreshExpiresIn
        }
    }
`;
