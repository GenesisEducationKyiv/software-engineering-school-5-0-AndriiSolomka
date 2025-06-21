import { Module } from '@nestjs/common';
import { WeatherService } from './weather.service';
import { WeatherHandlersController } from './weather.controller';
import { RedisModule } from 'src/redis/redis.module';
import { CacheWeatherModule } from 'src/cache-weather/cache-weather.module';
import { WeatherProviderModule } from 'src/providers/weather/weather-provider.module';
import { GeocodingModule } from 'src/geocoding/geocoding.module';
import { WeatherToken } from './interfaces/weather.service.interface';
import { WeatherFactoryService } from './weather-factory.service';

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
    WeatherFactoryService,
    {
      provide: WeatherToken,
      useFactory: (factory: WeatherFactoryService) => factory.create(),
      inject: [WeatherFactoryService],
    },
  ],
  exports: [WeatherService],
})
export class WeatherModule {}
