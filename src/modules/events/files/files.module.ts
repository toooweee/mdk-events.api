import { Module } from '@nestjs/common';
import { EnvService } from '@/src/infra/env/env.service';
import { EnvModule } from '@/src/infra/env/env.module';
import { getAwsConfig } from '@/src/modules/events/files/aws.config';
import { FilesService } from '@/src/modules/events/files/files.service';
import { PrismaModule } from '@/src/infra/prisma/prisma.module';

@Module({
  imports: [EnvModule, PrismaModule],
  providers: [
    {
      provide: 'S3_CLIENT',
      useFactory: (envService: EnvService) => getAwsConfig(envService),
      inject: [EnvService],
    },
    {
      provide: 'S3_PUBLIC_BUCKET',
      useFactory: (envService: EnvService) =>
        envService.get('MINIO_PUBLIC_BUCKET'),
      inject: [EnvService],
    },
    {
      provide: 'S3_ENDPOINT',
      useFactory: (envService: EnvService) => envService.get('MINIO_ENDPOINT'),
      inject: [EnvService],
    },
    FilesService,
  ],
  exports: ['S3_CLIENT', FilesService],
})
export class FilesModule {}
