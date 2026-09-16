import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

/**
 * Wraps MongooseModule.forRootAsync so the Atlas URI is pulled from
 * ConfigService (which has already validated it exists) rather than
 * reading process.env directly here. Keeps all DB wiring in one place.
 */
@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('mongodbUri'),
      }),
    }),
  ],
})
export class DatabaseModule {}