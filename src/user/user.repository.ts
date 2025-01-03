import { Injectable } from '@nestjs/common';
import type { User } from '@prisma/client';
import { PrismaService } from '#prisma/prisma.service.js';
import { IUserRepository } from '#user/interface/user.repository.interface.js';
import type { CreateUser, PatchUser } from '#user/type/user.type.js';

@Injectable()
export class UserRepository implements IUserRepository {
  private readonly user;

  constructor(private readonly prisma: PrismaService) {
    this.user = prisma.user;
  }

  async findUserById(id: string): Promise<User | null> {
    return await this.user.findUnique({
      where: { id },
    });
  }

  async createUser(data: CreateUser): Promise<User> {
    return await this.user.create({
      data,
    });
  }

  async updateUser(data: PatchUser, id: string): Promise<User> {
    return await this.user.update({
      where: { id },
      data,
    });
  }

  async deleteUser(id: string): Promise<User> {
    return await this.user.delete({
      where: { id },
    });
  }
}
