import { Module, Global } from '@nestjs/common';
import { AsyncLocalStorage } from 'async_hooks';
import { IAsyncLocalStorage } from '#common/als/als.type.js';
import { AlsStore } from '#common/als/store-validator.js';

@Global()
@Module({
  providers: [
    {
      provide: AsyncLocalStorage,
      useValue: new AsyncLocalStorage<IAsyncLocalStorage>(),
    },
    {
      provide: AlsStore,
      useFactory: (als: AsyncLocalStorage<IAsyncLocalStorage>) => new AlsStore(als),
      inject: [AsyncLocalStorage],
    },
  ],
  exports: [AsyncLocalStorage, AlsStore],
})
export class AlsModule {}
