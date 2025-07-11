import { Module } from '@nestjs/common';
import { WeatherToken } from 'apps/weather_api/src/infrastructure/weather/core/weather.interface';
import { CacheWeatherModule } from 'apps/weather_api/src/infrastructure/weather/infrastructure/cache/cache-weather.module';
import { RedisModule } from 'libs/infrastructure/cache/providers/redis.module';
import { GeocodingModule } from 'libs/infrastructure/geocoding/geocoding.module';
import { HttpClientModule } from 'libs/infrastructure/http/http-client.module';

import { WeatherProviderModule } from './infrastructure/providers/weather-provider.module';
import { WeatherApiClient } from './interfaces/client/weather.client';
import { WeatherInternalController } from './interfaces/controllers/weather.controller';
import { WeatherFactory } from './weather.factory';

@Module({
  imports: [
    WeatherProviderModule,
    RedisModule,
    CacheWeatherModule,
    GeocodingModule,
    HttpClientModule,
  ],
  controllers: [WeatherInternalController],
  providers: [
    WeatherApiClient,
    WeatherFactory,
    {
      provide: WeatherToken,
      useFactory: (factory: WeatherFactory) => factory.create(),
      inject: [WeatherFactory],
    },
  ],
  exports: [WeatherApiClient],
})
export class InternalWeatherModule {}
