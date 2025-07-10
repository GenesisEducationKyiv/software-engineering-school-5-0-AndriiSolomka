import { Module } from '@nestjs/common';
import { CacheWeatherModule } from 'src/application/modules/cache/cache-weather.module';
import { RedisModule } from 'src/application/modules/cache/redis.module';
import { GeocodingModule } from 'src/application/modules/infrastructure/geocoding.module';
import { HttpClientModule } from 'src/application/modules/infrastructure/http-client.module';
import { WeatherToken } from 'src/core/abstracts/weather/weather.interface';

import { WeatherApiClient } from './client/weather-api.client';
import { WeatherInternalController } from './controllers/weather.controller';
import { WeatherProviderModule } from './providers/weather-provider.module';
import { WeatherService } from './services/weather.service';
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
      useClass: WeatherService,
    },
    {
      provide: WeatherToken,
      useFactory: (factory: WeatherFactory) => factory.create(),
      inject: [WeatherFactory],
    },
  ],
  exports: [WeatherApiClient],
})
export class InternalWeatherModule {}
