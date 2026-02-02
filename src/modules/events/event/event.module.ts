import { Module } from '@nestjs/common';
import { EventService } from '@/src/modules/events/event/event.service';
import { PrismaModule } from '@/src/infra/prisma/prisma.module';
import { EventController } from '@/src/modules/events/event/event.controller';

@Module({
  imports: [PrismaModule],
  controllers: [EventController],
  providers: [EventService],
})
export class EventModule {}
