import { IsString, IsOptional, IsInt, IsEmail, Min, Max } from 'class-validator';
import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';

export class CreateHotelDto {
  @ApiProperty({ example: 'Khách sạn Ngân Hà' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'khach-san-ngan-ha' })
  @IsString()
  slug: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: '123 Đường ABC, Quảng Ninh' })
  @IsString()
  address: string;

  @ApiProperty({ example: 'Hạ Long' })
  @IsString()
  city: string;

  @ApiProperty({ example: 'Quảng Ninh' })
  @IsString()
  province: string;

  @ApiProperty({ example: '0123456789' })
  @IsString()
  phone: string;

  @ApiProperty({ example: 'info@khachsannganha.com' })
  @IsEmail()
  email: string;

  @ApiPropertyOptional({ example: 'https://khachsannganha.com' })
  @IsOptional()
  @IsString()
  website?: string;

  @ApiPropertyOptional({ example: 3, minimum: 1, maximum: 5 })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(5)
  starRating?: number;

  @ApiPropertyOptional({ example: '14:00' })
  @IsOptional()
  @IsString()
  checkInTime?: string;

  @ApiPropertyOptional({ example: '12:00' })
  @IsOptional()
  @IsString()
  checkOutTime?: string;
}

export class UpdateHotelDto extends PartialType(CreateHotelDto) {}
