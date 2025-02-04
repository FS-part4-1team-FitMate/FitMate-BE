import { UseGuards, Body, Controller, Post, Res, Get, Redirect, Query } from '@nestjs/common';
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
import { EmailService } from '#email/email.service.js';
import mapToRole from '#utils/map-to-role.js';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly emailService: EmailService,
    private readonly configService: ConfigService,
  ) {}

  private async generateAuthResponse(userId: string, role: string) {
    const accessToken = this.authService.createToken(userId, role, 'access');
    const refreshToken = this.authService.createToken(userId, role, 'refresh');
    const userInfo = await this.authService.updateUser(userId, refreshToken);
    const hasProfile = await this.authService.hasProfile(userId);
    const baseUrl = this.configService.get<string>('FRONTEND_BASE_URL') || 'http://localhost:3000';
    const redirectUrl = `${baseUrl}/sns-login?accessToken=${encodeURIComponent(accessToken)}&refreshToken=${encodeURIComponent(refreshToken)}&user=${encodeURIComponent(JSON.stringify(userInfo))}&hasProfile=${hasProfile}`;

    return { accessToken, refreshToken, user: userInfo, hasProfile, redirectUrl };
  }

  private async handleRedirectUrl(userId: string, role: string): Promise<string> {
    const { redirectUrl } = await this.generateAuthResponse(userId, role);
    return redirectUrl;
  }

  @Post('email-verification')
  async sendVerificationCode(@Body('email') email: string) {
    const code = await this.authService.emailVerification(email);

    //추후 삭제
    console.log('code: ', code);

    return { message: `인증번호가 ${email}로 전송되었습니다.` };
  }

  @Post('verify-code')
  async verifyCode(@Body('email') email: string, @Body('code') code: string) {
    await this.authService.verifyEmailCode(email, code);
    return { message: '이메일 인증 성공' };
  }

  @Post('signup')
  async handleSignup(@Body() body: CreateUserDTO, @Query('role') role: string) {
    const validateRole = mapToRole(role);

    const user = await this.authService.createUser({ ...body, role: validateRole });
    const authResponse = await this.generateAuthResponse(user.id, validateRole);

    const { redirectUrl, ...rest } = authResponse;
    return rest;
  }

  @Post('login')
  @UseGuards(AuthGuard('local'))
  async loginUser(@ReqUser() user: { userId: string; role: string }) {
    const { userId, role } = user;
    const authResponse = await this.generateAuthResponse(userId, role);
    const { redirectUrl, ...rest } = authResponse;
    return rest;
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
  async googleRedirect(
    @Res() res: express.Response,
    @Query('code') code: string,
    @Query('state') role?: string,
  ) {
    const isSignUp = typeof role === 'string' && role.trim() !== '' && role !== 'undefined';
    const user = isSignUp
      ? await this.authService.handleGoogleSignUp(code, role!)
      : await this.authService.handleGoogleLogin(code);
    const redirectUrl = await this.handleRedirectUrl(user.id, user.role);
    res.redirect(redirectUrl);
  }

  @Get('naver')
  @UseGuards(NaverAuthGuard)
  async naverLogin() {}

  @Get('naver/redirect')
  @UseGuards(NaverAuthGuard)
  async naverCallback(
    @ReqUser() socialAccountInfo: SocialAccountInfo,
    @Res() res: express.Response,
    @Query('state') state?: string,
  ) {
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

    const redirectUrl = await this.handleRedirectUrl(naverUser.id, naverUser.role);
    res.redirect(redirectUrl);
  }

  @Get('kakao')
  @UseGuards(KakaoAuthGuard)
  async kakaoLogin() {}

  @Get('kakao/redirect')
  @UseGuards(KakaoAuthGuard)
  async kakaoCallback(
    @ReqUser() socialAccountInfo: SocialAccountInfo,
    @Res() res: express.Response,
    @Query('state') state?: string,
  ) {
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

    const redirectUrl = await this.handleRedirectUrl(kakaoUser.id, kakaoUser.role);
    res.redirect(redirectUrl);
  }
}
