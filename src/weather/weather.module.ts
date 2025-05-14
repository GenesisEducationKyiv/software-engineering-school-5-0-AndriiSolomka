import { Module } from '@nestjs/common';
import { WeatherService } from './weather.service';
import { WeatherController } from './weather.controller';
import { WeatherApiClientModule } from 'src/weather-api-client/weather-api-client.module';

@Module({
  imports: [WeatherApiClientModule],
  controllers: [WeatherController],
  providers: [WeatherService],
})
export class WeatherModule {}
