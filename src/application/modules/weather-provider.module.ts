import { Module } from '@nestjs/common';
import { HttpClientModule } from './http-client.module';
import { GeocodingModule } from './geocoding.module';
import { WeatherApiProviderService } from 'src/infrastructure/weather/weather-api.provider';
import { OpenMeteoProviderService } from 'src/infrastructure/weather/open-meteo.provider';

@Module({
  imports: [HttpClientModule, GeocodingModule],
  providers: [WeatherApiProviderService, OpenMeteoProviderService],
  exports: [WeatherApiProviderService, OpenMeteoProviderService],
})
export class WeatherProviderModule {}
