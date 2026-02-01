import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { OrganizationService } from '@/src/modules/events/organization/organization.service';
import { User } from '@/src/modules/iam/shared/decorators/current-user.decorator';
import { CreateOrganizationDto } from '@/src/modules/events/organization/dto/create-organization.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { UpdateOrganizationDto } from '@/src/modules/events/organization/dto/update-organization.dto';
import { type CurrentUser } from '@/src/modules/iam/shared/iam.types';

@Controller('organization')
export class OrganizationController {
  constructor(private readonly organizationService: OrganizationService) {}

  @Get()
  async findAll() {
    return this.organizationService.findAll();
  }

  @Post()
  async create(
    @User() currentUser: CurrentUser,
    @Body() createOrganizationDto: CreateOrganizationDto,
  ) {
    return this.organizationService.create(
      currentUser.id,
      createOrganizationDto,
    );
  }

  @Patch('photo/:id')
  @UseInterceptors(FileInterceptor('photo'))
  async addPhoto(
    @User() currentUser: CurrentUser,
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('File is required');
    }

    return this.organizationService.addPhoto(currentUser.id, id, file);
  }

  // @Post(':id')
  // async subscribe(@User() currentUser: CurrentUser, @Param('id') id: string) {
  //   return this.organizationService.subscribe(currentUser.id, id);
  // }

  @Patch(':id')
  async update(
    @User() currentUser: CurrentUser,
    @Param('id') id: string,
    @Body() updateOrganizationDto: UpdateOrganizationDto,
  ) {
    return this.organizationService.update(
      currentUser.id,
      id,
      updateOrganizationDto,
    );
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.organizationService.findOne(id);
  }
}
