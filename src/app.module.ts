import { Module } from '@nestjs/common';
import { LoggerModule } from './logger/logger.module';
import { FetchModule } from './fetch/fetch.module';
import { WeatherModule } from './weather/weather.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { WeatherApiClientModule } from './weather-api-client/weather-api-client.module';
import { RedisModule } from './redis/redis.module';

@Module({
  imports: [
    LoggerModule,
    FetchModule,
    WeatherModule,
    PrismaModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    WeatherApiClientModule,
    RedisModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
