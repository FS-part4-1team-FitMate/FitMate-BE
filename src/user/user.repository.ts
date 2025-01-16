import { Injectable } from '@nestjs/common';
import type { User } from '@prisma/client';
import { PrismaService } from '#prisma/prisma.service.js';
import { IUserRepository } from '#user/interface/user.repository.interface.js';
import { CreateUser } from '#user/type/user.type.js';

@Injectable()
export class UserRepository implements IUserRepository {
  private readonly user;
  private readonly socialAccount;

  constructor(private readonly prisma: PrismaService) {
    this.user = prisma.user;
    this.socialAccount = prisma.socialAccount;
  }

  async findByEmail(email: string): Promise<User | null> {
    return await this.user.findUnique({
      where: { email },
    });
  }

  async createUser(user: CreateUser): Promise<User> {
    return await this.user.create({
      data: user,
    });
  }

  async updateUser(id: string, refreshToken: string): Promise<User> {
    return await this.user.update({
      where: { id },
      data: { refreshToken },
    });
  }

  async findUserById(id: string): Promise<User | null> {
    return await this.user.findUnique({
      where: { id },
    });
  }

  async findSocialAccount(provider: string, providerId: string) {
    return this.socialAccount.findUnique({
      where: { provider_providerId: { provider, providerId } },
      include: { user: true },
    });
  }

  async createSocialAccount(userId: string, provider: string, providerId: string) {
    return this.prisma.socialAccount.create({
      data: {
        provider,
        providerId,
        userId,
      },
    });
  }
}
