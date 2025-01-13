import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { AsyncLocalStorage } from 'async_hooks';
import { Observable } from 'rxjs';
import { IAsyncLocalStorage } from '#common/als/als.type.js';

@Injectable()
export class RoleInterceptor implements NestInterceptor {
  constructor(private readonly alsStore: AsyncLocalStorage<IAsyncLocalStorage>) {}
  async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
    const store = this.alsStore.getStore();
    const request = context.switchToHttp().getRequest();

    if (store) {
      request.body.role = store.userRole;
    }

    return next.handle();
  }
}
