export interface IEmailService {
  validateEmailDomain(email: string): Promise<boolean>;
  generateVerificationCode(): string;
  saveVerificationCode(
    email: string,
    code: string,
    ttl?: number,
  ): Promise<{ key: string; value: any; ttl?: number }>;
  sendEmail(email: string, code: string): Promise<void>;
  verifyCode(email: string, code: string): Promise<boolean>;
  markEmailAsVerified(email: string): Promise<{ key: string; value: any; ttl?: number }>;
  isEmailVerified(email: string): Promise<boolean>;
  removeEmailVerification(email: string): Promise<{ key: string; previousValue?: any; deleted: boolean }>;
}
