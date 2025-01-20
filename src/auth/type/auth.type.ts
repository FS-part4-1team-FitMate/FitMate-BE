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

export interface NaverProfile extends Profile {
  state: string;
}

export interface ValidateSocialAccount {
  provider: string;
  providerId: string;
  email: string;
  nickname: string;
  role: string;
}

export interface KakaoAccount {
  email?: string;
  profile?: {
    nickname?: string;
    profile_image?: string;
  };
}

export interface KakaoProfile {
  id: string;
  connected_at: string;
  kakao_account?: KakaoAccount;
}

export interface ExtendKakaoProfile {
  _json: KakaoProfile;
}
