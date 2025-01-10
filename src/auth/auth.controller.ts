import { UseGuards, Body, Controller, Post, Res } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import express from 'express';
import { AuthService } from '#auth/auth.service.js';
import { ReqUser } from '#auth/decorator/user.decorator.js';
import { CreateUserDTO } from '#auth/dto/auth.dto.js';
import { RefreshTokenGuard } from '#auth/guard/refresh-token.guard.js';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup/user')
  async createUser(@Body() body: CreateUserDTO) {
    const user = await this.authService.createUser({ ...body, role: 'USER' });
    const accessToken = this.authService.createToken(user.id, user.role, 'access');
    const refreshToken = this.authService.createToken(user.id, user.role, 'refresh');
    const userInfo = await this.authService.updateUser(user.id, refreshToken);
    return { accessToken, refreshToken, user: userInfo };
  }

  @Post('signup/trainer')
  async createTrainer(@Body() body: CreateUserDTO) {
    const trainer = await this.authService.createUser({ ...body, role: 'TRAINER' });
    const accessToken = this.authService.createToken(trainer.id, trainer.role, 'access');
    const refreshToken = this.authService.createToken(trainer.id, trainer.role, 'refresh');
    const userInfo = await this.authService.updateUser(trainer.id, refreshToken);
    return { accessToken, refreshToken, user: userInfo };
  }

  @Post('login')
  @UseGuards(AuthGuard('local'))
  async loginUser(@ReqUser() user: { userId: string; role: string }) {
    const { userId, role } = user;
    const accessToken = this.authService.createToken(userId, role, 'access');
    const refreshToken = this.authService.createToken(userId, role, 'refresh');
    const userInfo = await this.authService.updateUser(userId, refreshToken);
    return { accessToken, refreshToken, user: userInfo };
  }

  @Post('token/refresh')
  @UseGuards(RefreshTokenGuard)
  async refreshAccessToken(
    @ReqUser() user: { userId: string; role: string; refreshToken: string },
    @Res() res: express.Response,
  ) {
    const { userId, role, refreshToken } = user;
    console.log(userId, role);
    const accessToken = await this.authService.refreshToken(userId, role, refreshToken);
    res.setHeader('Authorization', `Bearer ${accessToken}`);
    return res.send();
  }
}
