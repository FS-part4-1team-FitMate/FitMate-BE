import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request, Response } from 'express';
import ExceptionMessages from './exception-message.js';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  constructor(private readonly configService: ConfigService) {}

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = ExceptionMessages.INTERNAL_SERVER_ERROR.toString();
    let stackTrace = null;

    // 현재 환경 (development, production 등)
    const isDevelopment = this.configService.get<string>('NODE_ENV') === 'development';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const responseMessage = exception.getResponse();
      message = typeof responseMessage === 'string' ? responseMessage : (responseMessage as any).message || ExceptionMessages.BAD_REQUEST.toString();
    } else if (exception instanceof Error) {
      message = exception.message;
      stackTrace = exception.stack;
    }

    // 콘솔에 에러 스택 출력 (항상 출력)
    console.error('Exception:', {
      message,
      stack: stackTrace,
    });

    // 클라이언트로 응답 (개발 환경에서만 스택 포함)
    response.status(status).json({
      statusCode: status,
      message,
      ...(isDevelopment && stackTrace ? { stack: stackTrace } : {}), // 개발 환경에서만 스택 트레이스 반환
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}

// import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
// import { Request, Response } from 'express';
// import ExceptionMessages from './exception-message.js';

// @Catch()
// export class GlobalExceptionFilter implements ExceptionFilter {
//   catch(exception: unknown, host: ArgumentsHost) {
//     const ctx = host.switchToHttp();
//     const request = ctx.getRequest<Request>();
//     const response = ctx.getResponse<Response>();

//     let status = HttpStatus.INTERNAL_SERVER_ERROR;
//     let message = ExceptionMessages.INTERNAL_SERVER_ERROR.toString();

//     if (exception instanceof HttpException) {
//       status = exception.getStatus();
//       const responseMessage = exception.getResponse();
//       message = typeof responseMessage === 'string' ? responseMessage : ExceptionMessages.BAD_REQUEST.toString();
//     }

//     response.status(status).json({
//       statusCode: status,
//       message,
//       timestamp: new Date().toISOString(),
//       path: request.url,
//     });
//   }
// }
