import { Module } from '@nestjs/common';
import { PrismaModule } from '@/src/infra/prisma/prisma.module';
import { OrganizationService } from '@/src/modules/events/organization/organization.service';

@Module({
  imports: [PrismaModule],
  providers: [OrganizationService],
})
export class OrganizationModule {}
