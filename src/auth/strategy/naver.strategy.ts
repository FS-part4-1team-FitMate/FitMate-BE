import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { Strategy } from 'passport-naver';
import type { NaverProfile } from '#auth/type/auth.type.js';

@Injectable()
export class NaverStrategy extends PassportStrategy(Strategy, 'naver') {
  constructor(private readonly configService: ConfigService) {
    super({
      clientID: configService.get<string>('NAVER_CLIENT_ID') || '',
      clientSecret: configService.get<string>('NAVER_CLIENT_SECRET') || '',
      callbackURL: configService.get<string>('NAVER_CALLBACK_URL') || '',
    });
  }

  async validate(req: Request, accessToken: string, profile: NaverProfile, done: Function) {
    const { id: providerId, email, nickname } = profile._json;
    const provider = 'naver';

    const socialAccountInfo = { provider, providerId, email, nickname };
    return socialAccountInfo;
  }
}
