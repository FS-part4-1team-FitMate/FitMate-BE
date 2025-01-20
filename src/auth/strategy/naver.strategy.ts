import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-naver';
import { AuthService } from '#auth/auth.service.js';
import type { ExtendedProfile } from '#auth/type/auth.type.js';

@Injectable()
export class NaverStrategy extends PassportStrategy(Strategy, 'naver') {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {
    const clientID = configService.get<string>('NAVER_CLIENT_ID');
    const clientSecret = configService.get<string>('NAVER_CLIENT_SECRET');
    const callbackURL = configService.get<string>('NAVER_CALLBACK_URL');

    super({
      clientID,
      clientSecret,
      callbackURL,
    });
  }

  async validate(req: any, accessToken: string, profile: ExtendedProfile, done: Function) {
    const { id: providerId, email, nickname } = profile._json;
    const provider = 'naver';

    const user = await this.authService.handleNaverRedirect({
      provider,
      providerId,
      email,
      nickname,
    });

    return user;
  }
}
