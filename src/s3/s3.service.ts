import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import ExceptionMessages from '#exception/exception-message.js';

@Injectable()
export class S3Service {
  private s3Client: S3Client;
  private bucketName: string;

  constructor(private readonly configService: ConfigService) {
    const { region, accessKeyId, secretAccessKey, bucketName } = this.getValidatedEnv();

    this.bucketName = bucketName;
    this.s3Client = new S3Client({
      region,
      credentials: { accessKeyId, secretAccessKey },
    });
  }

  private getValidatedEnv() {
    const region = this.configService.get<string>('AWS_REGION');
    const accessKeyId = this.configService.get<string>('AWS_ACCESS_KEY_ID');
    const secretAccessKey = this.configService.get<string>('AWS_SECRET_ACCESS_KEY');
    const bucketName = this.configService.get<string>('AWS_BUCKET_NAME');

    if (!region || !accessKeyId || !secretAccessKey || !bucketName) {
      throw new InternalServerErrorException(ExceptionMessages.NO_ENV_VARIABLE);
    }

    return { region, accessKeyId, secretAccessKey, bucketName };
  }

  async generatePresignedUrl(fileName: string, contentType: string): Promise<string> {
    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: `${fileName}`,
      ContentType: contentType,
    });

    const presignedUrl = await getSignedUrl(this.s3Client, command, { expiresIn: 3600 });
    return presignedUrl;
  }
}
