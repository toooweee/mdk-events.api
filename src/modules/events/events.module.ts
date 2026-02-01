import { Module } from '@nestjs/common';
import { EventModule } from '@/src/modules/events/event/event.module';
import { OrganizationModule } from '@/src/modules/events/organization/organization.module';
import { FilesModule } from '@/src/modules/events/files/files.module';

@Module({
  imports: [EventModule, OrganizationModule, FilesModule],
})
export class EventsModule {}
