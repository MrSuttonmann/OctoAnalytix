import { gql } from 'graphql-request';

export const fetchAccountGql = gql`
    query fetchAccount($accountNumber: String!) {
        account(accountNumber: $accountNumber) {
            id
            createdAt
            number
            accountType
            status
            properties {
                id
                address
                wanCoverage
                electricityMeterPoints {
                    id
                    mpan
                    status
                }
                gasMeterPoints {
                    id
                    mprn
                    status
                }
            }
        }
    }
`;
