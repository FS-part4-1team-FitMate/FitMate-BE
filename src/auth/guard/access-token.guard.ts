import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { AsyncLocalStorage } from 'async_hooks';
import { Response } from 'express';
import { IAsyncLocalStorage } from '#common/als/als.type.js';
import { TOKEN_EXPIRATION } from '#configs/jwt.config.js';
import { getEnvOrThrow } from '#utils/get-env.js';

@Injectable()
export class AccessTokenGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly als: AsyncLocalStorage<IAsyncLocalStorage>,
    private readonly configService: ConfigService,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse<Response>();
    const token = request.headers['authorization']?.split(' ')[1];

    if (token) {
      try {
        const decoded = this.jwtService.verify(token, {
          secret: getEnvOrThrow(this.configService, 'JWT_SECRET'),
        });
        request.user = decoded;

        const store = this.als.getStore();
        if (store) {
          store.userId = decoded.userId;
          store.userRole = decoded.role;
        }

        const currentTime = Math.floor(Date.now() / 1000);
        const expirationTime = decoded.exp;
        const remainingTime = expirationTime - currentTime;

        if (remainingTime <= 600) {
          const payload = { userId: decoded.userId, role: decoded.role };
          const options = { expiresIn: TOKEN_EXPIRATION.ACCESS };
          const newAccessToken = this.jwtService.sign(payload, options);

          response.setHeader('new-access-token', newAccessToken);
        }
      } catch (e) {
        request.user = null;
      }
    }

    return true;
  }
}
