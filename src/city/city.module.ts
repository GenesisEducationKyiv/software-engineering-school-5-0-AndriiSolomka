import { Module } from '@nestjs/common';
import { CityService } from './city.service';
import { WeatherDomainModule } from 'src/weather-domain/weather-domain.module';
import { CacheCityModule } from 'src/cache-city/cache-city.module';

@Module({
  imports: [WeatherDomainModule, CacheCityModule],
  providers: [CityService],
  exports: [CityService],
})
export class CityModule {}
