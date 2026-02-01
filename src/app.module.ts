import { Module } from '@nestjs/common';
import { EnvModule } from '@/src/infra/env/env.module';
import { PrismaModule } from '@/src/infra/prisma/prisma.module';
import { IamModule } from '@/src/modules/iam/iam.module';

@Module({
  imports: [EnvModule, PrismaModule, IamModule],
})
export class AppModule {}
