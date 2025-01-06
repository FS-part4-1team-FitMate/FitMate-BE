import { PartialType } from '@nestjs/mapped-types';
import { Role } from '@prisma/client';
import { IsNotEmpty, IsEnum, IsString } from 'class-validator';

export class InputCreateUserDTO {
  @IsNotEmpty()
  @IsString()
  nickname: string;

  @IsNotEmpty()
  @IsString()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsNotEmpty()
  @IsEnum(Role)
  role: Role;
}

export class InputUpdateUserDTO extends PartialType(InputCreateUserDTO) {}
