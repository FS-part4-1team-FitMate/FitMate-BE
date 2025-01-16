import { UseGuards, Body, Controller, Post, Res, Get, Redirect, Query } from '@nestjs/common';
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
    const accessToken = this.authService.createToken(user.id, 'USER', 'access');
    const refreshToken = this.authService.createToken(user.id, 'USER', 'refresh');
    const userInfo = await this.authService.updateUser(user.id, refreshToken);
    const hasProfile = await this.authService.hasProfile(user.id);
    return { accessToken, refreshToken, user: userInfo, hasProfile };
  }

  @Post('signup/trainer')
  async createTrainer(@Body() body: CreateUserDTO) {
    const trainer = await this.authService.createUser({ ...body, role: 'TRAINER' });
    const accessToken = this.authService.createToken(trainer.id, 'TRAINER', 'access');
    const refreshToken = this.authService.createToken(trainer.id, 'TRAINER', 'refresh');
    const userInfo = await this.authService.updateUser(trainer.id, refreshToken);
    const hasProfile = await this.authService.hasProfile(trainer.id);
    return { accessToken, refreshToken, user: userInfo, hasProfile };
  }

  @Post('login')
  @UseGuards(AuthGuard('local'))
  async loginUser(@ReqUser() user: { userId: string; role: string }) {
    const { userId, role } = user;
    const accessToken = this.authService.createToken(userId, role, 'access');
    const refreshToken = this.authService.createToken(userId, role, 'refresh');
    const userInfo = await this.authService.updateUser(userId, refreshToken);
    const hasProfile = await this.authService.hasProfile(userId);
    return { accessToken, refreshToken, user: userInfo, hasProfile };
  }

  @Post('token/refresh')
  @UseGuards(RefreshTokenGuard)
  async refreshAccessToken(
    @ReqUser() user: { userId: string; role: string; refreshToken: string },
    @Res() res: express.Response,
  ) {
    const { userId, role, refreshToken } = user;
    const accessToken = await this.authService.refreshToken(userId, role, refreshToken);
    res.setHeader('Authorization', `Bearer ${accessToken}`);
    return res.send();
  }

  @Get('google')
  @Redirect()
  getGoogleUrl(@Query('role') role: string) {
    return this.authService.getGoogleRedirectUrl(role);
  }

  @Get('google/redirect')
  async googleRedirect(@Query('code') code: string, @Query('role') role: string) {
    const user = await this.authService.handleGoogleRedirect(code, role);
    const hasProfile = await this.authService.hasProfile(user.id);
    const AccessToken = this.authService.createToken(user.id, user.role, 'access');
    const RefreshToken = this.authService.createToken(user.id, user.role, 'refresh');
    return { AccessToken, RefreshToken, user, hasProfile };
  }
}
