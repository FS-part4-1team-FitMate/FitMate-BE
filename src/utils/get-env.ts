import { InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export function getEnvOrThrow(configService: ConfigService, key: string): string {
  const value = configService.get<string>(key, { infer: true });
  if (!value) {
    throw new InternalServerErrorException(`환경변수가 설정되어있지 않습니다.: ${key}`);
  }
  return value;
}
