import { Module } from '@nestjs/common';
import { WeatherHandlersService } from './weather-handlers.service';
import { WeatherHandlersController } from './weather-handlers.controller';
import { WeatherDomainModule } from 'src/weather-domain/weather-domain.module';
import { RedisModule } from 'src/redis/redis.module';
import { CityModule } from 'src/city/city.module';
import { CacheWeatherModule } from 'src/cache-weather/cache-weather.module';

@Module({
  imports: [WeatherDomainModule, RedisModule, CacheWeatherModule, CityModule],
  controllers: [WeatherHandlersController],
  providers: [WeatherHandlersService],
  exports: [WeatherHandlersService],
})
export class WeatherHandlersModule {}
