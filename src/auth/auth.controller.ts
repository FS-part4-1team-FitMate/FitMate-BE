import { UseGuards, Body, Controller, Post, Res, Get, Redirect, Query, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import express from 'express';
import { AuthService } from '#auth/auth.service.js';
import { ReqUser } from '#auth/decorator/user.decorator.js';
import { CreateUserDTO } from '#auth/dto/auth.dto.js';
import { KakaoAuthGuard } from '#auth/guard/kakao.guard.js';
import { NaverAuthGuard } from '#auth/guard/naver.guard.js';
import { RefreshTokenGuard } from '#auth/guard/refresh-token.guard.js';
import mapToRole from '#utils/map-to-role.js';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async handleSignup(@Body() body: CreateUserDTO, @Query('role') role: string) {
    const validateRole = mapToRole(role);

    const user = await this.authService.createUser({ ...body, role: validateRole });
    const accessToken = this.authService.createToken(user.id, role, 'access');
    const refreshToken = this.authService.createToken(user.id, role, 'refresh');
    const userInfo = await this.authService.updateUser(user.id, refreshToken);
    const hasProfile = await this.authService.hasProfile(user.id);

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
    console.log('Received role:', role);
    const googleUrl = this.authService.getGoogleRedirectUrl(role);
    return { url: googleUrl };
  }

  @Get('google/redirect')
  async googleRedirect(@Query('code') code: string, @Query('state') role: string) {
    const validateRole = mapToRole(role);
    const user = await this.authService.handleGoogleRedirect(code, validateRole);
    const AccessToken = this.authService.createToken(user.id, user.role, 'access');
    const RefreshToken = this.authService.createToken(user.id, user.role, 'refresh');
    const userInfo = await this.authService.updateUser(user.id, RefreshToken);
    const hasProfile = await this.authService.hasProfile(user.id);
    return { AccessToken, RefreshToken, user: userInfo, hasProfile };
  }

  @Get('naver')
  @UseGuards(NaverAuthGuard)
  async naverLogin() {}

  @Get('naver/redirect')
  @UseGuards(NaverAuthGuard)
  async naverCallback(@ReqUser() socialAccountInfo: any, @Query('state') state: string) {
    const { provider, providerId, email, nickname } = socialAccountInfo;
    const naverUser = await this.authService.handleSocialAccount({
      provider,
      providerId,
      email,
      nickname,
      role: state,
    });
    const AccessToken = this.authService.createToken(naverUser.id, state, 'access');
    const RefreshToken = this.authService.createToken(naverUser.id, state, 'refresh');
    const userInfo = await this.authService.updateUser(naverUser.id, RefreshToken);
    const hasProfile = await this.authService.hasProfile(naverUser.id);

    return { AccessToken, RefreshToken, user: userInfo, hasProfile };
  }

  @Get('kakao')
  @UseGuards(KakaoAuthGuard)
  async kakaoLogin() {}

  @Get('kakao/redirect')
  @UseGuards(KakaoAuthGuard)
  async kakaoCallback(@ReqUser() socialAccountInfo: any, @Query('state') state: string) {
    const { provider, providerId, email, nickname } = socialAccountInfo;
    const naverUser = await this.authService.handleSocialAccount({
      provider,
      providerId,
      email,
      nickname,
      role: state,
    });
    const AccessToken = this.authService.createToken(naverUser.id, state, 'access');
    const RefreshToken = this.authService.createToken(naverUser.id, state, 'refresh');
    const userInfo = await this.authService.updateUser(naverUser.id, RefreshToken);
    const hasProfile = await this.authService.hasProfile(naverUser.id);

    return { AccessToken, RefreshToken, user: userInfo, hasProfile };
  }
}
