import { Module } from '@nestjs/common';
import { EnvService } from '@/src/infra/env/env.service';
import { getAwsConfig } from '@/src/modules/files/aws.config';
import { EnvModule } from '@/src/infra/env/env.module';
import { FilesService } from '@/src/modules/files/files.service';

@Module({
  imports: [EnvModule],
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
