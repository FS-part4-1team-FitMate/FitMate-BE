import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { Strategy } from 'passport-naver';
import type { NaverProfile } from '#auth/type/auth.type.js';
import { getEnvOrThrow } from '#utils/get-env.js';

@Injectable()
export class NaverStrategy extends PassportStrategy(Strategy, 'naver') {
  constructor(private readonly configService: ConfigService) {
    super({
      clientID: getEnvOrThrow(configService, 'NAVER_CLIENT_ID'),
      clientSecret: getEnvOrThrow(configService, 'NAVER_CLIENT_SECRET'),
      callbackURL: getEnvOrThrow(configService, 'NAVER_CALLBACK_URL'),
    });
  }

  async validate(req: Request, accessToken: string, profile: NaverProfile, done: Function) {
    const { id: providerId, email, nickname } = profile._json;
    const provider = 'naver';

    const socialAccountInfo = { provider, providerId, email, nickname };
    return socialAccountInfo;
  }
}
