import { UseGuards, Body, Controller, Post, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from '#auth/auth.service.js';
import { ReqUser } from '#auth/decorator/user.decorator.js';
import { RefreshTokenGuard } from '#auth/guard/refresh-token.guard.js';
import { InputCreateUserDTO } from '#auth/type/auth.dto.js';
import { Payload } from '#auth/type/auth.type.js';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup/user')
  async createUser(@Body() body: InputCreateUserDTO) {
    return await this.authService.createUser({ ...body, role: 'USER' });
  }

  @Post('signup/trainer')
  async createTrainer(@Body() body: InputCreateUserDTO) {
    return await this.authService.createUser({ ...body, role: 'TRAINER' });
  }

  @Post('login')
  @UseGuards(AuthGuard('local'))
  async loginUser(@ReqUser() user: { userId: string; role: string }) {
    const { userId, role } = user;
    const accessToken = this.authService.createToken(userId, role, 'access');
    const refreshToken = this.authService.createToken(userId, role, 'refresh');
    await this.authService.updateUser(userId, refreshToken);
    return { accessToken, refreshToken };
  }

  @Post('token/refresh')
  @UseGuards(RefreshTokenGuard)
  async refreshAccessToken(@ReqUser() user: { userId: string; role: string; refreshToken: string }) {
    const { userId, role, refreshToken } = user;
    console.log(userId, role);
    const accessToken = await this.authService.refreshToken(userId, role, refreshToken);
    return { accessToken };
  }
}
