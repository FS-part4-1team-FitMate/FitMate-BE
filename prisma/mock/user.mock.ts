import { Role } from '@prisma/client';

export const USERS = [
  {
    id: '699fc386-d1a7-4430-a37d-9d1c5bdafd3f',
    email: 'user01@example.com',
    nickname: 'user01',
    password: 'a123456.',
    refreshToken: 'someRefreshTokenHere',
    role: Role.USER,
    createdAt: '2025-01-01T12:00:00.000Z',
    updatedAt: '2025-01-01T12:00:00.000Z',
  },
  {
    id: '699fc386-d1a7-4430-a37d-9d1c5bdafd4d',
    email: 'user02@example.com',
    nickname: 'user02',
    password: 'a123456.',
    refreshToken: 'someRefreshTokenHere',
    role: Role.USER,
    createdAt: '2025-01-01T13:00:00.000Z',
    updatedAt: '2025-01-01T13:00:00.000Z',
  },
  {
    id: '699fc386-d1a7-4430-a37d-9d1c5bdafd4d',
    email: 'user03@example.com',
    nickname: 'user03',
    password: 'a123456.',
    refreshToken: 'someRefreshTokenHere',
    role: Role.USER,
    createdAt: '2025-01-01T14:00:00.000Z',
    updatedAt: '2025-01-01T14:00:00.000Z',
  },
  {
    id: '337fc386-d1a7-4430-a37d-9d1c5bdafd4d',
    email: 'train01@example.com',
    nickname: 'train01',
    password: 'a123456.',
    refreshToken: 'someRefreshTokenHere',
    role: Role.TRAINER,
    createdAt: '2025-01-01T12:01:00.000Z',
    updatedAt: '2025-01-01T12:01:00.000Z',
  },
];
