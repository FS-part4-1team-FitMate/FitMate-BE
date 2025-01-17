import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AsyncLocalStorage } from 'async_hooks';
import { IAsyncLocalStorage } from '#common/als/als.type.js';

@Injectable()
export class OptionalAccessTokenGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly als: AsyncLocalStorage<IAsyncLocalStorage>,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
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
      } catch (e) {
        // Token이 유효하지 않아도 비회원으로 처리
        request.user = null;
      }
    }

    return true; // 항상 요청 통과
  }
}
