import { S3Client } from '@aws-sdk/client-s3';
import { EnvService } from '@/src/infra/env/env.service';

export const getAwsConfig = (envService: EnvService) => {
  return new S3Client({
    region: envService.get('MINIO_REGION_NAME'),
    endpoint: envService.get('MINIO_ENDPOINT'),
    credentials: {
      accessKeyId: envService.get('MINIO_ROOT_USER'),
      secretAccessKey: envService.get('MINIO_ROOT_PASSWORD'),
    },
    forcePathStyle: true,
  });
};
