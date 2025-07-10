import { Module } from '@nestjs/common';
import { GeocodingModule } from 'src/libs/geocoding/geocoding.module';
import { HttpClientModule } from 'src/libs/http/http-client.module';

import { OpenMeteoProviderService } from './open-meteo.provider';
import { WeatherApiProviderService } from './weather-api.provider';

@Module({
  imports: [HttpClientModule, GeocodingModule],
  providers: [WeatherApiProviderService, OpenMeteoProviderService],
  exports: [WeatherApiProviderService, OpenMeteoProviderService],
})
export class WeatherProviderModule {}
