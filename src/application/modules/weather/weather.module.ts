import { Module } from '@nestjs/common';
import { WeatherHandlersController } from 'src/interface/controllers/weather.controller';

import { WeatherProviderModule } from './weather-provider.module';
import { WeatherFactory } from '../../factories/weather-factory';
import { WeatherService } from '../../weather/weather.service';
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
  controllers: [WeatherHandlersController],
  providers: [
    WeatherService,
    WeatherFactory,
    {
      provide: WeatherService,
      useFactory: (factory: WeatherFactory) => factory.create(),
      inject: [WeatherFactory],
    },
  ],
  exports: [WeatherService],
})
export class WeatherModule {}
