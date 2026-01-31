import { Module } from '@nestjs/common';
import { EventService } from '@/src/modules/events/event/event.service';
import { PrismaModule } from '@/src/infra/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [EventService],
})
export class EventModule {}
