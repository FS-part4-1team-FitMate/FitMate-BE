import { Injectable, NotFoundException } from '@nestjs/common';
import AuthExceptionMessage from '#exception/auth-exception-message.js';
import type { FilterUser } from '#auth/type/auth.type.js';
import { IUserService } from '#user/interface/user.service.interface.js';
import { UserRepository } from '#user/user.repository.js';
import { filterSensitiveUserData } from '#utils/filter-sensitive-user-data.js';

@Injectable()
export class UserService implements IUserService {
  constructor(private readonly userRepository: UserRepository) {}

  async findUserById(id: string): Promise<FilterUser> {
    const user = await this.userRepository.findUserById(id);
    if (!user) throw new NotFoundException(AuthExceptionMessage.USER_NOT_FOUND);
    return filterSensitiveUserData(user);
  }
}
