import { Controller, Post } from '@nestjs/common';
import { S3Service } from './s3.service.js';

@Controller()
export class S3Controller {
  constructor(private readonly s3Service: S3Service) {}

  @Post()
  async createPresignedUrl(fileName: string, contentType: string): Promise<String> {
    return await this.s3Service.generatePresignedUrl(fileName, contentType);
  }

  @Post()
  async getPresignedDownloadUrl(key: string): Promise<string> {
    return await this.s3Service.getPresignedDownloadUrl(key);
  }
}
