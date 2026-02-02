import { IsNotEmpty, IsString } from 'class-validator';

export class RegisterToEventDto {
  @IsNotEmpty()
  @IsString()
  userId: string;

  @IsNotEmpty()
  @IsString()
  eventId: string;
}
