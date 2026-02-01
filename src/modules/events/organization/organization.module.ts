import { Module } from '@nestjs/common';
import { PrismaModule } from '@/src/infra/prisma/prisma.module';
import { OrganizationService } from '@/src/modules/events/organization/organization.service';
import { FilesModule } from '@/src/modules/events/files/files.module';
import { OrganizationController } from '@/src/modules/events/organization/organization.controller';

@Module({
  imports: [PrismaModule, FilesModule],
  controllers: [OrganizationController],
  providers: [OrganizationService],
})
export class OrganizationModule {}
