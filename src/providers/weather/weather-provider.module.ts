import { Module } from '@nestjs/common';
import { WeatherApiProviderService } from './weather-api.provider';
import { HttpClientModule } from 'src/http-client/http-client.module';
import { OpenMeteoProviderService } from './open-meteo.provider';
import { GeocodingModule } from 'src/geocoding/geocoding.module';

@Module({
  imports: [HttpClientModule, GeocodingModule],
  providers: [WeatherApiProviderService, OpenMeteoProviderService],
  exports: [WeatherApiProviderService, OpenMeteoProviderService],
})
export class WeatherProviderModule {}
