import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { HttpExceptionFilter } from './common/filters/http-exception.filter.js';
import { TransformInterceptor } from './common/interceptors/transform.interceptor.js';
import { AppModule } from './app.module.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // Strip unknown properties and auto-transform payloads to DTO types
  // (e.g. query string "page=2" -> number 2) on every incoming request.
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new TransformInterceptor());

  app.enableCors({
    origin: configService.get<string>('corsOrigin'),
    credentials: true,
  });

  const port = configService.get<number>('port');
  await app.listen(port||3002);
  Logger.log(`🚀 Datastraw CRM API running on http://localhost:${port}`, 'Bootstrap');
}

bootstrap();