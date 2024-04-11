import { PrismaClient } from '@prisma/client';
import { UserId } from 'models/user/user-id';
import { UserSessionToken } from 'models/user-session/user-session-token';
import { UserSessionDto } from 'models/dtos/auth/user-session.dto';

export class UserSessionService {
  constructor(protected prisma: PrismaClient) {
  }

  private generateToken(): UserSessionToken {
    return Array.from(crypto.getRandomValues(new Uint8Array(255)))
      .map(bytes => bytes.toString(16).padStart(2, '0'))
      .join('');
  }

  async getUserSession(token: UserSessionToken): Promise<UserSessionDto | null> {
    const session = await this.prisma.usersSession.findFirst({
      where: {
        token,
        expires_at: {
          gt: new Date().getTime()
        }
      },
      include: {
        user: {
          select: {
            id: true
          }
        }
      }
    });
    if (!session) return null;
    return {
      token: session.token,
      expiresAt: session.expires_at,
      userId: session.user.id
    };
  }

  async createUserSession(userId: UserId): Promise<UserSessionDto> {
    const token = this.generateToken();
    const expiration = new Date();
    expiration.setDate(expiration.getDate() + 7);
    const session = await this.prisma.usersSession.create({
      data: {
        user: {
          connect: {
            id: userId
          }
        },
        token,
        expires_at: expiration.getTime()
      },
      select: {
        token: true,
        expires_at: true
      }
    });
    if (!session) throw new Error('Unable to create new user session');
    return {
      token: session.token,
      expiresAt: session.expires_at
    };
  }
}
