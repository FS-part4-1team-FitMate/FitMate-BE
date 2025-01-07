import { HttpException, HttpStatus } from '@nestjs/common';
import ExceptionMessages from './exception-message.js';

type ExceptionConstructor = new () => HttpException;

export function customHttpException(message: string, status: HttpStatus): ExceptionConstructor {
  return class extends HttpException {
    constructor() {
      super(message, status);
    }
  };
}

export const BadRequestException: ExceptionConstructor = customHttpException(ExceptionMessages.BAD_REQUEST, HttpStatus.BAD_REQUEST);
export const UserNotFound: ExceptionConstructor = customHttpException(ExceptionMessages.USER_NOT_FOUND, HttpStatus.NOT_FOUND);
export const UserExistsException: ExceptionConstructor = customHttpException(ExceptionMessages.USER_EXISTS, HttpStatus.CONFLICT);
export const UserEmailNotFound: ExceptionConstructor = customHttpException(ExceptionMessages.EMAIL_NOT_FOUND, HttpStatus.NOT_FOUND);
export const PasswordError: ExceptionConstructor = customHttpException(ExceptionMessages.PASSWORD_ERROR, HttpStatus.BAD_REQUEST);
export const NoEnvVariable: ExceptionConstructor = customHttpException(ExceptionMessages.NO_ENV_VARIABLE, HttpStatus.INTERNAL_SERVER_ERROR);
export const UnauthorizedException: ExceptionConstructor = customHttpException(ExceptionMessages.UNAUTHORIZED, HttpStatus.UNAUTHORIZED);
export const WrongFormat: ExceptionConstructor = customHttpException(ExceptionMessages.WRONG_FORMAT, HttpStatus.BAD_REQUEST);
export const NoRefreshToken: ExceptionConstructor = customHttpException(ExceptionMessages.NO_REFRESH_TOKEN, HttpStatus.NOT_FOUND);
export const InvalidRefreshToken: ExceptionConstructor = customHttpException(ExceptionMessages.INVALID_REFRESH_TOKEN, HttpStatus.UNAUTHORIZED);
export const NoStoreException: ExceptionConstructor = customHttpException(ExceptionMessages.NO_STORE, HttpStatus.INTERNAL_SERVER_ERROR);
export const ForbiddenException: ExceptionConstructor = customHttpException(ExceptionMessages.FORBIDDEN, HttpStatus.FORBIDDEN);
export const ProfileNotFound: ExceptionConstructor = customHttpException(ExceptionMessages.PROFILE_NOT_FOUND, HttpStatus.NOT_FOUND);
