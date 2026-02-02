import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '@/src/infra/prisma/prisma.service';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
import { FilesService } from '@/src/modules/events/files/files.service';
import { OrganizationRole } from '@prisma-client/enums';
import { Prisma } from '@prisma-client/client';

@Injectable()
export class OrganizationService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly filesService: FilesService,
  ) {}

  async findAll(filters: { mine?: boolean; userId?: string } = {}) {
    const where: Prisma.OrganizationWhereInput = {};

    if (filters.mine && filters.userId) {
      where.subscribers = {
        some: {
          userId: filters.userId,
          role: OrganizationRole.OWNER,
        },
      };
    }

    return this.prisma.organization.findMany({
      where,
      include: {
        photo: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const organization = await this.prisma.organization.findUnique({
      where: { id },
      include: {
        photo: true,
        subscribers: true,
      },
    });

    if (!organization) {
      throw new NotFoundException('Organization not found');
    }

    return organization;
  }

  async create(userId: string, dto: CreateOrganizationDto) {
    return this.prisma.organization.create({
      data: {
        name: dto.name,
        description: dto.description,
        subscribers: {
          create: {
            userId,
            role: OrganizationRole.OWNER,
          },
        },
      },
      include: {
        subscribers: true,
      },
    });
  }

  async update(
    userId: string,
    organizationId: string,
    dto: UpdateOrganizationDto,
  ) {
    await this.assertOwner(userId, organizationId);

    return this.prisma.organization.update({
      where: { id: organizationId },
      data: dto,
    });
  }

  async addPhoto(
    userId: string,
    organizationId: string,
    file: Express.Multer.File,
  ) {
    await this.assertOwner(userId, organizationId);

    return this.filesService.uploadPublicFile(file, organizationId);
  }

  async subscribe(userId: string, organizationId: string) {
    return this.prisma.userSubscription.create({
      data: {
        userId,
        organizationId,
      },
    });
  }

  async unsubscribe(userId: string, organizationId: string) {
    const subscribe = await this.prisma.userSubscription.findUnique({
      where: {
        userId_organizationId: {
          userId,
          organizationId,
        },
      },
    });

    if (subscribe?.role === OrganizationRole.OWNER) {
      throw new BadRequestException('You cant unsubscribe your organization');
    }

    return this.prisma.userSubscription.delete({
      where: {
        userId_organizationId: {
          userId,
          organizationId,
        },
      },
    });
  }

  private async assertOwner(userId: string, organizationId: string) {
    const subscription = await this.prisma.userSubscription.findUnique({
      where: {
        userId_organizationId: {
          userId,
          organizationId,
        },
      },
    });

    if (!subscription || subscription.role !== OrganizationRole.OWNER) {
      throw new ForbiddenException('You are not owner of this organization');
    }
  }
}
