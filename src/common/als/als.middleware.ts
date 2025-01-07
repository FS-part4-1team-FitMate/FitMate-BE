import { Injectable, NestMiddleware } from '@nestjs/common';
import { AsyncLocalStorage } from 'async_hooks';
import { Response, NextFunction } from 'express';
import { IAsyncLocalStorage } from '#common/als/als.type.js';
import { StorageRequest } from '#common/als/als.type.js';

@Injectable()
export class AlsMiddleware implements NestMiddleware {
  constructor(private readonly als: AsyncLocalStorage<IAsyncLocalStorage>) {}

  use(req: StorageRequest, res: Response, next: NextFunction): void {
    const store = { userId: req.user?.id, userRole: req.user?.role };
    this.als.run(store, () => next());
  }
}
