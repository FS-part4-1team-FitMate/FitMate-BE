import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { AlsStore } from '#common/als/store-validator.js';
import { UUIDPipe } from '#common/uuid.pipe.js';
import { ForbiddenException } from '#exception/http-exception.js';
import { AccessTokenGuard } from '#auth/guard/access-token.guard.js';
import { UserService } from '#user/user.service.js';

@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly alsStore: AlsStore,
  ) {}

  @Get(':id')
  @UseGuards(AccessTokenGuard)
  async getUserById(@Param('id', UUIDPipe) id: string) {
    const { userId } = this.alsStore.getStore();
    if (id !== userId) throw new ForbiddenException();
    return await this.userService.findUserById(id);
  }
}
