import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { GlobalExceptionFilter } from '#exception/global-exception-filter.js';
import { LoggingInterceptor } from '#logger/logging.interceptor.js';
import { logger } from '#logger/winston-logger.js';
import { AppModule } from './app.module.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const port = configService.get('PORT') ?? 3000;

  app.useGlobalInterceptors(new LoggingInterceptor());
  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true, forbidNonWhitelisted: true }));
  app.useGlobalFilters(new GlobalExceptionFilter(configService));

  app.listen(port, () => {
    logger.info(`🚀 Server is running on port ${port}`);
  });
}
bootstrap();
