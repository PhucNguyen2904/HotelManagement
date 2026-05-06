import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { RoomTypesService } from './room-types.service';
import { CreateRoomTypeDto, UpdateRoomTypeDto } from './dto/room-type.dto';
import { RoomTypeQueryDto } from './dto/room-type-query.dto';
import { Public } from '../../common/decorators/public.decorator';
import { Roles } from '../../common/decorators/roles.decorator';

@ApiTags('Room Types')
@Controller('hotels/:hotelId/room-types')
export class RoomTypesController {
  constructor(private readonly roomTypesService: RoomTypesService) {}

  @Post()
  @ApiBearerAuth()
  @Roles('SUPER_ADMIN', 'HOTEL_ADMIN')
  @ApiOperation({ summary: 'Create room type for a hotel' })
  create(@Param('hotelId') hotelId: string, @Body() dto: CreateRoomTypeDto) {
    return this.roomTypesService.create(hotelId, dto);
  }



  @Get('by-slug/:slug')
  @Public()
  @ApiOperation({ summary: 'Get room type by slug (SEO-friendly URL)' })
  findBySlug(@Param('hotelId') hotelId: string, @Param('slug') slug: string) {
    return this.roomTypesService.findBySlug(hotelId, slug);
  }

  @Get(':id')
  @Public()
  @ApiOperation({ summary: 'Get room type by ID' })
  findOne(@Param('id') id: string) {
    return this.roomTypesService.findOne(id);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @Roles('SUPER_ADMIN', 'HOTEL_ADMIN')
  @ApiOperation({ summary: 'Update room type' })
  update(@Param('id') id: string, @Body() dto: UpdateRoomTypeDto) {
    return this.roomTypesService.update(id, dto);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @Roles('SUPER_ADMIN', 'HOTEL_ADMIN')
  @ApiOperation({ summary: 'Deactivate room type' })
  remove(@Param('id') id: string) {
    return this.roomTypesService.remove(id);
  }
}
