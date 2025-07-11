import { Module } from '@nestjs/common';
import { WeatherToken } from 'apps/weather/src/core/weather.interface';
import { RedisModule } from 'libs/infrastructure/cache/providers/redis.module';
import { GeocodingModule } from 'libs/infrastructure/geocoding/geocoding.module';
import { HttpClientModule } from 'libs/infrastructure/http/http-client.module';

import { CacheWeatherModule } from './infrastructure/cache/cache-weather.module';
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
export class AppModule {}
