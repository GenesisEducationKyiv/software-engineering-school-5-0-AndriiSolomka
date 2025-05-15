import { Module } from '@nestjs/common';
import { WeatherService } from './weather.service';
import { WeatherController } from './weather.controller';
import { WeatherApiClientModule } from 'src/weather-api-client/weather-api-client.module';
import { RedisModule } from 'src/redis/redis.module';
import { CityModule } from 'src/city/city.module';
import { CacheWeatherModule } from 'src/cache-weather/cache-weather.module';

@Module({
  imports: [
    WeatherApiClientModule,
    RedisModule,
    CacheWeatherModule,
    CityModule,
  ],
  controllers: [WeatherController],
  providers: [WeatherService],
  exports: [WeatherService],
})
export class WeatherModule {}
