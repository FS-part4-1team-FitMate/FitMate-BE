import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { NoRefreshToken } from '#exception/http-exception.js';
import type { Payload } from '#auth/type/auth.type.js';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET,
      passReqToCallback: true,
      ignoreExpiration: false,
    });
  }

  async validate(req: Request, payload: Payload) {
    const refreshToken = req.headers.authorization?.split(' ')[1];
    if (!refreshToken) throw new NoRefreshToken();
    return { ...payload, refreshToken };
  }
}
