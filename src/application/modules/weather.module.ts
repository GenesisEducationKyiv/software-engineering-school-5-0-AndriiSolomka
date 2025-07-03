import { Module } from '@nestjs/common';
import { WeatherProviderModule } from './weather-provider.module';
import { RedisModule } from './redis.module';
import { CacheWeatherModule } from './cache-weather.module';
import { GeocodingModule } from './geocoding.module';
import { WeatherHandlersController } from 'src/interface/controllers/weather.controller';
import { WeatherService } from '../weather/weather.service';
import { WeatherFactory } from '../factories/weather-factory';

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
