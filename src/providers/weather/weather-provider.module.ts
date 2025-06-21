import { Module } from '@nestjs/common';
import { WeatherApiProviderService } from './weather-api.provider';
import { FetchModule } from 'src/fetch/fetch.module';
import { OpenMeteoProviderService } from './open-meteo.provider';
import { GeocodingModule } from 'src/geocoding/geocoding.module';

@Module({
  imports: [FetchModule, GeocodingModule],
  providers: [WeatherApiProviderService, OpenMeteoProviderService],
  exports: [WeatherApiProviderService, OpenMeteoProviderService],
})
export class WeatherProviderModule {}
