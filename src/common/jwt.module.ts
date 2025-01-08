import { Module, Global } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt';
import { TOKEN_EXPIRATION } from '#configs/jwt.config.js';

@Global()
@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService): Promise<JwtModuleOptions> => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: TOKEN_EXPIRATION.REFRESH },
      }),
      inject: [ConfigService],
    }),
  ],
  exports: [JwtModule],
})
export class JwtConfigModule {}
