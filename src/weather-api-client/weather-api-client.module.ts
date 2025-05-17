import { Module } from '@nestjs/common';
import { WeatherApiClientService } from './weather-api-client.service';
import { FetchModule } from 'src/fetch/fetch.module';

@Module({
  imports: [FetchModule],
  providers: [WeatherApiClientService],
  exports: [WeatherApiClientService],
})
export class WeatherApiClientModule {}
