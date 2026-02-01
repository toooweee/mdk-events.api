import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { PrismaService } from '@/src/infra/prisma/prisma.service';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class FilesService {
  constructor(
    @Inject('S3_CLIENT')
    private readonly s3: S3Client,
    @Inject('S3_PUBLIC_BUCKET')
    private readonly bucket: string,
    @Inject('S3_ENDPOINT')
    private readonly endpoint: string,
    private readonly prismaService: PrismaService,
  ) {}

  async uploadPublicFile(file: Express.Multer.File, organizationId: string) {
    const key = `${uuidv4()}-${file.originalname}`;
    const url = `${this.endpoint}/${this.bucket}/${key}`;
    const urlExpo = `${this.bucket}/${key}`;

    try {
      await this.s3.send(
        new PutObjectCommand({
          Bucket: this.bucket,
          Key: key,
          Body: file.buffer,
          ContentType: file.mimetype,
        }),
      );

      return this.prismaService.publicFile.create({
        data: {
          key,
          url,
          urlExpo,
          organizationId,
        },
      });
    } catch (e) {
      console.log(e);
      throw new InternalServerErrorException(
        'Something went wrong uploading file',
      );
    }
  }
}
