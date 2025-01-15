import type { Profile } from '@prisma/client';
import type { CreateProfile, UpdateProfile, CustomProfile } from '#profile/type/profile.type.js';
export interface IProfileService {
  createProfile(data: CreateProfile): Promise<CustomProfile>;
  findProfileById(id: string): Promise<CustomProfile>;
  updateProfile(id: string, data: UpdateProfile): Promise<Profile>;
}
