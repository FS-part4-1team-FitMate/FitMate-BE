import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { validateOrReject } from 'class-validator';
import { Strategy } from 'passport-local';
import { WrongFormat } from '#exception/http-exception.js';
import { AuthService } from '#auth/auth.service.js';
import { LoginDTO } from '#auth/type/auth.dto.js';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({ usernameField: 'email', passwordField: 'password' });
  }

  async validate(email: string, password: string) {
    const signInDto = new LoginDTO();
    signInDto.email = email;
    signInDto.password = password;

    try {
      await validateOrReject(signInDto);
    } catch (e) {
      throw new WrongFormat();
    }

    const user = await this.authService.getUser(email, password);
    if (!user) throw new UnauthorizedException();
    return { userId: user.id, role: user.role };
  }
}
