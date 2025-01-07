import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UUIDPipe } from '#common/uuid.pipe.js';
import { ProfileService } from '#profile/profile.service.js';
import { CreateProfileDTO, UpdateProfileDTO } from '#profile/type/profile.dto.js';

@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Post()
  postProfile(@Body() body: CreateProfileDTO) {
    return this.profileService.createProfile(body);
  }

  @Get(':id')
  getProfileById(@Param('id', UUIDPipe) id: string) {
    return this.profileService.findProfileById(id);
  }

  @Patch(':id')
  patchProfile(@Param('id', UUIDPipe) id: string, @Body() body: UpdateProfileDTO) {
    return this.profileService.updateProfile(id, body);
  }
}
