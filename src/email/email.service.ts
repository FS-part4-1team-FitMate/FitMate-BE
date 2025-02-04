import { BadRequestException, Injectable } from '@nestjs/common';
import crypto from 'crypto';
import { resolveMx } from 'dns/promises';
import AuthExceptionMessage from '#exception/auth-exception-message.js';
import { IEmailService } from '#email/interface/email.service.interface.js';
import { MailService } from '#mail/mail.service.js';
import { CacheService } from '#cache/cache.service.js';

@Injectable()
export class EmailService implements IEmailService {
  constructor(
    private readonly cacheService: CacheService,
    private readonly mailService: MailService,
  ) {}

  async validateEmailDomain(email: string): Promise<boolean> {
    const domain = email.split('@')[1];
    if (!domain) throw new BadRequestException(AuthExceptionMessage.EMAIL_NOT_FOUND);

    try {
      const records = await resolveMx(domain);
      return records && records.length > 0;
    } catch (e) {
      throw new BadRequestException(AuthExceptionMessage.EMAIL_NOT_FOUND);
    }
  }

  generateVerificationCode(): string {
    const code = crypto.randomInt(100000, 999999).toString();
    return code;
  }

  async saveVerificationCode(
    email: string,
    code: string,
    ttl?: number,
  ): Promise<{ key: string; value: any; ttl?: number }> {
    const result = await this.cacheService.set(email, code, 300);
    return result;
  }

  async sendEmail(email: string, code: string): Promise<void> {
    console.log(`${email}로 인증번호가 발송되었습니다.`);
    this.mailService.queueEmail(email, code);
  }

  async verifyCode(email: string, code: string): Promise<boolean> {
    const storedCode = await this.cacheService.get(email);
    return storedCode.value === code;
  }

  async markEmailAsVerified(email: string): Promise<{ key: string; value: any; ttl?: number }> {
    const result = await this.cacheService.set(email, true, 600);
    return result;
  }

  async isEmailVerified(email: string): Promise<boolean> {
    const result = await this.cacheService.get(email);
    return result.value === true;
  }

  async removeEmailVerification(
    email: string,
  ): Promise<{ key: string; previousValue?: any; deleted: boolean }> {
    const result = await this.cacheService.del(email);
    return result;
  }
}
