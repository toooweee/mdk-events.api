import { PartialType } from '@nestjs/mapped-types';
import { CreateEventDto } from '@/src/modules/events/event/dto/create-event.dto';

export class UpdateEventDto extends PartialType(CreateEventDto) {}
