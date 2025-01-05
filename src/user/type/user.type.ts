import { PartialType } from '@nestjs/mapped-types';
import { Role } from '@prisma/client';

export class CreateUser {
  nickname: string;
  email: string;
  password: string;
  phone?: string;
  role: Role;
}

export class PatchUser extends PartialType(CreateUser) {}
