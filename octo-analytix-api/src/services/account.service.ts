import { PrismaClient } from '@prisma/client';
import { KrakenClient } from 'services/octopus-energy/kraken.client';
import { CreateAccountDto } from 'models/dtos/account/create-account.dto';
import { Account } from 'models/octopus-energy/account';
import { OctopusAccountId } from 'models/account/octopus-account-id';
import { UserService } from 'services/user.service';

export class AccountService {
  constructor(protected prisma: PrismaClient, protected kraken: KrakenClient) {
  }

  async createAccount(model: CreateAccountDto): Promise<Account> {
    const userService = new UserService(this.prisma);
    const userApiDetails = await userService.getUserOctopusApiDetails(model.userId);
    const octopusAccount = await this.kraken.fetchOctopusAccount(userApiDetails.apiKey, userApiDetails.accountNumber);
    console.log(octopusAccount);
    const baseAccount = await this.prisma.octopusAccount.create({
      data: {
        id: octopusAccount.id,
        user: {
          connect: {
            id: model.userId,
          }
        },
        created_at: octopusAccount.createdAt,
        status: octopusAccount.status,
        type: octopusAccount.accountType,
        number: octopusAccount.number,
        properties: !octopusAccount.properties ? undefined : {
          createMany: {
            data: octopusAccount.properties.map(property => {
              return {
                id: property.id,
                address: property.address,
                wan_coverage: property.wanCoverage,
              };
            })
          }
        }
      }
    });
    if (octopusAccount.properties) {
      for (let property of octopusAccount.properties) {
        await this.prisma.property.update({
          data: {
            electricity_meter_points: !property.electricityMeterPoints ? undefined : {
              createMany: {
                data: property.electricityMeterPoints?.map(emp => {
                  return {
                    id: emp.id,
                    mpan: emp.mpan,
                    status: emp.status,
                  };
                })
              }
            },
            gas_meter_points: !property.gasMeterPoints ? undefined : {
              createMany: {
                data: property.gasMeterPoints.map(gmp => {
                  return {
                    id: gmp.id,
                    mprn: gmp.mprn,
                    status: gmp.status,
                  };
                })
              }
            }
          },
          where: {
            id: baseAccount.id
          }
        });
      }
    }

    const account = await this.prisma.octopusAccount.findUnique({
      where: {
        id: baseAccount.id
      },
      include: {
        properties: {
          include: {
            electricity_meter_points: true,
            gas_meter_points: true,
          }
        }
      }
    });
    if (!account) throw new Error('Unable to find account');

    return {
      id: account.id,
      createdAt: account.created_at,
      status: account.status,
      accountType: account.type,
      number: account.number,
      properties: account.properties.map(property => {
        return {
          id: property.id,
          address: property.address,
          wanCoverage: property.wan_coverage,
          electricityMeterPoints: property.electricity_meter_points.map(emp => {
            return {
              id: emp.id,
              mpan: emp.mpan,
              status: emp.status,
            };
          }),
          gasMeterPoints: property.gas_meter_points.map(gmp => {
            return {
              id: gmp.id,
              mprn: gmp.mprn,
              status: gmp.status
            };
          })
        };
      })
    };
  }

  async getAccountById(id: OctopusAccountId): Promise<Account> {
    const account = await this.prisma.octopusAccount.findUnique({
      where: {
        id
      },
      include: {
        properties: true
      }
    });
    if (!account) throw new Error('Unable to find account');
    return {
      id: account.id,
      accountType: account.type,
      status: account.status,
      number: account.number,
      createdAt: account.created_at,
      properties: account.properties.flatMap(property => {
        return {
          id: property.id,
          address: property.address,
          wanCoverage: property.wan_coverage
        };
      })
    };
  }

}
