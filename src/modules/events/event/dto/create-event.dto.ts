import {
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsString,
  MinDate,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateEventDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsNumber()
  places: number;

  @Type(() => Date)
  @IsDate()
  @IsNotEmpty()
  @MinDate(new Date())
  date: Date;

  @IsNotEmpty()
  @IsString()
  organizationId: string;
}
