import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UnauthorizedException,
} from '@nestjs/common';
import { EventService } from '@/src/modules/events/event/event.service';
import { CreateEventDto } from '@/src/modules/events/event/dto/create-event.dto';
import { UpdateEventDto } from '@/src/modules/events/event/dto/update-event.dto';
import { User } from '@/src/modules/iam/shared/decorators/current-user.decorator';
import { type CurrentUser } from '@/src/modules/iam/shared/iam.types';

@Controller('events')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Get()
  async findAll(
    @Query('mine') mine?: string,
    @Query('available') available?: string,
    @User() currentUser?: CurrentUser,
  ) {
    const filters: { mine?: boolean; available?: boolean } = {};

    if (mine === 'true') {
      filters.mine = true;
    }

    if (available === 'true') {
      filters.available = true;
    }

    return this.eventService.findAll(filters, currentUser?.id);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.eventService.findOne(id);
  }

  @Post()
  async create(
    @User() currentUser: CurrentUser,
    @Body() createEventDto: CreateEventDto,
  ) {
    return this.eventService.create(currentUser.id, createEventDto);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @User() currentUser: CurrentUser,
    @Body() updateEventDto: UpdateEventDto,
  ) {
    return this.eventService.update(id, currentUser.id, updateEventDto);
  }

  @Post(':id/register')
  async register(@Param('id') id: string, @User() currentUser: CurrentUser) {
    if (!currentUser) {
      throw new UnauthorizedException('Требуется авторизация');
    }
    return this.eventService.register(currentUser.id, id);
  }

  @Delete(':id/register')
  async unregister(@Param('id') id: string, @User() currentUser: CurrentUser) {
    return this.eventService.unregister(currentUser.id, id);
  }
}
