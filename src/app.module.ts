import { Module } from '@nestjs/common';
import { EnvModule } from '@/src/infra/env/env.module';
import { PrismaModule } from '@/src/infra/prisma/prisma.module';
import { UserModule } from '@/src/modules/iam/user/user.module';

@Module({
  imports: [EnvModule, PrismaModule, UserModule],
})
export class AppModule {}
