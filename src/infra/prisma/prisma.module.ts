import { Module } from '@nestjs/common';
import { PrismaService } from '@/src/infra/prisma/prisma.service';
import { EnvModule } from '@/src/infra/env/env.module';

@Module({
  imports: [EnvModule],
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
