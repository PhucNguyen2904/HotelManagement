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
  @ApiProperty({ example: 'room-type-cuid' })
  @IsString()
  roomTypeId: string;

  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @IsInt()
  @Min(1)
  quantity?: number;

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

  @ApiPropertyOptional({ 
    type: [BookingRoomDto],
    description: 'Rooms to assign. If empty, use getAvailableRooms to find and assign rooms later'
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BookingRoomDto)
  rooms?: BookingRoomDto[];

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

export class AssignRoomsDto {
  @ApiProperty({
    example: ['room-cuid-1', 'room-cuid-2'],
    description: 'Array of room IDs to assign to the booking',
  })
  @IsArray()
  @IsString({ each: true })
  roomIds: string[];
}

export class AvailableRoomsDto {
  bookingId: string;
  roomsNeeded: number;
  checkIn: string;
  checkOut: string;
  rooms: {
    id: string;
    roomNumber: string;
    roomTypeId: string;
    roomTypeName: string;
    floor?: number;
    status: string;
    basePrice: number;
  }[];
}
