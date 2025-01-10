import { NotFoundException } from '@nestjs/common';
import { AsyncLocalStorage } from 'async_hooks';
import { IAsyncLocalStorage } from '#common/als/als.type.js';
import ExceptionMessages from '#exception/exception-message.js';

export class AlsStore {
  constructor(private readonly als: AsyncLocalStorage<IAsyncLocalStorage>) {}

  getStore(): IAsyncLocalStorage {
    const store = this.als.getStore();
    if (!store) throw new NotFoundException(ExceptionMessages.NO_STORE);
    return store;
  }
}
