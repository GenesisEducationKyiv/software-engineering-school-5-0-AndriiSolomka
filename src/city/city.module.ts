import { Module } from '@nestjs/common';
import { CityService } from './city.service';
import { WeatherApiClientModule } from 'src/weather-api-client/weather-api-client.module';
import { CashModule } from 'src/cash/cash.module';

@Module({
  imports: [WeatherApiClientModule, CashModule],
  providers: [CityService],
  exports: [CityService],
})
export class CityModule {}
