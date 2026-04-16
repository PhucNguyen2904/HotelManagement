import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { RoomsService } from './rooms.service';
import { CreateRoomDto, UpdateRoomDto } from './dto/room.dto';
import { Public } from '../../common/decorators/public.decorator';
import { Roles } from '../../common/decorators/roles.decorator';

@ApiTags('Rooms')
@Controller('rooms')
export class RoomsController {
  constructor(private readonly roomsService: RoomsService) {}

  @Post()
  @ApiBearerAuth()
  @Roles('SUPER_ADMIN', 'HOTEL_ADMIN')
  @ApiOperation({ summary: 'Create a room' })
  create(@Body() dto: CreateRoomDto) {
    return this.roomsService.create(dto);
  }

  @Get('hotel/:hotelId')
  @Public()
  @ApiOperation({ summary: 'Get all rooms for a hotel' })
  findAll(@Param('hotelId') hotelId: string) {
    return this.roomsService.findAllByHotel(hotelId);
  }

  @Get(':id')
  @Public()
  @ApiOperation({ summary: 'Get room by ID' })
  findOne(@Param('id') id: string) {
    return this.roomsService.findOne(id);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @Roles('SUPER_ADMIN', 'HOTEL_ADMIN')
  @ApiOperation({ summary: 'Update room' })
  update(@Param('id') id: string, @Body() dto: UpdateRoomDto) {
    return this.roomsService.update(id, dto);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @Roles('SUPER_ADMIN', 'HOTEL_ADMIN')
  @ApiOperation({ summary: 'Deactivate room' })
  remove(@Param('id') id: string) {
    return this.roomsService.remove(id);
  }
}
