import { ValidationPipe, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { GlobalExceptionFilter } from '#exception/global-exception-filter.js';
import { LoggingInterceptor } from '#logger/logging.interceptor.js';
import { logger } from '#logger/winston-logger.js';
import { AppModule } from './app.module.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const port = configService.get('PORT') ?? 3000;

  app.useGlobalInterceptors(new LoggingInterceptor());
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      exceptionFactory: (errors) => {
        console.log(errors);
        const errorMessages = errors.flatMap((error) => Object.values(error.constraints || {}));
        return new BadRequestException(errorMessages);
      },
    }),
  );
  app.useGlobalFilters(new GlobalExceptionFilter());

  // Swagger 설정
  const swaggerConfig = new DocumentBuilder()
    .setTitle('API 문서')
    .setDescription('NestJS API 문서')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api-docs', app, document);

  app.enableCors({
    origin: configService.get<string>('CORS_ORIGIN') || '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });

  app.useWebSocketAdapter(new IoAdapter(app));

  app.listen(port, '0.0.0.0', () => {
    logger.info(`🚀 Server is running on port ${port}`);
  });
}
bootstrap();
