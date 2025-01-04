import type { Role, User } from '@prisma/client';

export class CreateUser {
  name: string;
  email: string;
  password: string;
  phone?: string;
  role: Role;
}

export type FilterUser = Omit<User, 'password' | 'refreshToken'>;
