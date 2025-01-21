import { UseGuards, Body, Controller, Post, Res, Get, Redirect, Query, Req } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthGuard } from '@nestjs/passport';
import express from 'express';
import { AuthService } from '#auth/auth.service.js';
import { ReqUser } from '#auth/decorator/user.decorator.js';
import { CreateUserDTO } from '#auth/dto/auth.dto.js';
import { KakaoAuthGuard } from '#auth/guard/kakao.guard.js';
import { NaverAuthGuard } from '#auth/guard/naver.guard.js';
import { RefreshTokenGuard } from '#auth/guard/refresh-token.guard.js';
import type { SocialAccountInfo } from '#auth/type/auth.type.js';
import mapToRole from '#utils/map-to-role.js';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  private async generateAuthResponse(userId: string, role: string) {
    const accessToken = this.authService.createToken(userId, role, 'access');
    const refreshToken = this.authService.createToken(userId, role, 'refresh');
    const userInfo = await this.authService.updateUser(userId, refreshToken);
    const hasProfile = await this.authService.hasProfile(userId);
    const redirectUrl = this.getRedirectUrl(role, userId, hasProfile);

    return { accessToken, refreshToken, user: userInfo, hasProfile, redirectUrl };
  }

  private getRedirectUrl(role: string, userId: string, hasProfile: boolean): string {
    const baseUrl = this.configService.get<string>('FRONTEND_BASE_URL') || 'http://localhost:3001';
    if (role === 'USER') {
      return hasProfile ? `${baseUrl}/user/my-lesson/active-lesson` : `${baseUrl}/user/profile/regist`;
    } else if (role === 'TRAINER') {
      return hasProfile
        ? `${baseUrl}/trainer/managing-request/sent-request`
        : `${baseUrl}/trainer/${userId}/profile/regist`;
    }
    return '/';
  }

  @Post('signup')
  async handleSignup(@Body() body: CreateUserDTO, @Query('role') role: string) {
    const validateRole = mapToRole(role);

    const user = await this.authService.createUser({ ...body, role: validateRole });
    return this.generateAuthResponse(user.id, validateRole);
  }

  @Post('login')
  @UseGuards(AuthGuard('local'))
  async loginUser(@ReqUser() user: { userId: string; role: string }) {
    const { userId, role } = user;
    return this.generateAuthResponse(userId, role);
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
  getGoogleUrl(@Query('role') role?: string) {
    console.log('Received role:', role);
    const googleUrl = this.authService.getGoogleRedirectUrl(role || '');
    return { url: googleUrl };
  }

  @Get('google/redirect')
  async googleRedirect(@Query('code') code: string, @Query('state') role?: string) {
    const isSignUp = typeof role === 'string' && role.trim() !== '' && role !== 'undefined';
    const user = isSignUp
      ? await this.authService.handleGoogleSignUp(code, role!)
      : await this.authService.handleGoogleLogin(code);
    return this.generateAuthResponse(user.id, user.role);
  }

  @Get('naver')
  @UseGuards(NaverAuthGuard)
  async naverLogin() {}

  @Get('naver/redirect')
  @UseGuards(NaverAuthGuard)
  async naverCallback(@ReqUser() socialAccountInfo: SocialAccountInfo, @Query('state') state?: string) {
    const { provider, providerId, email, nickname } = socialAccountInfo;
    const isSignUp = typeof state === 'string' && state.trim() !== '' && state !== 'null';

    const naverUser = isSignUp
      ? await this.authService.registerSocialAccount({
          provider,
          providerId,
          email,
          nickname,
          role: state,
        })
      : await this.authService.loginSocialAccount({
          provider,
          providerId,
        });

    return this.generateAuthResponse(naverUser.id, naverUser.role);
  }

  @Get('kakao')
  @UseGuards(KakaoAuthGuard)
  async kakaoLogin() {}

  @Get('kakao/redirect')
  @UseGuards(KakaoAuthGuard)
  async kakaoCallback(@ReqUser() socialAccountInfo: SocialAccountInfo, @Query('state') state?: string) {
    const { provider, providerId, email, nickname } = socialAccountInfo;
    const isSignUp = typeof state === 'string' && state.trim() !== '';

    const kakaoUser = isSignUp
      ? await this.authService.registerSocialAccount({
          provider,
          providerId,
          email,
          nickname,
          role: state,
        })
      : await this.authService.loginSocialAccount({
          provider,
          providerId,
        });

    return this.generateAuthResponse(kakaoUser.id, kakaoUser.role);
  }
}
