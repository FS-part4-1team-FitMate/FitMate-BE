import { UseGuards, Body, Controller, Post } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from '#auth/auth.service.js';
import { ReqUser } from '#auth/decorator/user.decorator.js';
import { InputCreateUserDTO } from '#auth/type/auth.dto.js';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signUp')
  async createUser(@Body() body: InputCreateUserDTO) {
    return await this.authService.createUser(body);
  }

  @Post('signIn')
  @UseGuards(AuthGuard('local'))
  async loginUser(@ReqUser() userId: string) {
    const accessToken = this.authService.createToken(userId, 'access');
    const refreshToken = this.authService.createToken(userId, 'refresh');
    await this.authService.updateUser(userId, refreshToken);
    return { accessToken, refreshToken };
  }

  // @Post('token/refresh')
  // async refreshAccessToken(req: AuthRequest, res: Response) {
  //   if (!req.auth || !req.auth.userId) {
  //     throw new Error();
  //   }
  //   const { refreshToken } = req.cookies;
  //   const { userId } = req.auth;
  //   const accessToken = await this.authService.refreshToken(userId, refreshToken);
  //   return res.json({ accessToken });
  // }
}

// verifyRefreshToken,
// debugRefreshToken,
