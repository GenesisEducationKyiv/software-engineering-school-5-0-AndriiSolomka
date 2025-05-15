import { Module } from '@nestjs/common';
import { CityService } from './city.service';
import { WeatherApiClientModule } from 'src/weather-api-client/weather-api-client.module';
import { CacheModule } from 'src/cache/cache.module';

@Module({
  imports: [WeatherApiClientModule, CacheModule],
  providers: [CityService],
  exports: [CityService],
})
export class CityModule {}
