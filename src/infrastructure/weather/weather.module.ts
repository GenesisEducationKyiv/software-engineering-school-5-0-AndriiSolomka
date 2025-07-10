import { Module } from '@nestjs/common';
import { WeatherToken } from 'src/core/abstracts/weather/weather.interface';
import { CacheWeatherModule } from 'src/infrastructure/weather/cache/cache-weather.module';
import { RedisModule } from 'src/libs/cache/providers/redis.module';
import { GeocodingModule } from 'src/libs/geocoding/geocoding.module';
import { HttpClientModule } from 'src/libs/http/http-client.module';

import { WeatherApiClient } from './api/client/weather.client';
import { WeatherInternalController } from './api/controllers/weather.controller';
import { WeatherProviderModule } from './providers/weather-provider.module';
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
