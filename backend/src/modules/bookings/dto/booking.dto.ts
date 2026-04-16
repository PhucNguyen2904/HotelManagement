import {
  IsString,
  IsDateString,
  IsInt,
  IsOptional,
  IsArray,
  ValidateNested,
  Min,
  IsEmail,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class BookingRoomDto {
  @ApiProperty({ example: 'room-cuid' })
  @IsString()
  roomId: string;

  @ApiPropertyOptional({ example: 2 })
  @IsOptional()
  @IsInt()
  @Min(1)
  adults?: number;

  @ApiPropertyOptional({ example: 0 })
  @IsOptional()
  @IsInt()
  @Min(0)
  children?: number;
}

export class CreateBookingDto {
  @ApiProperty({ example: 'hotel-cuid' })
  @IsString()
  hotelId: string;

  @ApiProperty({ example: '2026-04-01' })
  @IsDateString()
  checkIn: string;

  @ApiProperty({ example: '2026-04-03' })
  @IsDateString()
  checkOut: string;

  @ApiProperty({ type: [BookingRoomDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BookingRoomDto)
  rooms: BookingRoomDto[];

  @ApiPropertyOptional({ example: 'Nguyễn Văn A' })
  @IsOptional()
  @IsString()
  guestName?: string;

  @ApiPropertyOptional({ example: 'guest@email.com' })
  @IsOptional()
  @IsEmail()
  guestEmail?: string;

  @ApiPropertyOptional({ example: '0901234567' })
  @IsOptional()
  @IsString()
  guestPhone?: string;

  @ApiPropertyOptional({ example: '001234567890' })
  @IsOptional()
  @IsString()
  guestIdNumber?: string;

  @ApiPropertyOptional({ example: 'Late check-in around 10pm' })
  @IsOptional()
  @IsString()
  specialRequests?: string;
}
