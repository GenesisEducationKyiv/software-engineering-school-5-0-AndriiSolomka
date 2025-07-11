import { Module } from '@nestjs/common';
import { GeocodingModule } from 'src/libs/infrastructure/geocoding/geocoding.module';
import { HttpClientModule } from 'src/libs/infrastructure/http/http-client.module';

import { OpenMeteoProviderService } from './open-meteo.provider';
import { WeatherApiProviderService } from './weather-api.provider';

@Module({
  imports: [HttpClientModule, GeocodingModule],
  providers: [WeatherApiProviderService, OpenMeteoProviderService],
  exports: [WeatherApiProviderService, OpenMeteoProviderService],
})
export class WeatherProviderModule {}
