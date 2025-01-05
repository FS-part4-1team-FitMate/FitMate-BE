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

  @Post('signUp')
  async createUser(@Body() body: InputCreateUserDTO) {
    return await this.authService.createUser(body);
  }

  @Post('signIn')
  @UseGuards(AuthGuard('local'))
  async loginUser(@ReqUser() user: { userId: string }) {
    const { userId } = user;
    const accessToken = this.authService.createToken(userId, 'access');
    const refreshToken = this.authService.createToken(userId, 'refresh');
    await this.authService.updateUser(userId, refreshToken);
    return { accessToken, refreshToken };
  }

  @Post('token/refresh')
  @UseGuards(RefreshTokenGuard)
  async refreshAccessToken(@ReqUser() user: Payload & { refreshToken: string }) {
    const { userId, refreshToken } = user;
    const accessToken = await this.authService.refreshToken(userId, refreshToken);
    return { accessToken };
  }
}
