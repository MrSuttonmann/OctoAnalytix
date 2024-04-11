import { PrismaClient } from '@prisma/client';
import { RegisterUserDto } from 'models/dtos/auth/register-user.dto';
import { UserPassword } from 'models/user/user-password';
import { UserSalt } from 'models/user/user-salt';
import { UserEmail } from 'models/user/user-email';
import { HashedUserPassword } from 'models/user/hashed-user-password';
import { UserDto } from 'models/dtos/auth/user.dto';
import { UserId } from 'models/user/user-id';
import { UserOctopusApiDetails } from 'models/user/user-octopus-api-details';

export class UserService {
  constructor(protected prisma: PrismaClient) {
  }

  private generateSalt(): UserSalt {
    return crypto.randomUUID();
  }

  private async hashPassword(password: UserPassword, salt: UserSalt): Promise<HashedUserPassword> {
    const utf8 = new TextEncoder().encode(`${salt}:${password}`);
    const hashBuffer = await crypto.subtle.digest({name: 'SHA-256'}, utf8);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray
      .map(bytes => bytes.toString(16).padStart(2, '0'))
      .join('');
  }

  async createUser(model: RegisterUserDto): Promise<UserDto> {
    const salt = this.generateSalt();
    const user = await this.prisma.user.create({
      data: {
        name: model.name,
        email: model.emailAddress,
        password: await this.hashPassword(model.password, salt),
        salt,
        octopus_api_key: model.octopusApiKey,
        octopus_acc_num: model.octopusAccountNumber
      }
    });
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      octopusAccountNumber: user.octopus_acc_num
    };
  }

  async getUserByEmail(email: UserEmail): Promise<UserDto> {
    const user = await this.prisma.user.findUnique({
      where: {
        email
      }
    });
    if (!user) throw new Error('Unable to find user');
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      octopusAccountNumber: user.octopus_acc_num
    };
  }

  async verifyUserPassword(userId: UserId, password: UserPassword): Promise<boolean> {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId
      },
      select: {
        salt: true,
        password: true
      }
    });
    if (!user) throw new Error('Unable to find user');
    console.log(user.password, await this.hashPassword(password, user.salt));
    const hashedPassword = await this.hashPassword(password, user.salt);
    return user.password === hashedPassword;
  }

  async getUserOctopusApiDetails(userId: UserId): Promise<UserOctopusApiDetails> {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        octopus_api_key: true,
        octopus_acc_num: true
      }
    });
    if (!user) throw new Error('Unable to find user');
    return {
      apiKey: user.octopus_api_key,
      accountNumber: user.octopus_acc_num
    };
  }
}
