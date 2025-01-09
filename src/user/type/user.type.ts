import { PartialType } from '@nestjs/mapped-types';
import { Role } from '@prisma/client';

export interface CreateUser {
  nickname: string;
  email: string;
  password: string;
  role: Role;
}

export interface PatchUser {
  nickname?: string;
  email?: string;
  password?: string;
  role?: Role;
}
