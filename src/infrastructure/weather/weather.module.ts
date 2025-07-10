import { Module } from '@nestjs/common';
import { CacheWeatherModule } from 'src/application/modules/cache/cache-weather.module';
import { GeocodingModule } from 'src/infrastructure/libs/geocoding/geocoding.module';
import { HttpClientModule } from 'src/infrastructure/libs/http/http-client.module';
import { WeatherToken } from 'src/core/abstracts/weather/weather.interface';

import { WeatherApiClient } from './api/client/weather.client';
import { WeatherInternalController } from './api/controllers/weather.controller';
import { WeatherProviderModule } from './providers/weather-provider.module';
import { WeatherFactory } from './weather.factory';
import { RedisModule } from '../libs/redis/redis.module';

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
