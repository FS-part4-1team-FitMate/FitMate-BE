import { Module } from '@nestjs/common';
import { AsyncLocalStorage } from 'async_hooks';
import { PrismaModule } from '#prisma/prisma.module.js';
import { AlsModule } from '#common/als/als.module.js';
import { IAsyncLocalStorage } from '#common/als/als.type.js';
import { AlsStore } from '#common/als/store-validator.js';
import { AccessTokenGuard } from '#auth/guard/access-token.guard.js';
import { ProfileController } from '#profile/profile.controller.js';
import { ProfileRepository } from '#profile/profile.repository.js';
import { ProfileService } from '#profile/profile.service.js';

@Module({
  imports: [PrismaModule, AlsModule],
  controllers: [ProfileController],
  providers: [
    AccessTokenGuard,
    {
      provide: AlsStore,
      useFactory: (als: AsyncLocalStorage<IAsyncLocalStorage>) => new AlsStore(als),
      inject: [AsyncLocalStorage],
    },
    ProfileService,
    ProfileRepository,
  ],
})
export class ProfileModule {}
