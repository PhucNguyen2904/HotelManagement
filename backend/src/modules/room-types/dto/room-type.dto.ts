import {
  IsString,
  IsOptional,
  IsNumber,
  IsInt,
  IsEnum,
  Min,
  Max,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { BedType } from '@prisma/client';

export class CreateRoomTypeDto {
  @ApiProperty({ example: 'Phòng đôi giường đơn' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'phong-doi-giuong-don' })
  @IsString()
  slug: string;

  @ApiPropertyOptional({ example: 'Phòng rộng rãi với 2 giường đơn, phù hợp cho 2 người' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: 500000 })
  @IsNumber()
  @Min(0)
  basePrice: number;

  @ApiPropertyOptional({ example: 2, description: 'Số người lớn tối đa' })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(10)
  maxAdults?: number;

  @ApiPropertyOptional({ example: 1, description: 'Số trẻ em tối đa' })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(5)
  maxChildren?: number;

  @ApiPropertyOptional({
    enum: BedType,
    default: BedType.DOUBLE,
    description: 'Loại giường: SINGLE (đơn), DOUBLE (đôi), TWIN (2 đơn), QUEEN, KING',
  })
  @IsOptional()
  @IsEnum(BedType)
  bedType?: BedType;

  @ApiPropertyOptional({
    example: 1,
    description: 'Số lượng giường. Twin room = 2, Single/Double = 1',
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(4)
  bedCount?: number;

  @ApiPropertyOptional({ example: 25.5, description: 'Diện tích phòng (m²)' })
  @IsOptional()
  @IsNumber()
  @Min(1)
  areaSize?: number;
}

export class UpdateRoomTypeDto extends PartialType(CreateRoomTypeDto) {}
