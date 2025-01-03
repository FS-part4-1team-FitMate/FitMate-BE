import { Injectable } from '@nestjs/common';
import type { User } from '@prisma/client';
import { UserNotFoundException } from '#exception/http-exception.js';
import { IUserService } from '#user/interface/user.service.interface.js';
import type { CreateUser, PatchUser } from '#user/type/user.type.js';
import { UserRepository } from '#user/user.repository.js';

@Injectable()
export class UserService implements IUserService {
  constructor(private readonly userRepository: UserRepository) {}

  async findUserById(id: string) {
    const user = await this.userRepository.findUserById(id);
    if (!user) throw new UserNotFoundException();
    return user;
  }

  async createUser(data: CreateUser): Promise<User> {
    return await this.userRepository.createUser(data);
  }

  async updateUser(id: string, data: PatchUser): Promise<User> {
    const user = await this.userRepository.findUserById(id);
    if (!user) throw new UserNotFoundException();
    return await this.userRepository.updateUser(data, id);
  }

  async deleteUser(id: string): Promise<User> {
    const user = await this.userRepository.findUserById(id);
    if (!user) throw new UserNotFoundException();
    return await this.userRepository.deleteUser(id);
  }
}
