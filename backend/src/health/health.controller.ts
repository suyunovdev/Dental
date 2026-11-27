import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { HealthService } from './health.service.js';
import { Public } from '../common/decorators/public.decorator.js';

@ApiTags('health')
@Controller('health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get()
  @Public()
  @ApiOperation({ summary: 'Tizim va ma\'lumotlar bazasi holatini tekshirish' })
  @ApiResponse({
    status: 200,
    description: 'Tizim va baza muvaffaqiyatli ishlamoqda',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string', example: 'ok' },
        db: { type: 'string', example: 'ok' },
        version: { type: 'string', example: 'dev' },
      },
    },
  })
  async check() {
    return this.healthService.check();
  }
}
