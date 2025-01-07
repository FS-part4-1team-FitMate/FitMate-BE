import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { AsyncLocalStorage } from 'async_hooks';
import { IAsyncLocalStorage } from '#common/als/als.type.js';
import { AlsStore } from '#common/als/store-validator.js';
import { UUIDPipe } from '#common/uuid.pipe.js';
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
    const { userId, userRole } = this.alsStore.getStore();
    console.log(`test: ${userId}, ${userRole}`);
    return await this.userService.findUserById(id);
  }
}
