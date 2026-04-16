import { Controller, Get, Query, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { AvailabilityService } from './availability.service';
import { Public } from '../../common/decorators/public.decorator';

@ApiTags('Availability')
@Controller('availability')
export class AvailabilityController {
  constructor(private readonly availabilityService: AvailabilityService) {}

  @Get('search')
  @Public()
  @ApiOperation({ summary: 'Search available rooms by date range' })
  @ApiQuery({ name: 'hotelId', required: true })
  @ApiQuery({ name: 'checkIn', required: true, example: '2026-04-01' })
  @ApiQuery({ name: 'checkOut', required: true, example: '2026-04-03' })
  checkAvailability(
    @Query('hotelId') hotelId: string,
    @Query('checkIn') checkIn: string,
    @Query('checkOut') checkOut: string,
  ) {
    return this.availabilityService.checkAvailability(hotelId, checkIn, checkOut);
  }

  @Get('calendar/:roomId')
  @Public()
  @ApiOperation({ summary: 'Get room availability calendar' })
  @ApiQuery({ name: 'month', required: true, example: 4 })
  @ApiQuery({ name: 'year', required: true, example: 2026 })
  getRoomCalendar(
    @Param('roomId') roomId: string,
    @Query('month') month: number,
    @Query('year') year: number,
  ) {
    return this.availabilityService.getRoomCalendar(roomId, +month, +year);
  }
}
