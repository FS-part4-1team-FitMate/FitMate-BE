import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { Strategy } from 'passport-kakao';
import type { ExtendKakaoProfile } from '#auth/type/auth.type.js';

@Injectable()
export class KakaoStrategy extends PassportStrategy(Strategy, 'kakao') {
  constructor(private readonly configService: ConfigService) {
    super({
      clientID: configService.get<string>('KAKAO_REST_API_KEY') || '',
      clientSecret: configService.get<string>('KAKAO_CLIENT_SECRET') || '',
      callbackURL: configService.get<string>('KAKAO_REDIRECT_URI') || '',
    });
  }

  async validate(req: Request, accessToken: string, profile: ExtendKakaoProfile, done: Function) {
    // eslint-disable-next-line camelcase
    const { id, kakao_account } = profile._json;
    const provider = 'kakao';
    const providerId = id?.toString();
    // eslint-disable-next-line camelcase
    const email = kakao_account?.email;
    // eslint-disable-next-line camelcase
    const nickname = kakao_account?.profile?.nickname;

    const socialAccountInfo = { provider, providerId, email, nickname };
    return socialAccountInfo;
  }
}
