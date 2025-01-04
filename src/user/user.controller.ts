import { Controller, Get, Param } from '@nestjs/common';
import { UUIDPipe } from '#common/uuid.pipe.js';
import { UserService } from '#user/user.service.js';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(':id')
  async getUserById(@Param('id', UUIDPipe) id: string) {
    return await this.userService.findUserById(id);
  }
}
