import { Module } from '@nestjs/common';
import { WeatherUseCase } from 'src/use-cases/weather-updates/get-weather.use-case';

import { WeatherProviderModule } from './weather-provider.module';
import { WeatherFactory } from '../../factories/weather-factory';
import { CacheWeatherModule } from '../cache/cache-weather.module';
import { RedisModule } from '../cache/redis.module';
import { GeocodingModule } from '../infrastructure/geocoding.module';

@Module({
  imports: [
    WeatherProviderModule,
    RedisModule,
    CacheWeatherModule,
    GeocodingModule,
  ],
  providers: [
    WeatherUseCase,
    WeatherFactory,
    {
      provide: WeatherUseCase,
      useFactory: (factory: WeatherFactory) => factory.create(),
      inject: [WeatherFactory],
    },
  ],
  exports: [WeatherUseCase],
})
export class WeatherModule {}
