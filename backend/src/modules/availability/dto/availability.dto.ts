import { IsDateString, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CheckAvailabilityDto {
  @ApiProperty({ example: 'hotel-cuid' })
  @IsString()
  hotelId: string;

  @ApiProperty({ example: '2026-04-01' })
  @IsDateString()
  checkIn: string;

  @ApiProperty({ example: '2026-04-03' })
  @IsDateString()
  checkOut: string;
}
