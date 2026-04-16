import { IsNumber, IsEnum, IsOptional, IsString, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PaymentMethod } from '@prisma/client';

export class CreatePaymentDto {
  @ApiProperty({ example: 'booking-cuid' })
  @IsString()
  bookingId: string;

  @ApiProperty({ example: 1500000 })
  @IsNumber()
  @Min(1000)
  amount: number;

  @ApiProperty({ enum: PaymentMethod, example: 'BANK_TRANSFER' })
  @IsEnum(PaymentMethod)
  method: PaymentMethod;

  @ApiPropertyOptional({ example: 'VCB-123456789' })
  @IsOptional()
  @IsString()
  transactionRef?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  notes?: string;
}
