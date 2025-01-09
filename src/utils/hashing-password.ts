import { UnauthorizedException } from '@nestjs/common';
import bcrypt from 'bcrypt';
import AuthExceptionMessage from '#exception/auth-exception-message.js';

export async function hashingPassword(password: string) {
  return await bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, encryptedPassword: string) {
  const isValid = await bcrypt.compare(password, encryptedPassword);
  if (!isValid) throw new UnauthorizedException(AuthExceptionMessage.PASSWORD_ERROR);
}
