import { Role } from '@prisma/client';

export const USERS = {
  id: '699fc386-d1a7-4430-a37d-9d1c5bdafd3f',
  email: 'john.doe@example.com',
  name: 'John Doe',
  password: 'password123',
  phone: '123-456-7890',
  refreshToken: 'someRefreshTokenHere',
  role: Role.USER,
  createdAt: '2025-01-01T12:00:00.000Z',
  updatedAt: '2025-01-02T12:00:00.000Z',
};
