import { Module } from '@nestjs/common';
import { WeatherService } from './weather.service';
import { WeatherController } from './weather.controller';
import { WeatherApiClientModule } from 'src/weather-api-client/weather-api-client.module';
import { WeatherCacheService } from './weather-cache.service';
import { RedisModule } from 'src/redis/redis.module';

@Module({
  imports: [WeatherApiClientModule, RedisModule],
  controllers: [WeatherController],
  providers: [WeatherService, WeatherCacheService],
})
export class WeatherModule {}
