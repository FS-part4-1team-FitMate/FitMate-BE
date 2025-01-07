import { Module, Global } from '@nestjs/common';
import { AsyncLocalStorage } from 'async_hooks';
import { IAsyncLocalStorage } from '#common/als/als.type.js';

@Global()
@Module({
  providers: [
    {
      provide: AsyncLocalStorage,
      useValue: new AsyncLocalStorage<IAsyncLocalStorage>(),
    },
  ],
  exports: [AsyncLocalStorage],
})
export class AlsModule {}
