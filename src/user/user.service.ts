import { Injectable, NotFoundException } from '@nestjs/common';
import { ForbiddenException } from '@nestjs/common';
import { AlsStore } from '#common/als/store-validator.js';
import AuthExceptionMessage from '#exception/auth-exception-message.js';
import ExceptionMessages from '#exception/exception-message.js';
import type { FilterUser } from '#auth/type/auth.type.js';
import { IUserService } from '#user/interface/user.service.interface.js';
import { UserRepository } from '#user/user.repository.js';

@Injectable()
export class UserService implements IUserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly alsStore: AlsStore,
  ) {}

  async findUserById(id: string): Promise<FilterUser> {
    const { userId } = this.alsStore.getStore();
    if (id !== userId) throw new ForbiddenException(ExceptionMessages.FORBIDDEN);
    const user = await this.userRepository.findUserById(id);
    if (!user) throw new NotFoundException(AuthExceptionMessage.USER_NOT_FOUND);
    return user;
  }
}
