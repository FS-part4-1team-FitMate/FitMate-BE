import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { UUIDPipe } from '#common/uuid.pipe.js';
import { AccessTokenGuard } from '#auth/guard/access-token.guard.js';
import { UserService } from '#user/user.service.js';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(':id')
  @UseGuards(AccessTokenGuard)
  async getUserById(@Param('id', UUIDPipe) id: string) {
    return await this.userService.findUserById(id);
  }
}
