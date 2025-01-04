// import { PartialType } from '@nestjs/mapped-types';
// import { Role } from '@prisma/client';
// import { IsNotEmpty, IsNumber, IsEnum, IsString, IsOptional } from 'class-validator';

// export class InputCreateUserDTO {
//   @IsNotEmpty()
//   @IsString()
//   name: string;

//   @IsNotEmpty()
//   @IsString()
//   email: string;

//   @IsNotEmpty()
//   @IsString()
//   password: string;

//   @IsOptional()
//   @IsString()
//   phone: string;

//   @IsNotEmpty()
//   @IsEnum(Role)
//   role: Role;
// }

// export class InputUpdateUserDTO extends PartialType(InputCreateUserDTO) {}
