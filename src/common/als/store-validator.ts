import { AsyncLocalStorage } from 'async_hooks';
import { IAsyncLocalStorage } from '#common/als/als.type.js';
import { NoStoreException } from '#exception/http-exception.js';

export class AlsStore {
  constructor(private readonly als: AsyncLocalStorage<IAsyncLocalStorage>) {}

  getStore(): IAsyncLocalStorage {
    const store = this.als.getStore();
    if (!store) throw new NoStoreException();
    return store;
  }
}
