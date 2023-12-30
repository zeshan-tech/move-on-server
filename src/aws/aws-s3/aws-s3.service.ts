import { Injectable } from '@nestjs/common';
import { GetObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl as awsGetSignedUrl } from '@aws-sdk/s3-request-presigner';
import { ConfigService } from '@nestjs/config';
import { RadisService } from 'src/radis/radis.service';
import { RadisInputDto } from 'src/radis/dto/radis.input.dto';
import { AwsS3OutputDto } from './dto/aws-s3.output.dto';
import { MovierMediaEnum } from 'src/common/enum/common.enum';

@Injectable()
export class AwsS3Service {
  private s3Client: S3Client;
  private linkTtl: number;

  constructor(private readonly configService: ConfigService, private readonly radisService: RadisService) {
    this.linkTtl = this.configService.get<number>('VIDEO_LINK_TTL');

    this.s3Client = new S3Client({
      region: this.configService.get<string>('AWS_REGION'),
      credentials: {
        accessKeyId: this.configService.get<string>('S3_ACCESS_KEY'),
        secretAccessKey: this.configService.get<string>('S3_SECRET_ACCESS_KEY'),
      },
    });
  }

  async generateVideoUploadUrl(mine: VideoMineType, currentManager: CurrentManagerType, type: MovierMediaEnum): Promise<AwsS3OutputDto.GetS3SignedUrlOutput> {
    try {
      const key = this.generateKey(currentManager, type);
      const command = this.createPutObjectCommand(key, this.configService.get<string>('S3_VIDEO_BUCKET'), mine);

      const signedUrl = await this.getSignedUrl(command);
      const signedUrlKeyId = await this.storeS3KeyInTempStorage(key);

      return { url: signedUrl, keyId: signedUrlKeyId };
    } catch (error) {
      throw new Error(error);
    }
  }

  async generateShortUploadUrl(mine: VideoMineType, currentManager: CurrentManagerType) {
    const key = this.generateKey(currentManager, MovierMediaEnum.SHORT);
    const command = this.createPutObjectCommand(key, this.configService.get<string>('S3_SHORT_BUCKET'), mine);

    return this.getSignedUrl(command);
  }

  async getMediaObjectKey(key: string) {
    const command = this.createGetObjectCommand(key, this.configService.get<string>('S3_VIDEO_BUCKET'));

    return this.getSignedUrl(command);
  }

  private generateKey(currentManager: CurrentManagerType, type: MovierMediaEnum): string {
    return `${currentManager.ID}/${type}/${Date.now()}`;
  }

  private createPutObjectCommand(key: string, bucket: string, contentType: VideoMineType): PutObjectCommand {
    return new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      ContentType: contentType,
    });
  }

  private createGetObjectCommand(key: string, bucket: string): GetObjectCommand {
    return new GetObjectCommand({
      Bucket: bucket,
      Key: key,
    });
  }

  private async getSignedUrl(command: PutObjectCommand | GetObjectCommand): Promise<string> {
    try {
      return awsGetSignedUrl(this.s3Client, command, { expiresIn: this.linkTtl });
    } catch (error) {
      throw new Error(error);
    }
  }

  private async storeS3KeyInTempStorage(key: string): Promise<string> {
    try {
      const input: RadisInputDto.StoreStringValueInTempStorageInput = {
        Value: key,
        Service: 'awsS3',
        TTL: this.linkTtl,
      };

      const storedKey = await this.radisService.storeStringValueInTempStorage(input);
      return storedKey.ID;
    } catch (error) {
      throw new Error(error);
    }
  }
}
