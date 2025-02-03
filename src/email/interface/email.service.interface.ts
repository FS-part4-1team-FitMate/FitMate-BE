export interface IEmailService {
  validateEmailDomain(email: string): Promise<boolean>;
  generateVerificationCode(): string;
  saveVerificationCode(email: string, code: string): Promise<{ key: string; value: any; ttl?: number }>;
  sendVerificationCode(email: string, code: string): Promise<void>;
  verifyCode(email: string, code: string): Promise<boolean>;
}
