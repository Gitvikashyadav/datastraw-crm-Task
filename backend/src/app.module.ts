import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import configuration from './config/configuration.js';
import { DatabaseModule } from './database/database.module.js';
import { HealthController } from './module/health/health.controller.js';
import { TicketsModule } from './module/tickets/tickets.module.js';
import { validationSchema } from './config/validation.schema.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      validationSchema,
    }),
    DatabaseModule,
    TicketsModule,
  ],
  controllers: [HealthController],
})
export class AppModule {}