import { gql } from 'graphql-request';

export const refreshKrakenTokenGql = gql`
    mutation refreshKrakenToken($refreshToken: String!) {
        obtainKrakenToken(input: {refreshToken: $refreshToken}) {
            token
            payload
            refreshToken
            refreshExpiresIn
        }
    }`;
