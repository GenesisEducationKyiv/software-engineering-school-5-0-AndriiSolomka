import { ConfigifyModule } from '@itgorillaz/configify';
import { Module } from '@nestjs/common';
import { WeatherToken } from 'apps/weather/src/core/weather.interface';
import { GeocodingConfig } from 'libs/config/geocoding.config';
import { RedisModule } from 'libs/infrastructure/cache/providers/redis.module';
import { GeocodingModule } from 'libs/infrastructure/geocoding/geocoding.module';
import { HttpClientModule } from 'libs/infrastructure/http/http-client.module';
import { LoggerModule } from 'libs/infrastructure/logger/logger.module';

import { CacheWeatherModule } from './infrastructure/cache/cache-weather.module';
import { MetricsModule } from './infrastructure/metrics/metrics.module';
import { WeatherProviderModule } from './infrastructure/providers/weather-provider.module';
import { WeatherController } from './interfaces/weather.controller';
import { WeatherFactory } from './weather.factory';

@Module({
  imports: [
    ConfigifyModule.forRootAsync({}),
    WeatherProviderModule,
    RedisModule,
    CacheWeatherModule,
    GeocodingConfig,
    GeocodingModule,
    HttpClientModule,
    LoggerModule,
    MetricsModule,
  ],
  controllers: [WeatherController],
  providers: [
    WeatherFactory,
    {
      provide: WeatherToken,
      useFactory: (factory: WeatherFactory) => factory.create(),
      inject: [WeatherFactory],
    },
  ],
})
export class AppModule {}
