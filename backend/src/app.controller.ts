import { Controller, Get, HttpCode } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Public } from './common/decorators/public.decorator';

@ApiTags('Health Check')
@Controller()
export class AppController {
  @Public()
  @Get()
  @HttpCode(200)
  @ApiOperation({ summary: 'Health check endpoint for Render.com' })
  getHealth() {
    return { status: 'ok', timestamp: new Date().toISOString() };
  }
}
