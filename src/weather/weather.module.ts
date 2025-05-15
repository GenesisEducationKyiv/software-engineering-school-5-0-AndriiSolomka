import { Module } from '@nestjs/common';
import { WeatherService } from './weather.service';
import { WeatherController } from './weather.controller';
import { WeatherApiClientModule } from 'src/weather-api-client/weather-api-client.module';
import { RedisModule } from 'src/redis/redis.module';
import { CacheModule } from 'src/cache/cache.module';

@Module({
  imports: [WeatherApiClientModule, RedisModule, CacheModule],
  controllers: [WeatherController],
  providers: [WeatherService],
  exports: [WeatherService],
})
export class WeatherModule {}
