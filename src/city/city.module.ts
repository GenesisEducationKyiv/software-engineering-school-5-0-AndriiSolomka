import { Module } from '@nestjs/common';
import { CityService } from './city.service';
import { WeatherApiClientModule } from 'src/weather-api-client/weather-api-client.module';
import { CacheCityModule } from 'src/cache-city/cache-city.module';

@Module({
  imports: [WeatherApiClientModule, CacheCityModule],
  providers: [CityService],
  exports: [CityService],
})
export class CityModule {}
