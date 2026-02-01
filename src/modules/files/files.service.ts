import { Inject, Injectable } from '@nestjs/common';
import { S3Client } from '@aws-sdk/client-s3';
import { PrismaService } from '@/src/infra/prisma/prisma.service';

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

  async uploadPublicFile() {}
}
