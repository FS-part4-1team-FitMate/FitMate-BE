import { Controller, Get, Param, Post, Body, Patch, Delete, HttpCode } from '@nestjs/common';
import { UUIDPipe } from '#common/uuid.pipe.js';
import type { InputCreateUserDTO, InputUpdateUserDTO } from '#user/type/user.dto.js';
import { UserService } from '#user/user.service.js';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(':id')
  async getUserById(@Param('id', UUIDPipe) id: string) {
    return await this.userService.findUserById(id);
  }

  @Post()
  async postUser(@Body() body: InputCreateUserDTO) {
    return await this.userService.createUser(body);
  }

  @Patch(':id')
  async patchUser(@Param('id', UUIDPipe) id: string, @Body() body: InputUpdateUserDTO) {
    return await this.userService.updateUser(id, body);
  }

  @Delete(':id')
  @HttpCode(204)
  async deleteUser(@Param('id', UUIDPipe) id: string) {
    return await this.userService.deleteUser(id);
  }
}
