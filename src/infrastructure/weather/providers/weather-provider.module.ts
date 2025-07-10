import { Module } from '@nestjs/common';
import { GeocodingModule } from 'src/application/modules/infrastructure/geocoding.module';
import { HttpClientModule } from 'src/application/modules/infrastructure/http-client.module';

import { OpenMeteoProviderService } from './open-meteo.provider';
import { WeatherApiProviderService } from './weather-api.provider';

@Module({
  imports: [HttpClientModule, GeocodingModule],
  providers: [WeatherApiProviderService, OpenMeteoProviderService],
  exports: [WeatherApiProviderService, OpenMeteoProviderService],
})
export class WeatherProviderModule {}
