import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '@/src/infra/prisma/prisma.service';
import { CreateEventDto } from '@/src/modules/events/event/dto/create-event.dto';
import { UpdateEventDto } from '@/src/modules/events/event/dto/update-event.dto';
import { Prisma } from '@prisma-client/client';

@Injectable()
export class EventService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(
    filters: { mine?: boolean; available?: boolean } = {},
    userId?: string,
  ) {
    const where: Prisma.EventWhereInput = {};

    if (filters.mine && userId) {
      where.registrations = {
        some: { userId },
      };
    }

    if (filters.available) {
      where.places = { gt: 0 };
      where.registrations = {
        none: {},
      };
    }

    return this.prisma.event.findMany({
      where,
      include: {
        organization: { select: { id: true, name: true } },
        registrations: {
          select: { userId: true },
        },
      },
      orderBy: { date: 'asc' },
    });
  }

  async findOne(id: string) {
    const event = await this.prisma.event.findUnique({
      where: { id },
      include: {
        organization: true,
        registrations: true,
      },
    });

    if (!event) {
      throw new NotFoundException(`Событие с id ${id} не найдено`);
    }

    return event;
  }

  async create(userId: string, dto: CreateEventDto) {
    const membership = await this.prisma.userSubscription.findUnique({
      where: {
        userId_organizationId: {
          userId,
          organizationId: dto.organizationId,
        },
      },
    });

    if (!membership || membership.role !== 'OWNER') {
      throw new ForbiddenException(
        'Только владелец организации может создавать события',
      );
    }

    return this.prisma.event.create({
      data: {
        name: dto.name,
        description: dto.description,
        places: dto.places,
        date: dto.date,
        organizationId: dto.organizationId,
      },
    });
  }

  async update(eventId: string, userId: string, dto: UpdateEventDto) {
    const event = await this.prisma.event.findUnique({
      where: { id: eventId },
      include: { organization: true },
    });

    if (!event) {
      throw new NotFoundException(`Событие не найдено`);
    }

    const membership = await this.prisma.userSubscription.findUnique({
      where: {
        userId_organizationId: {
          userId,
          organizationId: event.organizationId,
        },
      },
    });

    if (!membership || membership.role !== 'OWNER') {
      throw new ForbiddenException('Нет прав на редактирование события');
    }

    return this.prisma.event.update({
      where: { id: eventId },
      data: {
        name: dto.name,
        description: dto.description,
        places: dto.places,
        date: dto.date,
      },
    });
  }

  async register(userId: string, eventId: string) {
    const event = await this.prisma.event.findUnique({
      where: { id: eventId },
      include: { registrations: true },
    });

    if (!event) {
      throw new NotFoundException('Событие не найдено');
    }

    const existingRegistration = await this.prisma.eventRegistration.findUnique(
      {
        where: {
          userId_eventId: { userId, eventId },
        },
      },
    );

    if (existingRegistration) {
      throw new BadRequestException('Вы уже зарегистрированы на это событие');
    }

    const occupied = event.registrations.length;
    if (occupied >= event.places) {
      throw new BadRequestException('Места закончились');
    }

    return this.prisma.eventRegistration.create({
      data: {
        userId,
        eventId,
      },
    });
  }

  async unregister(userId: string, eventId: string) {
    const registration = await this.prisma.eventRegistration.findUnique({
      where: {
        userId_eventId: { userId, eventId },
      },
    });

    if (!registration) {
      throw new BadRequestException('Вы не зарегистрированы на это событие');
    }

    await this.prisma.eventRegistration.delete({
      where: {
        userId_eventId: { userId, eventId },
      },
    });

    return { success: true, message: 'Вы отписались от события' };
  }
}
