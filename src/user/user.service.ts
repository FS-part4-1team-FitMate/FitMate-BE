import { Injectable } from '@nestjs/common';
import { UserNotFoundException } from '#exception/http-exception.js';
import type { FilterUser } from '#auth/type/auth.type.js';
import { IUserService } from '#user/interface/user.service.interface.js';
import { UserRepository } from '#user/user.repository.js';

@Injectable()
export class UserService implements IUserService {
  constructor(private readonly userRepository: UserRepository) {}

  async findUserById(id: string): Promise<FilterUser> {
    const user = await this.userRepository.findUserById(id);
    if (!user) throw new UserNotFoundException();
    return user;
  }
}
