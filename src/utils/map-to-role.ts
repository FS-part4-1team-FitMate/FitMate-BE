import { BadRequestException } from '@nestjs/common';
import { Role } from '@prisma/client';
import AuthExceptionMessage from '#exception/auth-exception-message.js';

export default function mapToRole(role: string): Role {
  if (role === 'USER') return Role.USER;
  if (role === 'TRAINER') return Role.TRAINER;
  throw new BadRequestException(AuthExceptionMessage.INVALID_ROLE);
}
