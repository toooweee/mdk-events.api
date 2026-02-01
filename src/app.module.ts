import { Module } from '@nestjs/common';
import { EnvModule } from '@/src/infra/env/env.module';
import { PrismaModule } from '@/src/infra/prisma/prisma.module';
import { IamModule } from '@/src/modules/iam/iam.module';
import { EventsModule } from '@/src/modules/events/events.module';

@Module({
  imports: [EnvModule, PrismaModule, IamModule, EventsModule],
})
export class AppModule {}
