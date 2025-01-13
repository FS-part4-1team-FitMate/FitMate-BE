import { Controller, Get, Post, Body, Patch, Param, UseGuards, UseInterceptors } from '@nestjs/common';
import { UUIDPipe } from '#common/uuid.pipe.js';
import { AccessTokenGuard } from '#auth/guard/access-token.guard.js';
import { RoleInterceptor } from '#profile/interceptor/role.interceptor.js';
import { ProfileService } from '#profile/profile.service.js';
import { CreateProfileDTO, UpdateProfileDTO } from '#profile/type/profile.dto.js';

@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Post()
  @UseGuards(AccessTokenGuard)
  @UseInterceptors(RoleInterceptor)
  async postProfile(@Body() body: CreateProfileDTO) {
    const { role, ...restBody } = body;
    return this.profileService.createProfile(restBody);
  }

  @Get(':id')
  getProfileById(@Param('id', UUIDPipe) id: string) {
    return this.profileService.findProfileById(id);
  }

  @Patch(':id')
  @UseGuards(AccessTokenGuard)
  patchProfile(@Param('id', UUIDPipe) id: string, @Body() body: UpdateProfileDTO) {
    return this.profileService.updateProfile(id, body);
  }
}
