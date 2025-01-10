import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UsePipes,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { AlsStore } from '#common/als/store-validator.js';
import { UUIDPipe } from '#common/uuid.pipe.js';
import { AccessTokenGuard } from '#auth/guard/access-token.guard.js';
import { RoleAssignPipe } from '#profile/pipe/role-assign.pipe.js';
import { ProfileService } from '#profile/profile.service.js';
import { CreateProfileDTO, UpdateProfileDTO } from '#profile/type/profile.dto.js';

@Controller('profile')
export class ProfileController {
  constructor(
    private readonly profileService: ProfileService,
    private readonly alsStore: AlsStore,
  ) {}

  @Post()
  @UseGuards(AccessTokenGuard)
  @UsePipes(RoleAssignPipe)
  async postProfile(@Body() body: CreateProfileDTO) {
    const { userId } = await this.alsStore.getStore();
    return this.profileService.createProfile(userId, body);
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
