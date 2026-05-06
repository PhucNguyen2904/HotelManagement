import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Query,
  Header,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { HotelsService } from './hotels.service';
import { RoomTypesService } from '../room-types/room-types.service';
import { RoomTypeQueryDto } from '../room-types/dto/room-type-query.dto';
import { CreateHotelDto, UpdateHotelDto } from './dto/hotel.dto';
import { Public } from '../../common/decorators/public.decorator';
import { Roles } from '../../common/decorators/roles.decorator';

@ApiTags('Hotels')
@Controller('hotels')
export class HotelsController {
  constructor(
    private readonly hotelsService: HotelsService,
    private readonly roomTypesService: RoomTypesService,
  ) {}

  @Post()
  @ApiBearerAuth()
  @Roles('SUPER_ADMIN')
  @ApiOperation({ summary: 'Create hotel (super admin only)' })
  create(@Body() dto: CreateHotelDto) {
    return this.hotelsService.create(dto);
  }

  @Get()
  @Public()
  @ApiOperation({ summary: 'Get all hotels' })
  findAll() {
    return this.hotelsService.findAll();
  }

  @Get(':id/room-types')
  @Public()
  @Header('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate')
  @Header('Pragma', 'no-cache')
  @Header('Expires', '0')
  @ApiOperation({ summary: 'Get all room types for a hotel (public search)' })
  @ApiQuery({ name: 'checkIn', required: false, example: '2026-04-16' })
  @ApiQuery({ name: 'checkOut', required: false, example: '2026-04-17' })
  @ApiQuery({ name: 'adults', required: false, type: Number, example: 2 })
  findRoomTypes(
    @Param('id') id: string,
    @Query() query: RoomTypeQueryDto,
  ) {
    return this.roomTypesService.findPublicByHotel(id, query);
  }

  @Get(':id')
  @Public()
  @ApiOperation({ summary: 'Get hotel by ID' })
  findOne(@Param('id') id: string) {
    return this.hotelsService.findOne(id);
  }

  @Get('slug/:slug')
  @Public()
  @ApiOperation({ summary: 'Get hotel by slug' })
  findBySlug(@Param('slug') slug: string) {
    return this.hotelsService.findBySlug(slug);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @Roles('SUPER_ADMIN', 'HOTEL_ADMIN')
  @ApiOperation({ summary: 'Update hotel' })
  update(@Param('id') id: string, @Body() dto: UpdateHotelDto) {
    return this.hotelsService.update(id, dto);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @Roles('SUPER_ADMIN')
  @ApiOperation({ summary: 'Deactivate hotel' })
  remove(@Param('id') id: string) {
    return this.hotelsService.remove(id);
  }
}
