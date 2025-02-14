import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AsyncLocalStorage } from 'async_hooks';
import { Response } from 'express';
import { IAsyncLocalStorage } from '#common/als/als.type.js';
import { TOKEN_EXPIRATION } from '#configs/jwt.config.js';

@Injectable()
export class AccessTokenGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly als: AsyncLocalStorage<IAsyncLocalStorage>,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse<Response>();
    const token = request.headers['authorization']?.split(' ')[1];

    if (token) {
      try {
        const decoded = this.jwtService.verify(token, {
          secret: process.env.JWT_SECRET,
        });
        request.user = decoded;

        const store = this.als.getStore();
        if (store) {
          store.userId = decoded.userId;
          store.userRole = decoded.role;
        }

        // // 새로운 Access Token 발급
        const payload = { userId: decoded.userId, role: decoded.role };
        const options = { expiresIn: TOKEN_EXPIRATION.ACCESS };
        const newAccessToken = this.jwtService.sign(payload, options);
        response.setHeader('new-access-token', newAccessToken);
      } catch (e) {
        request.user = null;
      }
    }

    return true;
  }
}
