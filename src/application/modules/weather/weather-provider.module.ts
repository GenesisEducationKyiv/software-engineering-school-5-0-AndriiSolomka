import { Module } from '@nestjs/common';
import { OpenMeteoProviderService } from 'src/infrastructure/weather/open-meteo.provider';
import { WeatherApiProviderService } from 'src/infrastructure/weather/weather-api.provider';

import { GeocodingModule } from '../infrastructure/geocoding.module';
import { HttpClientModule } from '../infrastructure/http-client.module';

@Module({
  imports: [HttpClientModule, GeocodingModule],
  providers: [WeatherApiProviderService, OpenMeteoProviderService],
  exports: [WeatherApiProviderService, OpenMeteoProviderService],
})
export class WeatherProviderModule {}
