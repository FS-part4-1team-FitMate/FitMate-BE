import { Controller, Post } from '@nestjs/common';
import { S3Service } from './s3.service.js';

@Controller()
export class S3Controller {
  constructor(private readonly s3Service: S3Service) {}

  @Post()
  async getPresignedUrl(fileName: string, contentType: string): Promise<String> {
    const presignedUrl = await this.s3Service.generatePresignedUrl(fileName, contentType);
    return presignedUrl;
  }
}
