import { Role } from '@prisma/client';

export interface CreateUser {
  nickname: string;
  email: string;
  password: string;
  role: Role;
}
