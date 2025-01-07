import { Request as ExpressRequest } from 'express';

export interface IAsyncLocalStorage {
  userId: string;
  userRole: string;
}

export interface StorageUser {
  id: string;
  role: string;
}

export interface StorageRequest extends ExpressRequest {
  user: StorageUser;
}
