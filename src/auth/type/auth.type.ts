import type { Role, User } from '@prisma/client';
import { Profile } from 'passport-naver';

export interface CreateUser {
  nickname: string;
  email: string;
  password: string;
  role: Role;
}

export type FilterUser = Omit<User, 'password' | 'refreshToken'>;

export interface Payload {
  userId: string;
  role: Role;
}

export interface ExtendedProfile extends Profile {
  state: string;
}

export interface ValidateNaverUser {
  provider: string;
  providerId: string;
  email: string;
  nickname: string;
  role: string;
}
