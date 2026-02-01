import { CreateOrganizationDto } from '@/src/modules/events/organization/dto/create-organization.dto';
import { PartialType } from '@nestjs/mapped-types';

export class UpdateOrganizationDto extends PartialType(CreateOrganizationDto) {}
