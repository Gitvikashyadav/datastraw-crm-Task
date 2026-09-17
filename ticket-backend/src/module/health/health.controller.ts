import { Controller, Get } from '@nestjs/common';

/**
 * Simple liveness endpoint. Railway/Render/Vercel health checks and
 * uptime monitors can hit this without touching the database.
 */
@Controller('health')
export class HealthController {
  @Get()
  check() {
    return { status: 'ok', timestamp: new Date().toISOString() };
  }
}