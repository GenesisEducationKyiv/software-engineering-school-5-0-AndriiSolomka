import { Module } from '@nestjs/common';
import { WeatherCashService } from './weather-cash.service';
import { RedisModule } from 'src/redis/redis.module';

@Module({
  imports: [RedisModule],
  providers: [WeatherCashService],
  exports: [WeatherCashService],
})
export class WeatherCashModule {}
