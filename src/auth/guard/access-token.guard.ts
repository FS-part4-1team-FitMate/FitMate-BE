import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AsyncLocalStorage } from 'async_hooks';
import { IAsyncLocalStorage } from '#common/als/als.type.js';

@Injectable()
export class AccessTokenGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private als: AsyncLocalStorage<IAsyncLocalStorage>,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const token = request.headers['authorization']?.split(' ')[1];

    if (!token) {
      return false;
    }

    try {
      const decoded = this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET,
      });
      request.user = decoded;
      console.log(`Decoded: ${JSON.stringify(decoded, null, 2)}`);

      const store = this.als.getStore();
      console.log('AsyncLocalStorage store:', store);
      if (store) {
        store.userId = decoded.userId;
        store.userRole = decoded.role;
        console.log(store.userId); //추후 삭제
        console.log(store.userRole); //추후 삭제
      }

      return true;
    } catch (e) {
      return false;
    }
  }
}
